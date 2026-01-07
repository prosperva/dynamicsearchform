# Dynamic Search Component - Integration Guide

This guide walks you through integrating the Dynamic Search component into your existing Next.js project.

## Prerequisites

- Next.js 13+ (App Router)
- React 18+
- TypeScript (recommended)
- Material UI v6

## Step 1: Install Dependencies

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

## Step 2: Copy Required Files

Copy these files from this project to your project:

### Core Component Files

```
components/
└── DynamicSearch/
    ├── index.ts                    # Main export file
    ├── types.ts                    # TypeScript type definitions
    ├── DynamicSearch.tsx           # Main search component
    ├── FieldRenderer.tsx           # Field rendering logic
    ├── PillField.tsx              # Pill input field component
    ├── ModalSelectField.tsx       # Modal select field component
    └── FieldGroup.tsx             # Field grouping component
```

**File locations in this project:**
- `/components/DynamicSearch/index.ts`
- `/components/DynamicSearch/types.ts`
- `/components/DynamicSearch/DynamicSearch.tsx`
- `/components/DynamicSearch/FieldRenderer.tsx`
- `/components/DynamicSearch/PillField.tsx`
- `/components/DynamicSearch/ModalSelectField.tsx`
- `/components/DynamicSearch/FieldGroup.tsx`

### Copy Command (from project root)

```bash
# Create the directory structure in your project
mkdir -p your-project/components/DynamicSearch

# Copy all files
cp -r components/DynamicSearch/* your-project/components/DynamicSearch/
```

## Step 3: Set Up Material UI Theme (Optional but Recommended)

If you don't already have Material UI theme setup, add it to your root layout:

**File: `app/layout.tsx`**

```tsx
'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## Step 4: Create API Endpoints for Saved Searches (Optional)

If you want to persist saved searches to a database, you'll need to create API endpoints.

### Option A: Using Prisma (Recommended)

1. **Install Prisma**

```bash
npm install @prisma/client
npm install -D prisma
npx prisma init
```

2. **Add Database Schema**

**File: `prisma/schema.prisma`**

```prisma
model SavedSearch {
  id          String   @id @default(cuid())
  name        String
  params      Json
  createdAt   DateTime @default(now())
  createdBy   String
  visibility  String   @default("user") // "user" or "global"
  context     String?  // Optional: search context (e.g., "products", "users")
  description String?  // Optional: search description
}
```

3. **Run Migration**

```bash
npx prisma migrate dev --name add_saved_searches
npx prisma generate
```

4. **Create API Routes**

Copy the API implementation from `DATABASE_INTEGRATION.md`:

```bash
# Create API directory
mkdir -p app/api/saved-searches

# Create route files
touch app/api/saved-searches/route.ts
touch app/api/saved-searches/[id]/route.ts
```

Refer to [`DATABASE_INTEGRATION.md`](./DATABASE_INTEGRATION.md) for complete API implementation.

### Option B: Using Local Storage (Client-side only)

Skip API creation and manage saved searches in browser local storage. Example in Step 5.

## Step 5: Implement the Component in Your Page

### Basic Implementation (No Saved Searches)

**File: `app/your-page/page.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { DynamicSearch, FieldConfig } from '@/components/DynamicSearch';

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<Record<string, any> | null>(null);

  // Define your search fields
  const searchFields: FieldConfig[] = [
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
      options: [
        { label: 'Electronics', value: 'electronics' },
        { label: 'Clothing', value: 'clothing' },
        { label: 'Food', value: 'food' },
      ],
    },
    {
      name: 'inStock',
      label: 'In Stock Only',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'priceRange',
      label: 'Price Range',
      type: 'pill',
      pillType: 'number',
      allowRanges: true,
      placeholder: 'Enter prices (e.g., 10-50, 100)',
      defaultValue: [],
    },
  ];

  const handleSearch = (params: Record<string, any>) => {
    console.log('Search Parameters:', params);
    setSearchResults(params);
    // TODO: Make API call with params
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Product Search
        </Typography>
      </Box>

      <DynamicSearch
        fields={searchFields}
        onSearch={handleSearch}
        enableSaveSearch={false}
      />

      {/* Display results */}
      {searchResults && (
        <Box mt={4}>
          <Typography variant="h5">Search Results</Typography>
          <pre>{JSON.stringify(searchResults, null, 2)}</pre>
        </Box>
      )}
    </Container>
  );
}
```

### Advanced Implementation (With Saved Searches - Database)

**File: `app/your-page/page.tsx`**

```tsx
'use client';

import { useState, useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { DynamicSearch, FieldConfig, SavedSearch } from '@/components/DynamicSearch';

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<Record<string, any> | null>(null);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [currentUser] = useState('user_123'); // Get from your auth system
  const [isAdmin] = useState(false); // Get from your auth system

  // Fetch saved searches on mount
  useEffect(() => {
    fetchSavedSearches();
  }, []);

  const fetchSavedSearches = async () => {
    try {
      const response = await fetch('/api/saved-searches');
      if (response.ok) {
        const searches = await response.json();
        setSavedSearches(searches);
      }
    } catch (error) {
      console.error('Error fetching saved searches:', error);
    }
  };

  const handleSearch = async (params: Record<string, any>) => {
    console.log('Search Parameters:', params);
    setSearchResults(params);

    // Make your actual search API call here
    try {
      const response = await fetch('/api/your-search-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
      }
    } catch (error) {
      console.error('Error performing search:', error);
    }
  };

  const handleSaveSearch = async (search: SavedSearch) => {
    try {
      const response = await fetch('/api/saved-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(search),
      });

      if (response.ok) {
        const savedSearch = await response.json();
        setSavedSearches((prev) => [...prev, savedSearch]);
      }
    } catch (error) {
      console.error('Error saving search:', error);
    }
  };

  const handleLoadSearch = (searchId: string) => {
    console.log('Loading search:', searchId);
    // The component automatically loads the params into the form
  };

  const handleDeleteSearch = async (searchId: string) => {
    try {
      const response = await fetch(`/api/saved-searches/${searchId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSavedSearches((prev) => prev.filter((s) => s.id !== searchId));
      }
    } catch (error) {
      console.error('Error deleting search:', error);
    }
  };

  const handleRenameSearch = async (searchId: string, newName: string) => {
    try {
      const response = await fetch(`/api/saved-searches/${searchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });

      if (response.ok) {
        const updatedSearch = await response.json();
        setSavedSearches((prev) =>
          prev.map((s) => (s.id === searchId ? updatedSearch : s))
        );
      }
    } catch (error) {
      console.error('Error renaming search:', error);
    }
  };

  const handleChangeVisibility = async (searchId: string, visibility: 'user' | 'global') => {
    try {
      const response = await fetch(`/api/saved-searches/${searchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visibility }),
      });

      if (response.ok) {
        const updatedSearch = await response.json();
        setSavedSearches((prev) =>
          prev.map((s) => (s.id === searchId ? updatedSearch : s))
        );
      }
    } catch (error) {
      console.error('Error changing visibility:', error);
    }
  };

  const searchFields: FieldConfig[] = [
    // Your field configuration here
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Product Search
        </Typography>
      </Box>

      <DynamicSearch
        fields={searchFields}
        onSearch={handleSearch}
        onSave={handleSaveSearch}
        onLoad={handleLoadSearch}
        onDelete={handleDeleteSearch}
        onRename={handleRenameSearch}
        onChangeVisibility={handleChangeVisibility}
        savedSearches={savedSearches}
        enableSaveSearch={true}
        currentUser={currentUser}
        searchContext="products"
        allowCrossContext={false}
        isAdmin={isAdmin}
      />

      {/* Display your results */}
    </Container>
  );
}
```

### Advanced Implementation (With Saved Searches - Local Storage)

**File: `app/your-page/page.tsx`**

```tsx
'use client';

import { useState, useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { DynamicSearch, FieldConfig, SavedSearch } from '@/components/DynamicSearch';

export default function SearchPage() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  // Load saved searches from local storage
  useEffect(() => {
    const stored = localStorage.getItem('savedSearches');
    if (stored) {
      setSavedSearches(JSON.parse(stored));
    }
  }, []);

  // Save to local storage whenever savedSearches changes
  useEffect(() => {
    localStorage.setItem('savedSearches', JSON.stringify(savedSearches));
  }, [savedSearches]);

  const handleSearch = (params: Record<string, any>) => {
    console.log('Search:', params);
    // Your search logic
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

  const handleChangeVisibility = (searchId: string, visibility: 'user' | 'global') => {
    setSavedSearches((prev) =>
      prev.map((s) => (s.id === searchId ? { ...s, visibility } : s))
    );
  };

  const searchFields: FieldConfig[] = [
    // Your field configuration
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <DynamicSearch
        fields={searchFields}
        onSearch={handleSearch}
        onSave={handleSaveSearch}
        onDelete={handleDeleteSearch}
        onRename={handleRenameSearch}
        onChangeVisibility={handleChangeVisibility}
        savedSearches={savedSearches}
        enableSaveSearch={true}
        currentUser="local_user"
        isAdmin={false}
      />
    </Container>
  );
}
```

## Step 6: Configure Field Types

The component supports various field types. Here's a complete reference:

### Text Field
```tsx
{
  name: 'productName',
  label: 'Product Name',
  type: 'text',
  placeholder: 'Enter product name...',
  helperText: 'Search by product name',
  tooltip: 'Enter the name or partial name',
}
```

### Number Field
```tsx
{
  name: 'price',
  label: 'Price',
  type: 'number',
  placeholder: 'Enter price...',
}
```

### Date Field
```tsx
{
  name: 'dateAdded',
  label: 'Date Added After',
  type: 'date',
  helperText: 'Products added after this date',
}
```

### Checkbox
```tsx
{
  name: 'inStock',
  label: 'In Stock Only',
  type: 'checkbox',
  defaultValue: false,
}
```

### Radio Buttons
```tsx
{
  name: 'condition',
  label: 'Condition',
  type: 'radio',
  options: [
    { label: 'New', value: 'new' },
    { label: 'Used', value: 'used' },
    { label: 'Refurbished', value: 'refurbished' },
  ],
}
```

### Dropdown (Static Options)
```tsx
{
  name: 'brand',
  label: 'Brand',
  type: 'dropdown',
  options: [
    { label: 'Apple', value: 'apple' },
    { label: 'Samsung', value: 'samsung' },
  ],
}
```

### Dropdown (API-driven)
```tsx
{
  name: 'category',
  label: 'Category',
  type: 'dropdown',
  apiUrl: '/api/categories',
  helperText: 'Loaded from API',
}
```

### Dropdown (Custom API Field Mapping)
```tsx
{
  name: 'city',
  label: 'City',
  type: 'dropdown',
  apiUrl: '/api/cities',
  apiLabelField: 'name',  // API returns {id, name}
  apiValueField: 'id',    // instead of {value, label}
}
```

### Multi-select
```tsx
{
  name: 'tags',
  label: 'Tags',
  type: 'multiselect',
  options: [
    { label: 'Tag 1', value: 'tag1' },
    { label: 'Tag 2', value: 'tag2' },
  ],
  defaultValue: [],
}
```

### Pill Field (Text)
```tsx
{
  name: 'keywords',
  label: 'Keywords',
  type: 'pill',
  pillType: 'text',
  allowRanges: false,
  placeholder: 'Enter keywords and press Enter',
  defaultValue: [],
}
```

### Pill Field (Numbers with Ranges)
```tsx
{
  name: 'productIds',
  label: 'Product IDs',
  type: 'pill',
  pillType: 'number',
  allowRanges: true,
  placeholder: 'e.g., 1-5, 10, 15-20',
  helperText: 'Ranges expand (1-5 becomes 1,2,3,4,5)',
  defaultValue: [],
}
```

### Field Group
```tsx
{
  name: 'addressInfo',
  label: 'Address Information',
  type: 'group',
  helperText: 'Multiple fields grouped together',
  fields: [
    {
      name: 'street',
      label: 'Street',
      type: 'text',
    },
    {
      name: 'city',
      label: 'City',
      type: 'text',
    },
  ],
}
```

### Modal Select (Single)
```tsx
{
  name: 'country',
  label: 'Country',
  type: 'modal-select',
  options: [
    { label: 'United States', value: 'us' },
    { label: 'Canada', value: 'ca' },
    // ... many options
  ],
  helperText: 'Opens modal with searchable list',
}
```

### Modal Select (Multi-Select)
```tsx
{
  name: 'languages',
  label: 'Languages',
  type: 'modal-select',
  allowMultiple: true,  // Enable multi-select mode
  options: [
    { label: 'English', value: 'en' },
    { label: 'Spanish', value: 'es' },
    { label: 'French', value: 'fr' },
    // ... more options
  ],
  defaultValue: [],  // Required for multi-select
  helperText: 'Select multiple languages with checkboxes',
}
```

## Step 7: Create API Endpoints for Dropdowns (Optional)

If you're using API-driven dropdowns, create corresponding endpoints:

**Example: `app/api/categories/route.ts`**

```tsx
import { NextResponse } from 'next/server';

export async function GET() {
  // Fetch from your database
  const categories = [
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Food', value: 'food' },
  ];

  return NextResponse.json(categories);
}
```

**Example with custom field mapping: `app/api/cities/route.ts`**

```tsx
import { NextResponse } from 'next/server';

export async function GET() {
  // Returns {id, name} instead of {value, label}
  const cities = [
    { id: 1, name: 'New York' },
    { id: 2, name: 'Los Angeles' },
    { id: 3, name: 'Chicago' },
  ];

  return NextResponse.json(cities);
}
```

## Step 8: Customize Column Layout (Optional)

Control how many columns the search fields are displayed in using the `columnLayout` prop:

```tsx
// Auto mode (default) - adjusts based on field count
<DynamicSearch
  fields={searchFields}
  onSearch={handleSearch}
  columnLayout="auto"  // or just omit this prop
/>

// Fixed 1 column (full width)
<DynamicSearch
  fields={searchFields}
  onSearch={handleSearch}
  columnLayout={1}
/>

// Fixed 2 columns
<DynamicSearch
  fields={searchFields}
  onSearch={handleSearch}
  columnLayout={2}
/>

// Fixed 3 columns
<DynamicSearch
  fields={searchFields}
  onSearch={handleSearch}
  columnLayout={3}
/>

// Fixed 4 columns (very compact)
<DynamicSearch
  fields={searchFields}
  onSearch={handleSearch}
  columnLayout={4}
/>
```

**Auto mode behavior:**
- 1-3 fields: 1 column (full width)
- 4-6 fields: 2 columns
- 7-9 fields: 3 columns
- 10+ fields: 4 columns

The component is fully responsive and will automatically adjust to smaller screens.

## Step 9: Customize Styling (Optional)

The component uses Material UI's theming system. You can customize colors, fonts, and more:

**File: `app/layout.tsx`**

```tsx
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#your-primary-color',
    },
    secondary: {
      main: '#your-secondary-color',
    },
  },
  typography: {
    fontFamily: 'Your Font, sans-serif',
  },
});
```

## Troubleshooting

### Issue: "Module not found"
- Ensure all files are copied to the correct location
- Check that the import paths match your project structure
- Verify `@mui/material` is installed

### Issue: API endpoints return errors
- Check that your API routes are in the correct location
- Verify the endpoint URLs match what's configured in `apiUrl`
- Check browser console for CORS or network errors

### Issue: Saved searches don't persist
- For database: Ensure Prisma is set up correctly and migrations ran
- For local storage: Check browser console for localStorage errors
- Verify handlers are connected correctly

### Issue: Styles look broken
- Ensure Material UI theme provider is wrapping your app
- Check that `@emotion/react` and `@emotion/styled` are installed
- Verify you're using the correct MUI version (v6)

## Complete File Checklist

- [ ] Copied all 7 component files from `components/DynamicSearch/`
- [ ] Installed Material UI dependencies
- [ ] Set up Material UI theme provider
- [ ] Created search page with component implementation
- [ ] (Optional) Set up database with Prisma
- [ ] (Optional) Created API endpoints for saved searches
- [ ] (Optional) Created API endpoints for dropdown data
- [ ] Configured field definitions for your use case
- [ ] Tested search functionality
- [ ] Tested saved search functionality (if enabled)

## Next Steps

1. Review the [README.md](./README.md) for detailed component documentation
2. Check [DATABASE_INTEGRATION.md](./DATABASE_INTEGRATION.md) for complete API implementation
3. Customize field configurations for your specific needs
4. Integrate with your actual search/filter backend
5. Add authentication to saved searches API

## Support

For issues or questions:
- Review the demo implementation in `app/page.tsx`
- Check the type definitions in `components/DynamicSearch/types.ts`
- Refer to Material UI documentation for styling questions
