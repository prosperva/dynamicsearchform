# Dynamic Search Component for Next.js

A flexible, reusable search component built with Next.js and Material UI that supports unlimited fields, multiple input types, API-driven data fetching, and saved search functionality.

## Features

- **Unlimited Fields**: Add as many search fields as you need
- **Multiple Field Types**:
  - Text input
  - Number input
  - Date picker
  - Dropdown (single select) with built-in search/filter
  - Multi-select dropdown with built-in search/filter
  - Checkbox
  - Radio buttons
  - **Pill-based input** (NEW!)
  - **Field Groups** - Organize related fields under one label (NEW!)
- **Pill Field Features**:
  - Textarea input for comma-separated values
  - Support for number ranges (e.g., 100-150 expands to all numbers between)
  - Real-time parsing of comma-separated input (e.g., "100-150, 178, 190")
  - Visual chips display with remove functionality
  - Works with both text and numbers
- **API Integration**: Load dropdown options dynamically from API endpoints
- **Static Options**: Define dropdown/radio options directly in configuration
- **Enhanced Save Search**:
  - Save search parameters with custom names
  - **User or Global visibility** (NEW!)
  - Created by tracking
- **Enhanced Load Search**:
  - **Saved searches displayed in a dropdown** (NEW!)
  - Quick-load by selecting from the dropdown
  - Visual indicators for user/global searches (icons in dropdown)
  - Preview search parameters before loading
  - Edit and delete actions in dropdown (creator or admin only)
- **Field Tooltips**: Optional help icons with tooltips for field explanations
- **Responsive Design**: Works on all screen sizes
- **Material UI**: Beautiful, modern interface with Material Design
- **TypeScript**: Full type safety

## Installation

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled @mui/material-nextjs
```

## Usage

### Basic Example

```tsx
'use client';

import { DynamicSearch, FieldConfig, SavedSearch } from '@/components/DynamicSearch';
import { useState } from 'react';

export default function SearchPage() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  const fields: FieldConfig[] = [
    {
      name: 'productName',
      label: 'Product Name',
      type: 'text',
      placeholder: 'Enter product name...',
    },
    {
      name: 'category',
      label: 'Category',
      type: 'dropdown',
      apiUrl: '/api/categories', // Load from API
    },
    {
      name: 'priceMin',
      label: 'Min Price',
      type: 'number',
    },
    {
      name: 'inStock',
      label: 'In Stock Only',
      type: 'checkbox',
      defaultValue: false,
    },
  ];

  const handleSearch = (params: Record<string, any>) => {
    console.log('Search params:', params);
    // Perform your search logic here
  };

  const handleSaveSearch = (search: SavedSearch) => {
    setSavedSearches((prev) => [...prev, search]);
  };

  const handleDeleteSearch = (searchId: string) => {
    setSavedSearches((prev) => prev.filter((s) => s.id !== searchId));
  };

  const handleRenameSearch = (searchId: string, newName: string) => {
    setSavedSearches((prev) =>
      prev.map((s) => (s.id === searchId ? { ...s, name: newName } : s))
    );
  };

  return (
    <DynamicSearch
      fields={fields}
      onSearch={handleSearch}
      onSave={handleSaveSearch}
      onDelete={handleDeleteSearch}
      onRename={handleRenameSearch}
      savedSearches={savedSearches}
      enableSaveSearch={true}
      currentUser="user123"
      searchContext="products" // Isolate searches by page/context
      allowCrossContext={false} // Only show searches from this context
      isAdmin={false} // Set to true for admin users
    />
  );
}
```

### Multi-Page Application with Contexts

For large applications with multiple pages, use `searchContext` to differentiate saved searches:

```tsx
// Products Page
<DynamicSearch
  fields={productFields}
  onSearch={handleProductSearch}
  onSave={handleSave}
  savedSearches={allSearches} // All searches from database
  searchContext="products" // Only save/load "products" context searches
  allowCrossContext={false} // Hide searches from other contexts
  currentUser="user123"
/>

// Orders Page
<DynamicSearch
  fields={orderFields}
  onSearch={handleOrderSearch}
  onSave={handleSave}
  savedSearches={allSearches} // Same database
  searchContext="orders" // Different context
  allowCrossContext={false}
  currentUser="user123"
/>

// Admin Page - See all searches
<DynamicSearch
  fields={adminFields}
  onSearch={handleAdminSearch}
  onSave={handleSave}
  savedSearches={allSearches}
  searchContext="admin"
  allowCrossContext={true} // Can see searches from all contexts
  currentUser="admin_user"
/>
```

## Search Parameters

When the user clicks "Search", the `onSearch` callback receives an object containing all field values. See [SEARCH_PARAMS_EXAMPLE.md](SEARCH_PARAMS_EXAMPLE.md) for detailed examples including:

- What the params object looks like for each field type
- How to handle empty/default values
- Examples of using params with REST APIs, GraphQL, and database queries
- TypeScript type definitions
- Filtering out empty values

**Quick Example:**
```typescript
const handleSearch = (params: Record<string, any>) => {
  console.log(params);
  /* Output:
  {
    productName: "iPhone",
    category: "electronics",
    specificPrices: ["100", "101", ..., "150", "178"],  // Range expanded
    shippingFrom: ["us", "ca"],  // Multi-select array
    inStock: true,
    keywords: ["wireless", "bluetooth"]  // Pill field array
  }
  */
};
```

## Field Configuration

### Field Types

#### Text Field
```tsx
{
  name: 'searchTerm',
  label: 'Search Term',
  type: 'text',
  placeholder: 'Enter search term...',
  helperText: 'Optional helper text',
  required: false,
  tooltip: 'Optional tooltip that appears when hovering over the help icon'
}
```

#### Number Field
```tsx
{
  name: 'price',
  label: 'Price',
  type: 'number',
  defaultValue: 0
}
```

#### Date Field
```tsx
{
  name: 'startDate',
  label: 'Start Date',
  type: 'date',
  helperText: 'Select a start date'
}
```

#### Dropdown (Static Options)
```tsx
{
  name: 'brand',
  label: 'Brand',
  type: 'dropdown',
  options: [
    { label: 'Apple', value: 'apple' },
    { label: 'Samsung', value: 'samsung' },
    { label: 'Sony', value: 'sony' }
  ]
}
```

**Features:**
- Built-in search/filter - type to quickly find options
- Dropdown shows filtered results as you type
- Clear button to reset selection

#### Dropdown (API-Driven)
```tsx
{
  name: 'category',
  label: 'Category',
  type: 'dropdown',
  apiUrl: '/api/categories', // Must return DropdownOption[] or use field mapping
  helperText: 'Loaded from API'
}
```

**With Custom Field Mapping:**
```tsx
{
  name: 'city',
  label: 'City',
  type: 'dropdown',
  apiUrl: '/api/cities',
  apiLabelField: 'name', // API returns 'name' instead of 'label'
  apiValueField: 'id',   // API returns 'id' instead of 'value'
  helperText: 'Loaded from API with custom field mapping'
}
```

If your API returns data in a different format (e.g., `{id: 1, name: "Option 1"}`), use `apiLabelField` and `apiValueField` to map the fields. Defaults are `'label'` and `'value'`.

#### Multi-Select
```tsx
{
  name: 'tags',
  label: 'Tags',
  type: 'multiselect',
  options: [
    { label: 'Tag 1', value: 'tag1' },
    { label: 'Tag 2', value: 'tag2' }
  ],
  defaultValue: []
}
```

**Features:**
- Built-in search/filter - type to quickly find and select options
- Select All / Clear All buttons automatically included
- Displays selected values as chips with X to remove
- Works with both static options and API-driven data
- Dropdown shows filtered results as you type

#### Checkbox
```tsx
{
  name: 'featured',
  label: 'Featured Items Only',
  type: 'checkbox',
  defaultValue: false
}
```

#### Radio Buttons
```tsx
{
  name: 'condition',
  label: 'Condition',
  type: 'radio',
  options: [
    { label: 'New', value: 'new' },
    { label: 'Used', value: 'used' },
    { label: 'Refurbished', value: 'refurbished' }
  ]
}
```

#### Pill Field (Number with Ranges)
```tsx
{
  name: 'specificPrices',
  label: 'Specific Prices',
  type: 'pill',
  pillType: 'number',
  allowRanges: true,
  placeholder: 'Enter prices or ranges (e.g., 100-150, 178, 190)',
  helperText: 'Enter comma-separated values. Ranges will be automatically expanded.',
  defaultValue: []
}
```

**Example Usage:**
- Type `100-150` → Expands to: `100, 101, 102, ..., 150`
- Type `100-150, 178, 190` → Adds all values including the range expansion
- Values are parsed in real-time as you type
- Click the X on any chip to remove individual values

#### Pill Field (Text Keywords)
```tsx
{
  name: 'keywords',
  label: 'Keywords',
  type: 'pill',
  pillType: 'text',
  allowRanges: false,
  placeholder: 'Enter comma-separated keywords',
  helperText: 'Enter keywords separated by commas',
  defaultValue: []
}
```

**Example Usage:**
- Type `wireless` and press Enter → Adds "wireless" as a chip
- Type `wireless, bluetooth, fast` and press Enter → Adds all three as separate chips

#### Field Group
Group related fields under a single label while keeping them as separate API parameters:

```tsx
{
  name: 'farmInfo',
  label: 'Farm Information',
  type: 'group',
  helperText: 'Multiple fields grouped under one label',
  tooltip: 'This group demonstrates how to organize related fields together',
  fields: [
    {
      name: 'farmName',
      label: 'Farm Name',
      type: 'text',
      placeholder: 'Enter farm name...',
    },
    {
      name: 'animalType',
      label: 'Animal Type',
      type: 'dropdown',
      options: [
        { label: 'Cattle', value: 'cattle' },
        { label: 'Sheep', value: 'sheep' },
        { label: 'Pigs', value: 'pigs' },
      ],
    },
  ],
}
```

**Key Features:**
- Visual grouping with a bordered container
- Fields are nested in configuration but **flattened for API submission**
- Can include any field type (text, dropdown, date, etc.)
- Supports tooltips and helper text for the group

**API Output:**
When the search is submitted, grouped fields are automatically flattened:
```typescript
// User fills in: Farm Name = "Green Acres", Animal Type = "cattle"
// API receives:
{
  farmName: "Green Acres",  // Flattened from group
  animalType: "cattle",     // Flattened from group
  // ... other fields
}
```

The group is purely for UI organization - the API receives individual field values, not a nested object.

#### Modal Select (Single Selection)
Opens a modal dialog with a searchable list for single value selection:

```tsx
{
  name: 'country',
  label: 'Country',
  type: 'modal-select',
  options: [
    { label: 'United States', value: 'us' },
    { label: 'Canada', value: 'ca' },
    { label: 'United Kingdom', value: 'uk' },
    // ... more options
  ],
  helperText: 'Select a country from the modal',
  tooltip: 'Opens a searchable modal dialog for selection',
}
```

**Key Features:**
- Lazy-loaded modal (only opens when needed)
- Built-in search/filter functionality
- Works with static options or API data
- Disabled text field shows selected value
- Select/Clear buttons for interaction

#### Modal Select (Multi-Selection)
Enable multi-select mode by setting `allowMultiple: true`:

```tsx
{
  name: 'languages',
  label: 'Languages',
  type: 'modal-select',
  allowMultiple: true,
  options: [
    { label: 'English', value: 'en' },
    { label: 'Spanish', value: 'es' },
    { label: 'French', value: 'fr' },
    // ... more options
  ],
  defaultValue: [],
  helperText: 'Select multiple languages',
  tooltip: 'Use checkboxes to select multiple values',
}
```

**Multi-Select Features:**
- Checkboxes for each option
- Toggle selection by clicking
- Display all selected values comma-separated
- Returns array of values
- Built-in search/filter works same as single-select

**When to use modal-select vs multiselect:**
- **modal-select**: Better for long lists (10+ options) where search/filter is helpful
- **multiselect**: Better for shorter lists (< 10 options) with inline display

## API Endpoint Format

When using `apiUrl` for dropdowns, your API should return an array of objects with this structure:

```tsx
export interface DropdownOption {
  label: string;
  value: string | number;
}
```

Example API route (`app/api/categories/route.ts`):

```tsx
import { NextResponse } from 'next/server';

export async function GET() {
  const categories = [
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Books', value: 'books' }
  ];

  return NextResponse.json(categories);
}
```

### Custom Field Mapping

If your API returns data in a different format, use `apiLabelField` and `apiValueField` to map the fields:

**API Response:**
```json
[
  { "id": 1, "name": "New York", "country": "US" },
  { "id": 2, "name": "London", "country": "UK" }
]
```

**Field Configuration:**
```tsx
{
  name: 'city',
  label: 'City',
  type: 'dropdown',
  apiUrl: '/api/cities',
  apiLabelField: 'name',  // Maps to 'label'
  apiValueField: 'id'     // Maps to 'value'
}
```

The component will automatically transform the API response to use 'label' and 'value' internally.

## Component Props

### DynamicSearchProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `fields` | `FieldConfig[]` | Yes | Array of field configurations |
| `onSearch` | `(params: Record<string, any>) => void` | Yes | Callback when search is triggered |
| `onSave` | `(search: SavedSearch) => void` | No | Callback when search is saved |
| `onLoad` | `(searchId: string) => void` | No | Callback when saved search is loaded |
| `onDelete` | `(searchId: string) => void` | No | Callback when search is deleted |
| `onRename` | `(searchId: string, newName: string) => void` | No | Callback when search is renamed |
| `savedSearches` | `SavedSearch[]` | No | Array of saved searches |
| `enableSaveSearch` | `boolean` | No | Enable save/load functionality (default: true) |
| `searchButtonText` | `string` | No | Custom search button text (default: 'Search') |
| `resetButtonText` | `string` | No | Custom reset button text (default: 'Reset') |
| `currentUser` | `string` | No | Current user identifier for tracking who created searches (default: 'current_user') |
| `searchContext` | `string` | No | Context/page identifier to isolate saved searches (e.g., 'products', 'orders') |
| `allowCrossContext` | `boolean` | No | Allow viewing/loading searches from other contexts (default: false) |
| `isAdmin` | `boolean` | No | Whether current user is an admin (affects delete permissions for global searches, default: false) |
| `columnLayout` | `'auto' \| 1 \| 2 \| 3 \| 4` | No | Column layout: 'auto' (default, adjusts based on field count), 1 (full width), 2 (half), 3 (third), or 4 (quarter) |

### FieldConfig

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | Yes | Unique field identifier |
| `label` | `string` | Yes | Display label for the field |
| `type` | `FieldType` | Yes | Type of field (text, number, date, dropdown, multiselect, checkbox, radio, pill, group) |
| `defaultValue` | `any` | No | Default value for the field |
| `options` | `DropdownOption[]` | No | Static options for dropdown/radio/multiselect |
| `apiUrl` | `string` | No | API endpoint to fetch options dynamically |
| `apiLabelField` | `string` | No | Field name for label in API response (default: 'label') |
| `apiValueField` | `string` | No | Field name for value in API response (default: 'value') |
| `required` | `boolean` | No | Whether the field is required |
| `placeholder` | `string` | No | Placeholder text |
| `helperText` | `string` | No | Helper text displayed below the field |
| `pillType` | `'number' \| 'text'` | No | Type of pill field (only for type='pill') |
| `allowRanges` | `boolean` | No | Allow range syntax like "100-150" (only for pillType='number') |
| `tooltip` | `string` | No | Tooltip text that appears when hovering over the help icon next to the field label |
| `fields` | `FieldConfig[]` | No | Nested field configurations (only for type='group') |
| `allowMultiple` | `boolean` | No | Allow multiple selections with checkboxes (only for type='modal-select', default: false) |

### SavedSearch

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier |
| `name` | `string` | User-provided name for the search |
| `params` | `Record<string, any>` | Search parameters |
| `createdAt` | `string` | ISO timestamp of creation |
| `visibility` | `'user' \| 'global'` | Whether search is private or shared |
| `createdBy` | `string` | User who created the search |
| `context` | `string` | Context/page where search was created (e.g., 'products', 'orders') |
| `description` | `string` | Optional description of the search |

## Running the Demo

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features Demo

The demo page showcases:
- **15+ different search fields** with various types
- **Dynamic column layout** - automatically adjusts from 1-4 columns based on field count
- **Field grouping** - Farm Information group with nested fields that flatten for API submission
- **Pill-based fields** with range support:
  - Specific Prices (numbers with ranges like 100-150)
  - Keywords (text chips)
  - Product IDs (numbers with range expansion)
- **API-driven dropdowns** (categories, countries, cities) with built-in search/filter
- **Custom API field mapping** - City dropdown demonstrates mapping {id, name} to {value, label}
- **Searchable dropdowns** - type to filter options in dropdown and multiselect fields
- **Enhanced save search** with user/global visibility selection
- **Saved searches dropdown** - searchable dropdown with edit/delete actions for authorized users
- **Real-time search results display** with formatted output showing flattened group values
- **Permission-based actions** - creator or admin can edit and delete saved searches
- **Chip-based displays** for array values
- **Tooltips** - Hover over help icons to see additional field information

## Customization

### Column Layout

Control how many columns the search fields are displayed in:

**Auto Mode (Default)**
```tsx
<DynamicSearch
  fields={fields}
  onSearch={handleSearch}
  // columnLayout defaults to 'auto'
/>
```
Auto mode automatically adjusts columns based on field count:
- 1-3 fields: 1 column (full width)
- 4-6 fields: 2 columns
- 7-9 fields: 3 columns
- 10+ fields: 4 columns

**Fixed Column Layout**
```tsx
// Single column (full width) - great for forms with few fields
<DynamicSearch
  fields={fields}
  onSearch={handleSearch}
  columnLayout={1}
/>

// Two columns - balanced layout for medium forms
<DynamicSearch
  fields={fields}
  onSearch={handleSearch}
  columnLayout={2}
/>

// Three columns - compact layout
<DynamicSearch
  fields={fields}
  onSearch={handleSearch}
  columnLayout={3}
/>

// Four columns - very compact, best for many fields
<DynamicSearch
  fields={fields}
  onSearch={handleSearch}
  columnLayout={4}
/>
```

The component is fully responsive and will automatically adjust to smaller screens regardless of the column layout setting.

### Styling

The component uses Material UI's theming system. You can customize the theme in [app/layout.tsx](app/layout.tsx):

```tsx
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});
```

### Validation

Add custom validation by using the `required` field property and implementing validation logic in your `onSearch` callback.

## TypeScript Types

The component is fully typed. Import types from the component:

```tsx
import type {
  FieldConfig,
  SavedSearch,
  DropdownOption,
  FieldType
} from '@/components/DynamicSearch';
```

## Database Integration

For production use, you'll want to persist saved searches to a database. See [DATABASE_INTEGRATION.md](DATABASE_INTEGRATION.md) for comprehensive documentation including:

- Database schema examples (SQL, Prisma, Drizzle)
- Complete API route implementations
- Authentication integration
- Permission validation logic
- Security best practices
- Query optimization strategies
- Migration from local state

## Column Layout

The component now automatically determines the optimal column layout based on the number of fields:

- **1-3 fields**: 1 column (full width) - Good for simple searches
- **4-6 fields**: 2 columns - Balanced layout
- **7-9 fields**: 3 columns - Moderate density
- **10+ fields**: 4 columns - High density for complex searches

This ensures optimal use of screen space regardless of how many fields you configure.

## Delete and Rename Permissions

Saved searches can be deleted and renamed based on these rules:

- **User Searches**: Only the creator can delete or rename
- **Global Searches**: Creator OR admin can delete or rename
- The delete button (X) and edit icon only appear on chips if the user has permission

Set `isAdmin={true}` for admin users to allow them to delete or rename any global search.

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!
