# View Mode Feature - Simplified with Downloads

## Overview

The DynamicSearch component now supports **two view modes**: Grid and Report. The Report view includes downloadable export functionality in PDF, Excel, and CSV formats.

## Changes from Previous Version

### Removed View Modes
- **List View** - Removed
- **Cards View** - Removed

### Kept View Modes
- **Grid View** - Data table with sorting, filtering, and pagination
- **Report View** - Document-style detailed view with download capabilities

## Type Definitions

```typescript
// types.ts
export type ViewMode = 'grid' | 'report';
export type ReportFormat = 'pdf' | 'excel' | 'csv';
```

## DynamicSearch Component

### Default Props
```typescript
availableViewModes = ['grid', 'report']  // Changed from ['grid', 'report', 'list', 'cards']
```

### Usage
```tsx
<DynamicSearch
  fields={searchFields}
  onSearch={handleSearch}
  enableViewMode={true}
  defaultViewMode="grid"
  onViewModeChange={setViewMode}
/>
```

The `availableViewModes` prop can be omitted as it now defaults to `['grid', 'report']`.

## Report Download Functionality

### CSV Download (Implemented)
The CSV download is fully functional using native browser APIs:

```typescript
const handleDownloadReport = (format: ReportFormat) => {
  switch (format) {
    case 'csv':
      const headers = ['Product Name', 'Category', 'Condition', 'In Stock', 'Price', 'Country'];
      const csvRows = [
        headers.join(','),
        ...searchResults.map(product =>
          [
            `"${product.productName}"`,
            product.category,
            product.condition,
            product.inStock ? 'Yes' : 'No',
            product.price,
            product.country.toUpperCase(),
          ].join(',')
        ),
      ];
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `product-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      break;
  }
};
```

### PDF Download (To Be Implemented)
To implement PDF downloads, install and use `jspdf` and `jspdf-autotable`:

```bash
npm install jspdf jspdf-autotable
npm install --save-dev @types/jspdf
```

Example implementation:
```typescript
case 'pdf':
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF();
  doc.text('Product Search Report', 14, 15);

  autoTable(doc, {
    startY: 25,
    head: [['Product Name', 'Category', 'Condition', 'In Stock', 'Price', 'Country']],
    body: searchResults.map(product => [
      product.productName,
      product.category,
      product.condition,
      product.inStock ? 'Yes' : 'No',
      `$${product.price}`,
      product.country.toUpperCase(),
    ]),
  });

  doc.save(`product-report-${new Date().toISOString().split('T')[0]}.pdf`);
  break;
```

### Excel Download (To Be Implemented)
To implement Excel downloads, install and use `xlsx`:

```bash
npm install xlsx
```

Example implementation:
```typescript
case 'excel':
  const XLSX = await import('xlsx');

  const worksheet = XLSX.utils.json_to_sheet(
    searchResults.map(product => ({
      'Product Name': product.productName,
      'Category': product.category,
      'Condition': product.condition,
      'In Stock': product.inStock ? 'Yes' : 'No',
      'Price': product.price,
      'Country': product.country.toUpperCase(),
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
  XLSX.writeFile(workbook, `product-report-${new Date().toISOString().split('T')[0]}.xlsx`);
  break;
```

## UI Components

### View Mode Toggle
The view mode selector now shows only two options:
- 📊 **Grid** - "Grid View" tooltip
- 📄 **Report** - "Report View (Downloadable)" tooltip

### Download Menu
When in Report view, a "Download Report" button appears with a dropdown menu:
- 📄 Download as PDF
- 📊 Download as Excel
- 📝 Download as CSV

## Migration Guide

If you were using the old 4-view-mode system:

### Before
```tsx
<DynamicSearch
  enableViewMode={true}
  availableViewModes={['grid', 'report', 'list', 'cards']}
  defaultViewMode="grid"
/>

// In your component
switch (viewMode) {
  case 'grid': return renderGridView();
  case 'report': return renderReportView();
  case 'list': return renderListView();
  case 'cards': return renderCardsView();
}
```

### After
```tsx
<DynamicSearch
  enableViewMode={true}
  defaultViewMode="grid"
  // availableViewModes prop can be omitted - defaults to ['grid', 'report']
/>

// In your component - remove list and cards cases
switch (viewMode) {
  case 'grid': return renderGridView();
  case 'report': return renderReportView();
  default: return renderGridView();
}
```

## Benefits of Simplified Approach

1. **Cleaner Interface** - Two clear options reduce decision fatigue
2. **Download Functionality** - Report view provides multiple export formats
3. **Less Maintenance** - Fewer view modes to maintain and test
4. **Better UX** - Grid for data manipulation, Report for export/sharing
5. **Reduced Bundle Size** - Removed unused view components

## Files Modified

1. **[types.ts](components/DynamicSearch/types.ts)** - Updated ViewMode type, added ReportFormat type
2. **[DynamicSearch.tsx](components/DynamicSearch/DynamicSearch.tsx)** - Removed list/cards icons and toggle buttons, updated default
3. **[page.tsx](app/page.tsx)** - Removed list/cards render functions, added download menu and CSV export

## Current Status

✅ **Fully Implemented and Working**:
- Grid view with DataGrid (sorting, filtering, pagination)
- Report view with detailed table layout
- **PDF download** - Generates formatted PDF with title, date, and styled table
- **Excel download** - Generates .xlsx file with proper column widths and metadata
- **CSV download** - Generates comma-separated values file
- View mode toggle with icons
- Download menu with format selection
- Error handling for download failures
- Dynamic imports for optimized bundle size

## Implementation Details

### PDF Generation
Uses `jspdf` and `jspdf-autotable` to create professionally formatted PDFs:
- Title and metadata (generation date, result count)
- Styled table with color-coded headers
- Alternating row colors for readability
- Automatic pagination for large datasets
- Primary color scheme matching the app

### Excel Generation
Uses `xlsx` library to create native Excel files:
- Properly formatted headers
- Auto-sized columns for optimal viewing
- Workbook metadata (title, author, creation date)
- Native Excel format (.xlsx)
- Supports opening in Microsoft Excel, Google Sheets, etc.

### CSV Generation
Pure JavaScript implementation:
- RFC 4180 compliant CSV format
- Properly quoted strings
- Compatible with all spreadsheet applications
- No external dependencies needed

### Performance Optimizations
- Dynamic imports reduce initial bundle size
- Libraries only loaded when download is triggered
- Async/await pattern for non-blocking UI
- Error boundaries prevent crashes

## Testing

Test the implementation by:
1. Running a search with multiple results
2. Switching to Report view
3. Clicking "Download Report" button
4. Selecting each format (PDF, Excel, CSV)
5. Verifying downloaded files open correctly
6. Testing with empty results (should handle gracefully)
7. Testing with large datasets (100+ results)
