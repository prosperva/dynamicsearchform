# DynamicSearch Component - Complete Feature Summary

## Overview

A powerful, flexible, and reusable search component with declarative field configuration, custom field support, multiple view modes, and downloadable reports.

---

## 🎯 Core Features

### 1. **Declarative Field Configuration**

Define your search form using a simple configuration array:

```typescript
const fields: FieldConfig[] = [
  {
    name: 'productName',
    label: 'Product Name',
    type: 'text',
    placeholder: 'Enter product name...',
    required: true,
  },
  {
    name: 'category',
    label: 'Category',
    type: 'dropdown',
    apiUrl: '/api/categories', // Loads options from API
  },
];
```

**Supported Field Types:**
- ✅ `text` - Single-line text input
- ✅ `number` - Numeric input
- ✅ `dropdown` - Select from options (static or API-driven)
- ✅ `checkbox` - Boolean checkbox
- ✅ `radio` - Radio button group
- ✅ `date` - Date picker
- ✅ `multiselect` - Autocomplete with multiple selection
- ✅ `pill` - Tag/chip input with range support (e.g., "100-150")
- ✅ `group` - Grouped fields under one label
- ✅ `modal-select` - Modal dialog with searchable list (single or multiple)
- ✅ `accordion` - Collapsible section for organizing fields

### 2. **Custom Fields (Imperative Approach)**

For complex scenarios requiring interdependent fields or custom logic:

```typescript
<DynamicSearch
  fields={standardFields}
  customFields={(values, onChange) => (
    <>
      <Grid item xs={12} sm={6}>
        <TextField
          select
          label="Brand"
          value={values.brand || ''}
          onChange={(e) => {
            onChange('brand', e.target.value);
            onChange('model', ''); // Reset dependent field
          }}
        >
          {/* Options */}
        </TextField>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          select
          label="Model"
          value={values.model || ''}
          onChange={(e) => onChange('model', e.target.value)}
          disabled={!values.brand} // Dependent on brand
        >
          {/* Populate based on brand */}
        </TextField>
      </Grid>
    </>
  )}
/>
```

**Use Cases for Custom Fields:**
- Field interdependencies (cascading dropdowns)
- Real-time calculations
- Conditional field visibility
- Third-party component integration
- Complex validation logic

📖 See [CUSTOM_FIELDS_GUIDE.md](CUSTOM_FIELDS_GUIDE.md) for detailed examples

### 3. **API-Driven Dropdowns**

Automatically fetch options from your backend:

```typescript
{
  name: 'country',
  label: 'Country',
  type: 'dropdown',
  apiUrl: '/api/countries',
  apiLabelField: 'name',  // Custom field mapping
  apiValueField: 'code',  // Custom field mapping
}
```

**Features:**
- Automatic API fetching
- Custom field mapping for non-standard APIs
- Loading states
- Error handling

### 4. **Field Validation with Conditional Requirements**

Built-in validation with visual feedback and conditional requirements:

```typescript
{
  name: 'email',
  label: 'Email Address',
  type: 'text',
  required: true, // Always required (both search and edit)
  placeholder: 'user@example.com',
}

{
  name: 'productName',
  label: 'Product Name',
  type: 'text',
  requiredForEdit: true, // Required when editing, optional when searching
}

{
  name: 'searchQuery',
  label: 'Search Query',
  type: 'text',
  requiredForSearch: true, // Required when searching, optional when editing
}
```

**Form Mode Support:**
- Set `formMode='search'` for search forms (default)
- Set `formMode='edit'` for edit forms
- Fields automatically validate based on the current mode

📖 See [CONDITIONAL_VALIDATION.md](CONDITIONAL_VALIDATION.md) for detailed examples

### 5. **Field Copying**

Copy values between fields with one click:

```typescript
{
  name: 'billingAddress',
  label: 'Billing Address',
  type: 'text',
},
{
  name: 'shippingAddress',
  label: 'Shipping Address',
  type: 'text',
  copyFromField: 'billingAddress',
  copyButtonText: 'Copy from Billing',
}
```

### 6. **Pill Fields with Range Support**

Enter individual values or ranges that auto-expand:

```typescript
{
  name: 'productIds',
  label: 'Product IDs',
  type: 'pill',
  pillType: 'number',
  allowRanges: true,
  placeholder: 'e.g., 1-5, 10, 15-20',
}
```

Input: `1-3, 10` → Output: `[1, 2, 3, 10]`

---

## 📊 View Modes & Downloads

### Grid View
Interactive data table with:
- ✅ Sorting
- ✅ Filtering
- ✅ Pagination
- ✅ Row actions (View/Edit)

### Report View
Document-style detailed view with:
- ✅ **PDF Download** - Formatted with title, date, styled tables
- ✅ **Excel Download** - Native .xlsx with metadata
- ✅ **CSV Download** - RFC 4180 compliant

```typescript
<DynamicSearch
  enableViewMode={true}
  defaultViewMode="grid"
  onViewModeChange={setViewMode}
/>
```

📖 See [VIEW_MODE_FEATURE.md](VIEW_MODE_FEATURE.md) for details

---

## 💾 Saved Searches

### Features
- **Save search parameters** for reuse
- **User vs Global visibility** - Personal or shared searches
- **Preview before loading** - See parameters before applying
- **Edit and rename** - Update search names and visibility
- **Delete management** - Remove unwanted searches
- **Context filtering** - Organize by use case

```typescript
<DynamicSearch
  enableSaveSearch={true}
  savedSearches={savedSearches}
  onSave={handleSave}
  onLoad={handleLoad}
  onDelete={handleDelete}
  onRename={handleRename}
  onChangeVisibility={handleChangeVisibility}
  currentUser="user123"
  searchContext="products"
/>
```

---

## 🔍 View & Edit Modals

### Separate Actions
DataGrid includes two action buttons per row:

**View Button:**
- Read-only display of record details
- Clean table layout with formatted values
- "Switch to Edit Mode" button
- "Close" button to exit

**Edit Button:**
- Editable form with all fields
- Validation support
- "Save Changes" and "Cancel" buttons
- Accordion sections for organization

### How Data is Loaded
When a row action is clicked:
1. Row data stored in state: `setSelectedRow(row)`
2. Data passed as `initialValues` to DynamicSearch
3. DynamicSearch populates all fields via `useEffect`
4. Fields maintain reactivity and validation

```typescript
// Example flow
const handleEditRow = (row: any) => {
  setSelectedRow(row);        // Store row data
  setDialogMode('edit');      // Set mode
  setEditDialogOpen(true);    // Open dialog
};

<DynamicSearch
  initialValues={selectedRow}  // Populates fields
  onSearch={handleSave}        // Save handler
/>
```

---

## 🎨 Layout & Styling

### Column Layout
Control field columns:

```typescript
<DynamicSearch
  columnLayout={2}  // 2 fields per row
  // Or: 1, 3, 4, or 'auto' (based on field count)
/>
```

### Modal Positioning
Position all dialogs:

```typescript
<DynamicSearch
  modalPosition="top-right"
  // Options: 'center', 'top', 'bottom', 'left', 'right',
  // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
/>
```

### Tooltips
Add helpful hints:

```typescript
{
  name: 'price',
  label: 'Price',
  type: 'number',
  tooltip: 'Enter the product price in USD. Special discounts may apply for bulk orders.',
}
```

---

## 📦 Complete Props Reference

```typescript
interface DynamicSearchProps {
  // Required
  fields: FieldConfig[];
  onSearch: (params: Record<string, any>, viewMode?: ViewMode) => void;

  // Saved Searches
  onSave?: (search: SavedSearch) => void;
  onLoad?: (searchId: string) => void;
  onDelete?: (searchId: string) => void;
  onRename?: (searchId: string, newName: string) => void;
  onChangeVisibility?: (searchId: string, visibility: SearchVisibility) => void;
  savedSearches?: SavedSearch[];
  enableSaveSearch?: boolean;
  currentUser?: string;
  searchContext?: string;
  allowCrossContext?: boolean;
  isAdmin?: boolean;

  // Customization
  searchButtonText?: string;
  resetButtonText?: string;
  columnLayout?: 'auto' | 1 | 2 | 3 | 4;
  initialValues?: Record<string, any>;
  modalPosition?: ModalPosition;
  formMode?: 'search' | 'edit'; // Default: 'search'

  // View Modes
  enableViewMode?: boolean;
  defaultViewMode?: ViewMode;
  availableViewModes?: ViewMode[];
  onViewModeChange?: (viewMode: ViewMode) => void;

  // Custom Fields
  customFields?: (values: Record<string, any>, onChange: (name: string, value: any) => void) => React.ReactNode;
}

interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean; // Always required
  requiredForEdit?: boolean; // Required in edit mode
  requiredForSearch?: boolean; // Required in search mode
  // ... other properties
}
```

---

## 🚀 Quick Start Examples

### Basic Search Form

```tsx
<DynamicSearch
  fields={[
    { name: 'query', label: 'Search', type: 'text' },
    { name: 'category', label: 'Category', type: 'dropdown', options: [...] },
  ]}
  onSearch={(params) => console.log(params)}
/>
```

### With Saved Searches

```tsx
<DynamicSearch
  fields={searchFields}
  onSearch={handleSearch}
  enableSaveSearch={true}
  savedSearches={savedSearches}
  onSave={(search) => setSavedSearches([...savedSearches, search])}
  onLoad={(id) => console.log('Load search:', id)}
/>
```

### With Custom Fields

```tsx
<DynamicSearch
  fields={baseFields}
  onSearch={handleSearch}
  customFields={(values, onChange) => (
    <Grid item xs={12}>
      <TextField
        label="Custom Field"
        value={values.custom || ''}
        onChange={(e) => onChange('custom', e.target.value)}
      />
    </Grid>
  )}
/>
```

### With View Modes & Downloads

```tsx
<DynamicSearch
  fields={searchFields}
  onSearch={handleSearch}
  enableViewMode={true}
  defaultViewMode="grid"
  onViewModeChange={setViewMode}
/>

{/* Then render results based on viewMode */}
{viewMode === 'grid' && <DataGrid rows={results} columns={columns} />}
{viewMode === 'report' && <ReportView results={results} />}
```

---

## 📚 Documentation Files

- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Step-by-step integration guide
- **[DATABASE_INTEGRATION.md](DATABASE_INTEGRATION.md)** - Backend integration examples
- **[SEARCH_PARAMS_EXAMPLE.md](SEARCH_PARAMS_EXAMPLE.md)** - Search parameter handling
- **[VIEW_MODE_FEATURE.md](VIEW_MODE_FEATURE.md)** - View modes and downloads
- **[VIEW_MODE_UPDATES.md](VIEW_MODE_UPDATES.md)** - Recent updates to view modes
- **[CUSTOM_FIELDS_GUIDE.md](CUSTOM_FIELDS_GUIDE.md)** - Custom fields with examples
- **[CONDITIONAL_VALIDATION.md](CONDITIONAL_VALIDATION.md)** - Conditional field validation

---

## 🎯 Real-World Use Cases

### E-Commerce Product Search
- Filter by category, price range, brand
- Pill fields for specific product IDs
- Save frequently used searches
- Export results to Excel for inventory

### CRM Customer Lookup
- Search by name, email, company
- Date range filters for registration
- Modal select for multiple tags
- View customer details read-only
- Edit customer information

### Document Management
- Search by title, author, date
- Cascading dropdowns for department → project
- Custom fields for document type-specific filters
- Download search results as PDF report

### Analytics Dashboard
- Interdependent date pickers (start/end)
- Real-time calculated fields
- Save common report queries
- Export to Excel for further analysis

---

## ✨ Key Benefits

1. **Declarative** - Define fields with simple configuration
2. **Flexible** - Custom fields for complex scenarios
3. **Reusable** - One component for search, edit, and view
4. **Type-Safe** - Full TypeScript support
5. **Accessible** - Material-UI components
6. **Performant** - Dynamic imports, lazy loading
7. **Extensible** - Plugin architecture for custom field types
8. **Well-Documented** - Comprehensive guides and examples

---

## 🔧 Performance Optimizations

- **Dynamic Imports** - PDF/Excel libraries loaded only when needed
- **Lazy API Loading** - Dropdowns fetch data on first open
- **Debounced Search** - Optional debouncing for real-time search
- **Virtualization** - Support for large dropdown lists
- **Memoization** - Optimized re-renders

---

## 🧪 Testing Checklist

- [ ] Standard field types render correctly
- [ ] API dropdowns load and display data
- [ ] Field validation shows errors
- [ ] Required fields block submission
- [ ] Pill fields accept ranges
- [ ] Custom fields update state
- [ ] Saved searches persist
- [ ] View mode switches work
- [ ] PDF/Excel/CSV downloads work
- [ ] View/Edit modals function properly
- [ ] Field copying works
- [ ] Accordion sections expand/collapse

---

## 📝 Migration Guide

### From Old Search Component

**Before:**
```tsx
<OldSearchForm
  onSubmit={handleSubmit}
>
  <TextField name="query" />
  <Select name="category" />
  <Button type="submit">Search</Button>
</OldSearchForm>
```

**After:**
```tsx
<DynamicSearch
  fields={[
    { name: 'query', label: 'Search Query', type: 'text' },
    { name: 'category', label: 'Category', type: 'dropdown', options: [...] },
  ]}
  onSearch={handleSubmit}
/>
```

---

## 🎓 Next Steps

1. **Start Simple** - Begin with basic text and dropdown fields
2. **Add Features Gradually** - Enable saved searches, view modes
3. **Implement Custom Fields** - Add interdependent fields as needed
4. **Integrate Backend** - Connect to your API endpoints
5. **Customize Styling** - Adjust layout and modal positions
6. **Test Thoroughly** - Verify all features work as expected

Happy coding! 🚀
