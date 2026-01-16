# View Mode Selection Feature

## Overview

The DynamicSearch component supports view mode selection with **downloadable reports**, allowing users to choose how search results should be displayed and exported. Users can view data as a grid or detailed report, with the report view offering export in PDF, Excel, and CSV formats.

## Available View Modes

- **Grid** - Interactive data grid with sorting, filtering, and pagination (ideal for data manipulation)
- **Report** - Document-style detailed view with download capabilities (ideal for export and sharing)

## Usage

### Basic Setup

```tsx
import { DynamicSearch, ViewMode } from '@/components/DynamicSearch';

const [viewMode, setViewMode] = useState<ViewMode>('grid');

const handleSearch = (params: Record<string, any>, selectedViewMode?: ViewMode) => {
  console.log('Search Parameters:', params);
  console.log('View Mode:', selectedViewMode);

  // Fetch and display results based on selectedViewMode
  const results = fetchResults(params);
  setSearchResults(results);
  setHasSearched(true);
};

<DynamicSearch
  fields={searchFields}
  onSearch={handleSearch}
  enableViewMode={true}
  defaultViewMode="grid"
  availableViewModes={['grid', 'report', 'list', 'cards']}
  onViewModeChange={setViewMode}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableViewMode` | `boolean` | `false` | Enable the view mode selector |
| `defaultViewMode` | `ViewMode` | `'grid'` | Default view mode when component mounts |
| `availableViewModes` | `ViewMode[]` | `['grid', 'report']` | Array of available view modes to show |
| `onViewModeChange` | `(viewMode: ViewMode) => void` | `undefined` | Callback fired when view mode changes |

### onSearch Signature Update

The `onSearch` callback now receives an optional second parameter:

```typescript
onSearch: (params: Record<string, any>, viewMode?: ViewMode) => void
```

## UI Components

### View Mode Selector
The view mode selector displays as a toggle button group with icons and labels:

- 📊 **Grid** - Uses `ViewModule` icon, "Grid View" tooltip
- 📄 **Report** - Uses `Description` icon, "Report View (Downloadable)" tooltip

### Download Menu (Report View Only)
When in Report view, a "Download Report" button appears with a dropdown menu offering three export formats:

- 📄 **Download as PDF** - Formatted PDF with styled tables
- 📊 **Download as Excel** - Native .xlsx format
- 📝 **Download as CSV** - Comma-separated values

Each option shows an appropriate icon for better UX.

## Example: Full Implementation

```tsx
'use client';

import { useState } from 'react';
import { DynamicSearch, FieldConfig, ViewMode } from '@/components/DynamicSearch';
import { DataGrid } from '@mui/x-data-grid';
import { List, Card, Paper } from '@mui/material';

export default function SearchPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = (params: Record<string, any>, selectedViewMode?: ViewMode) => {
    // Fetch results from API
    const searchResults = fetchResults(params);
    setResults(searchResults);

    // View mode is automatically tracked in state via onViewModeChange
    console.log('Searching with view mode:', selectedViewMode);
  };

  const renderResults = () => {
    switch (viewMode) {
      case 'grid':
        return <DataGrid rows={results} columns={columns} />;

      case 'report':
        return (
          <Paper sx={{ p: 3 }}>
            <h2>Search Report</h2>
            {results.map(item => (
              <div key={item.id}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </Paper>
        );

      default:
        return <DataGrid rows={results} columns={columns} />;
    }
  };

  return (
    <>
      <DynamicSearch
        fields={searchFields}
        onSearch={handleSearch}
        enableViewMode={true}
        defaultViewMode="grid"
        onViewModeChange={setViewMode}
      />

      {results.length > 0 && renderResults()}
    </>
  );
}
```

## Download Functionality

All three export formats are fully implemented with dynamic imports for optimal performance:

### PDF Export
```typescript
// Automatically generates formatted PDF with:
// - Title and generation timestamp
// - Total results count
// - Styled table with headers
// - Alternating row colors
// - Proper pagination for large datasets
```

### Excel Export
```typescript
// Creates native .xlsx file with:
// - Formatted headers
// - Auto-sized columns
// - Workbook metadata
// - Compatible with Excel, Google Sheets, etc.
```

### CSV Export
```typescript
// Pure JavaScript implementation:
// - RFC 4180 compliant format
// - Properly escaped values
// - Works with all spreadsheet apps
```

## Integration with Saved Searches

Saved searches now support storing the preferred view mode:

```typescript
interface SavedSearch {
  id: string;
  name: string;
  params: Record<string, any>;
  viewMode?: ViewMode; // Preferred view mode
  // ... other fields
}
```

When a user loads a saved search, you can restore their preferred view mode:

```typescript
const handleLoadSearch = (searchId: string) => {
  const search = savedSearches.find(s => s.id === searchId);
  if (search) {
    setFormValues(search.params);
    if (search.viewMode) {
      setViewMode(search.viewMode);
    }
  }
};
```

## Benefits

1. **Dual-Purpose Interface** - View data interactively or prepare for export
2. **Multiple Export Formats** - Choose the format that works for your workflow
3. **Professional Output** - Formatted PDFs and Excel files ready for sharing
4. **Optimized Performance** - Dynamic imports keep bundle size small
5. **Error Handling** - Graceful fallbacks if downloads fail
6. **Saved Preferences** - View mode can be saved with search parameters

## Use Cases

### Grid View
Perfect for:
- Interactive data exploration
- Sorting and filtering results
- Quick data scanning
- Editing records inline
- Pagination of large datasets

### Report View + Downloads
Perfect for:
- **PDF** - Executive reports, presentations, archival
- **Excel** - Further analysis, pivot tables, charts
- - Data migration, database imports, simple backups
- Sharing results with stakeholders
- Offline data access

## Notes

- The view mode selector appears between the search fields and action buttons
- The selected view mode is passed to `onSearch` callback
- Changes to view mode don't trigger a search - users must click the search button
- View mode persists across searches until changed by the user
- Download button only appears when in Report view with results
- Downloads use dynamic imports to minimize initial bundle size
- All formats include timestamp in filename for easy organization
- Error handling with user-friendly messages if downloads fail

## Browser Compatibility

- Works in all modern browsers
- Uses MUI ToggleButtonGroup component
- Fully accessible with keyboard navigation
- Touch-friendly on mobile devices
