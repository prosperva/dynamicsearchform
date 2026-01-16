# Edit Pattern Comparison: Current vs. Recommended

## Current Implementation ❌

### What It Does

```tsx
// app/page.tsx (lines 348-362)
const handleEditRow = (row: any) => {
  setSelectedRow(row);  // Uses stale data from grid
  setDialogMode('edit');
  setEditDialogOpen(true);
};

// In dialog (lines 878-889)
<DynamicSearch
  key={`edit-${selectedRow.id}`}
  initialValues={selectedRow}  // Stale data!
  formMode="edit"
/>
```

### Problems

1. **Stale Data** - Uses data from when grid was loaded, which could be hours old
2. **No Refresh** - Never checks if data has changed since grid load
3. **Lost Updates** - If another user edited the record, their changes will be overwritten
4. **Incomplete Data** - Grid only shows subset of fields; edit form might need more
5. **No Conflict Detection** - Can't detect if record was modified by someone else

### Timeline Example

```
9:00 AM - User A loads grid with Product #123 (price: $100)
9:05 AM - User B edits Product #123, changes price to $150
9:10 AM - User A clicks edit on Product #123
          ❌ Form shows $100 (stale data from 9:00 AM)
          ❌ User A changes something else, saves
          ❌ Price reverts to $100, overwriting User B's change
          ❌ Lost update!
```

---

## Recommended Implementation ✅

### What It Does

```tsx
const handleEditRow = (row: any) => {
  setSelectedRecordId(row.id);  // Store only ID
  setEditDialogOpen(true);
};

// In dialog
useEffect(() => {
  if (open && recordId) {
    // Fetch fresh data from API
    fetch(`/api/products/${recordId}`)
      .then(res => res.json())
      .then(data => {
        setFreshData(data);
        setVersion(data.version); // For optimistic locking
      });
  }
}, [open, recordId]);

<DynamicSearch
  initialValues={freshData}  // Fresh data from API!
  formMode="edit"
/>
```

### Benefits

1. **Fresh Data** - Always loads latest version from database
2. **Conflict Detection** - Version number detects concurrent edits
3. **Complete Data** - Gets all fields, not just what's in grid
4. **Safe Updates** - Prevents lost updates with optimistic locking
5. **Better UX** - Shows loading state, handles errors gracefully

### Timeline Example

```
9:00 AM - User A loads grid with Product #123 (price: $100)
9:05 AM - User B edits Product #123, changes price to $150, version 1→2
9:10 AM - User A clicks edit on Product #123
          ✅ API fetches fresh data (price: $150, version: 2)
          ✅ Form shows $150 (current data)
9:11 AM - User A changes something else, saves with version: 2
          ✅ Server accepts (version matches)
          ✅ No data lost!

Alternative scenario:
9:10 AM - User A clicks edit → fetches data (version: 2)
9:11 AM - User C quickly edits and saves (version: 2→3)
9:12 AM - User A saves with version: 2
          ✅ Server rejects (409 Conflict)
          ✅ Error: "Record was modified by another user"
          ✅ User A can refresh to get latest
          ✅ No data lost!
```

---

## Key Differences

| Aspect | Current (❌) | Recommended (✅) |
|--------|-------------|------------------|
| **Data Source** | Grid row (stale) | API fetch (fresh) |
| **When Loaded** | When grid loaded | When dialog opens |
| **Freshness** | Could be hours old | Always current |
| **Conflict Detection** | None | Version-based |
| **Loading State** | None | Shows spinner |
| **Error Handling** | None | Retry button |
| **Lost Updates** | Possible | Prevented |
| **Complete Data** | Only grid columns | All fields |

---

## Migration Guide

### Step 1: Change State Management

```tsx
// Before ❌
const [selectedRow, setSelectedRow] = useState<any>(null);

// After ✅
const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
const [freshData, setFreshData] = useState<any>(null);
const [loading, setLoading] = useState(false);
const [version, setVersion] = useState<number>(0);
```

### Step 2: Update Edit Handler

```tsx
// Before ❌
const handleEditRow = (row: any) => {
  setSelectedRow(row);
  setEditDialogOpen(true);
};

// After ✅
const handleEditRow = (row: any) => {
  setSelectedRecordId(row.id); // Store ID only
  setEditDialogOpen(true);
};
```

### Step 3: Add Data Fetching

```tsx
// Add this effect
useEffect(() => {
  if (editDialogOpen && selectedRecordId) {
    fetchFreshData();
  }

  if (!editDialogOpen) {
    // Reset when closed
    setFreshData(null);
    setLoading(false);
    setError('');
  }
}, [editDialogOpen, selectedRecordId]);

const fetchFreshData = async () => {
  setLoading(true);
  setError('');

  try {
    const response = await fetch(`/api/products/${selectedRecordId}`);
    if (!response.ok) throw new Error('Failed to fetch');

    const data = await response.json();
    setFreshData(data);
    setVersion(data.version || 0);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Step 4: Update Dialog Content

```tsx
// Before ❌
<DialogContent>
  <DynamicSearch
    initialValues={selectedRow}  // Stale!
    formMode="edit"
  />
</DialogContent>

// After ✅
<DialogContent>
  {loading && <CircularProgress />}

  {error && (
    <Alert severity="error">
      {error}
      <Button onClick={fetchFreshData}>Retry</Button>
    </Alert>
  )}

  {freshData && !loading && (
    <DynamicSearch
      key={`edit-${selectedRecordId}-${version}`}
      initialValues={freshData}  // Fresh!
      formMode="edit"
    />
  )}
</DialogContent>
```

### Step 5: Add Optimistic Locking to Save

```tsx
const handleSave = async (editedData: Record<string, any>) => {
  try {
    const response = await fetch(`/api/products/${selectedRecordId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editedData,
        version, // Send current version
      }),
    });

    if (response.status === 409) {
      // Version conflict
      setError('Record was modified by another user. Please refresh.');
      return;
    }

    if (!response.ok) throw new Error('Save failed');

    const updated = await response.json();
    onSave(updated);
    setEditDialogOpen(false);

  } catch (err) {
    setError(err.message);
  }
};
```

---

## Backend API Requirements

Your API should support optimistic locking:

```typescript
// GET /api/products/:id
// Returns record with version number
{
  id: 123,
  productName: "Widget",
  price: 100,
  version: 5,  // Version number
  updatedAt: "2024-01-16T10:30:00Z"
}

// PUT /api/products/:id
// Request includes version
{
  productName: "Updated Widget",
  price: 150,
  version: 5  // Must match current version
}

// Responses:
// 200 OK - Success, returns updated record with version: 6
// 409 Conflict - Version mismatch, record was modified
{
  error: "Version conflict",
  currentVersion: 7,
  message: "Record was modified by another user"
}
// 404 Not Found - Record doesn't exist
```

---

## Summary

**Current Implementation:**
- ❌ Uses stale data from grid
- ❌ No conflict detection
- ❌ Risk of lost updates
- ❌ Poor user experience

**Recommended Implementation:**
- ✅ Fetches fresh data on edit
- ✅ Detects concurrent edits
- ✅ Prevents lost updates
- ✅ Better error handling
- ✅ Loading states
- ✅ Professional UX

**Bottom Line:** Always fetch fresh data when editing to ensure data integrity and prevent lost updates!
