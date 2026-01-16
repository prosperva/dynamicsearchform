# Conditional Field Validation

## Overview

The DynamicSearch component supports conditional field validation based on form mode. This allows you to configure fields that are optional for searching but required for editing (or vice versa) **directly in the field configuration** without manual mapping.

---

## The Problem

Previously, if you wanted fields to be required only in edit mode, you had to manually map through your fields:

```typescript
// ❌ OLD APPROACH - Manual mapping required
const editFields: FieldConfig[] = searchFields.map((field) => {
  if (['productName', 'category', 'condition', 'price'].includes(field.name)) {
    return { ...field, required: true };
  }
  return field;
});

<DynamicSearch fields={editFields} />
```

This was cumbersome and required maintaining separate field configurations.

---

## The Solution

Now you can configure conditional validation **directly in the field config**:

```typescript
// ✅ NEW APPROACH - Declarative configuration
const searchFields: FieldConfig[] = [
  {
    name: 'productName',
    label: 'Product Name',
    type: 'text',
    requiredForEdit: true, // Required when editing, optional when searching
  },
  {
    name: 'category',
    label: 'Category',
    type: 'dropdown',
    apiUrl: '/api/categories',
    requiredForEdit: true, // Required when editing, optional when searching
  },
  {
    name: 'price',
    label: 'Price',
    type: 'number',
    requiredForEdit: true, // Required when editing, optional when searching
  },
];

// Use the same fields for both search and edit!
<DynamicSearch fields={searchFields} formMode="search" />
<DynamicSearch fields={searchFields} formMode="edit" />
```

---

## Field Configuration Properties

The `FieldConfig` interface now supports three validation properties:

### `required?: boolean`
Always required, regardless of form mode.
```typescript
{
  name: 'email',
  label: 'Email Address',
  type: 'text',
  required: true, // Always required (both search and edit)
}
```

### `requiredForEdit?: boolean`
Only required when `formMode='edit'`.
```typescript
{
  name: 'productName',
  label: 'Product Name',
  type: 'text',
  requiredForEdit: true, // Required in edit mode, optional in search mode
}
```

### `requiredForSearch?: boolean`
Only required when `formMode='search'`.
```typescript
{
  name: 'searchQuery',
  label: 'Search Query',
  type: 'text',
  requiredForSearch: true, // Required in search mode, optional in edit mode
}
```

---

## Form Mode

The `DynamicSearchProps` interface includes a new prop:

```typescript
formMode?: 'search' | 'edit'; // Default: 'search'
```

### Example: Search Form (Default)
```typescript
<DynamicSearch
  fields={fields}
  onSearch={handleSearch}
  // formMode defaults to 'search'
  // Fields with requiredForSearch will be validated
  // Fields with requiredForEdit will NOT be validated
/>
```

### Example: Edit Form
```typescript
<DynamicSearch
  fields={fields}
  onSearch={handleSave}
  formMode="edit"
  initialValues={selectedRow}
  // formMode set to 'edit'
  // Fields with requiredForEdit will be validated
  // Fields with requiredForSearch will NOT be validated
/>
```

---

## Complete Working Example

```typescript
'use client';

import { useState } from 'react';
import { DynamicSearch, FieldConfig } from '@/components/DynamicSearch';

export default function ProductPage() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Single field configuration used for BOTH search and edit
  const fields: FieldConfig[] = [
    {
      name: 'productName',
      label: 'Product Name',
      type: 'text',
      placeholder: 'Enter product name...',
      requiredForEdit: true, // Required when editing
    },
    {
      name: 'category',
      label: 'Category',
      type: 'dropdown',
      apiUrl: '/api/categories',
      requiredForEdit: true, // Required when editing
    },
    {
      name: 'price',
      label: 'Price',
      type: 'number',
      requiredForEdit: true, // Required when editing
    },
    {
      name: 'inStock',
      label: 'In Stock',
      type: 'checkbox',
      defaultValue: false,
      // Not required in any mode
    },
  ];

  const handleSearch = (params: Record<string, any>) => {
    console.log('Search params:', params);
    // Perform search - no validation errors for empty optional fields
  };

  const handleEdit = (params: Record<string, any>) => {
    console.log('Save params:', params);
    // Save changes - validation will enforce required fields
  };

  return (
    <>
      {/* Search Form - All fields optional */}
      <DynamicSearch
        fields={fields}
        onSearch={handleSearch}
        searchButtonText="Search"
        formMode="search" // Optional fields are truly optional
      />

      {/* Edit Dialog - Some fields required */}
      <Dialog open={editDialogOpen}>
        <DialogContent>
          <DynamicSearch
            fields={fields}
            onSearch={handleEdit}
            searchButtonText="Save Changes"
            initialValues={selectedProduct}
            formMode="edit" // requiredForEdit fields become required
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
```

---

## Validation Behavior

The validation logic follows this priority:

1. **If `required: true`** → Always required (both search and edit modes)
2. **If `formMode === 'edit'` and `requiredForEdit: true`** → Required in edit mode
3. **If `formMode === 'search'` and `requiredForSearch: true`** → Required in search mode
4. **Otherwise** → Not required

### Example Scenarios

| Field Config | formMode='search' | formMode='edit' |
|-------------|------------------|----------------|
| `required: true` | Required ✓ | Required ✓ |
| `requiredForEdit: true` | Optional | Required ✓ |
| `requiredForSearch: true` | Required ✓ | Optional |
| No required props | Optional | Optional |

---

## Benefits

### ✅ **Declarative Configuration**
No more manually mapping fields to add validation. Configure it once, use it everywhere.

### ✅ **Single Source of Truth**
Use the same field configuration for both search and edit forms.

### ✅ **Type-Safe**
Full TypeScript support with autocomplete for `requiredForEdit` and `requiredForSearch`.

### ✅ **Flexible**
Support for fields that are:
- Always required (`required`)
- Required only in edit mode (`requiredForEdit`)
- Required only in search mode (`requiredForSearch`)
- Never required (no property)

### ✅ **Cleaner Code**
Before:
```typescript
const editFields = searchFields.map(field => {
  if (['productName', 'category'].includes(field.name)) {
    return { ...field, required: true };
  }
  return field;
});
```

After:
```typescript
const fields = [
  { name: 'productName', type: 'text', requiredForEdit: true },
  { name: 'category', type: 'dropdown', requiredForEdit: true },
];
```

---

## Migration Guide

### Before (Manual Mapping)

```typescript
const searchFields: FieldConfig[] = [
  { name: 'productName', label: 'Product Name', type: 'text' },
  { name: 'category', label: 'Category', type: 'dropdown' },
  { name: 'price', label: 'Price', type: 'number' },
];

const editFields: FieldConfig[] = searchFields.map((field) => {
  if (['productName', 'category', 'price'].includes(field.name)) {
    return { ...field, required: true };
  }
  return field;
});

// Search form
<DynamicSearch fields={searchFields} onSearch={handleSearch} />

// Edit form
<DynamicSearch fields={editFields} onSearch={handleSave} />
```

### After (Declarative Config)

```typescript
const fields: FieldConfig[] = [
  {
    name: 'productName',
    label: 'Product Name',
    type: 'text',
    requiredForEdit: true
  },
  {
    name: 'category',
    label: 'Category',
    type: 'dropdown',
    requiredForEdit: true
  },
  {
    name: 'price',
    label: 'Price',
    type: 'number',
    requiredForEdit: true
  },
];

// Search form
<DynamicSearch fields={fields} onSearch={handleSearch} formMode="search" />

// Edit form
<DynamicSearch fields={fields} onSearch={handleSave} formMode="edit" />
```

---

## Advanced Use Case: Hybrid Validation

You can mix all validation types:

```typescript
const fields: FieldConfig[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'text',
    required: true, // Always required
  },
  {
    name: 'searchKeyword',
    label: 'Keyword',
    type: 'text',
    requiredForSearch: true, // Required only when searching
  },
  {
    name: 'productName',
    label: 'Product Name',
    type: 'text',
    requiredForEdit: true, // Required only when editing
  },
  {
    name: 'notes',
    label: 'Notes',
    type: 'text',
    // Never required
  },
];
```

---

## TypeScript Types

```typescript
export type FormMode = 'search' | 'edit';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean; // Always required
  requiredForEdit?: boolean; // Required in edit mode
  requiredForSearch?: boolean; // Required in search mode
  // ... other properties
}

export interface DynamicSearchProps {
  fields: FieldConfig[];
  onSearch: (params: Record<string, any>, viewMode?: ViewMode) => void;
  formMode?: FormMode; // Default: 'search'
  // ... other props
}
```

---

## Summary

Conditional field validation allows you to:
- ✅ Configure validation behavior in the field definition
- ✅ Eliminate manual field mapping
- ✅ Use the same field configuration for multiple forms
- ✅ Support complex validation scenarios declaratively

This feature makes your code cleaner, more maintainable, and type-safe!
