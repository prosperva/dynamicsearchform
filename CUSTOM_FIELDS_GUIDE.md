# Custom Fields Guide

## Overview

While the DynamicSearch component provides a declarative field configuration approach, developers can also inject **custom fields** with full control over rendering, validation, and interdependencies. This gives you the freedom to implement complex UI logic that goes beyond the standard field types.

## When to Use Custom Fields

Use custom fields when you need:
- **Field interdependencies** - One field's value affects another field
- **Complex validation** - Custom business logic beyond required/optional
- **Special UI components** - Third-party components or custom designs
- **Dynamic field visibility** - Show/hide fields based on other values
- **Custom data transformations** - Format data before display or submission
- **Real-time calculations** - Update fields based on calculations

## How It Works

The `customFields` prop accepts a render function that receives:
1. **values** - Current form values (read-only object)
2. **onChange** - Function to update any field value

```typescript
customFields?: (
  values: Record<string, any>,
  onChange: (name: string, value: any) => void
) => React.ReactNode
```

## Basic Example

### Simple Custom Field

```tsx
<DynamicSearch
  fields={[]} // Can be empty if using only custom fields
  onSearch={handleSearch}
  customFields={(values, onChange) => (
    <Grid item xs={12}>
      <TextField
        label="Custom Field"
        value={values.customField || ''}
        onChange={(e) => onChange('customField', e.target.value)}
        fullWidth
      />
    </Grid>
  )}
/>
```

## Advanced Example: Interdependent Fields

### Scenario: Category Selection Populates Description

When a user selects a category from a dropdown, a textarea automatically populates with a predefined description.

```tsx
'use client';

import { useState } from 'react';
import { Grid, TextField, MenuItem, Alert } from '@mui/material';
import { DynamicSearch } from '@/components/DynamicSearch';

const categoryDescriptions: Record<string, string> = {
  electronics: 'Consumer electronics including computers, phones, and accessories.',
  'home-garden': 'Home improvement, furniture, garden tools, and outdoor equipment.',
  clothing: 'Apparel, footwear, and fashion accessories for all ages.',
  books: 'Physical and digital books, magazines, and educational materials.',
};

export default function CustomFieldsExample() {
  const handleSearch = (params: Record<string, any>) => {
    console.log('Search with custom fields:', params);
    // params will include: { category, description, customNote, ...other fields }
  };

  return (
    <DynamicSearch
      fields={[
        // Standard fields can still be used
        {
          name: 'productName',
          label: 'Product Name',
          type: 'text',
          placeholder: 'Enter product name...',
        },
      ]}
      onSearch={handleSearch}
      columnLayout={2}
      customFields={(values, onChange) => (
        <>
          {/* Category Dropdown */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Category"
              value={values.category || ''}
              onChange={(e) => {
                const newCategory = e.target.value;
                onChange('category', newCategory);

                // Automatically populate description when category changes
                const description = categoryDescriptions[newCategory] || '';
                onChange('description', description);
              }}
              fullWidth
              helperText="Select a category - description will auto-populate"
            >
              <MenuItem value="electronics">Electronics</MenuItem>
              <MenuItem value="home-garden">Home & Garden</MenuItem>
              <MenuItem value="clothing">Clothing</MenuItem>
              <MenuItem value="books">Books</MenuItem>
            </TextField>
          </Grid>

          {/* Auto-populated Description */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Description"
              value={values.description || ''}
              onChange={(e) => onChange('description', e.target.value)}
              fullWidth
              multiline
              rows={3}
              helperText="Auto-filled based on category (editable)"
            />
          </Grid>

          {/* Conditional Field - Only show if category is selected */}
          {values.category && (
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mt: 1 }}>
                Selected Category: <strong>{values.category}</strong>
              </Alert>
            </Grid>
          )}
        </>
      )}
    />
  );
}
```

## Example: Price Range Calculator

Calculate total based on quantity and unit price:

```tsx
customFields={(values, onChange) => (
  <>
    <Grid item xs={12} sm={4}>
      <TextField
        type="number"
        label="Quantity"
        value={values.quantity || 0}
        onChange={(e) => {
          const quantity = parseFloat(e.target.value) || 0;
          onChange('quantity', quantity);

          // Recalculate total
          const unitPrice = values.unitPrice || 0;
          onChange('total', quantity * unitPrice);
        }}
        fullWidth
      />
    </Grid>

    <Grid item xs={12} sm={4}>
      <TextField
        type="number"
        label="Unit Price ($)"
        value={values.unitPrice || 0}
        onChange={(e) => {
          const unitPrice = parseFloat(e.target.value) || 0;
          onChange('unitPrice', unitPrice);

          // Recalculate total
          const quantity = values.quantity || 0;
          onChange('total', quantity * unitPrice);
        }}
        fullWidth
      />
    </Grid>

    <Grid item xs={12} sm={4}>
      <TextField
        type="number"
        label="Total ($)"
        value={values.total || 0}
        InputProps={{
          readOnly: true,
        }}
        fullWidth
        helperText="Calculated automatically"
      />
    </Grid>
  </>
)}
```

## Example: Cascading Dropdowns

Country → State → City selection:

```tsx
const statesByCountry: Record<string, string[]> = {
  us: ['California', 'Texas', 'New York', 'Florida'],
  ca: ['Ontario', 'Quebec', 'British Columbia', 'Alberta'],
  uk: ['England', 'Scotland', 'Wales', 'Northern Ireland'],
};

const citiesByState: Record<string, string[]> = {
  California: ['Los Angeles', 'San Francisco', 'San Diego'],
  Texas: ['Houston', 'Dallas', 'Austin'],
  Ontario: ['Toronto', 'Ottawa', 'Mississauga'],
  England: ['London', 'Manchester', 'Birmingham'],
};

customFields={(values, onChange) => {
  const states = values.country ? statesByCountry[values.country] : [];
  const cities = values.state ? citiesByState[values.state] : [];

  return (
    <>
      <Grid item xs={12} sm={4}>
        <TextField
          select
          label="Country"
          value={values.country || ''}
          onChange={(e) => {
            onChange('country', e.target.value);
            // Reset dependent fields
            onChange('state', '');
            onChange('city', '');
          }}
          fullWidth
        >
          <MenuItem value="us">United States</MenuItem>
          <MenuItem value="ca">Canada</MenuItem>
          <MenuItem value="uk">United Kingdom</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          select
          label="State/Province"
          value={values.state || ''}
          onChange={(e) => {
            onChange('state', e.target.value);
            // Reset city when state changes
            onChange('city', '');
          }}
          fullWidth
          disabled={!values.country}
        >
          {states.map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          select
          label="City"
          value={values.city || ''}
          onChange={(e) => onChange('city', e.target.value)}
          fullWidth
          disabled={!values.state}
        >
          {cities.map((city) => (
            <MenuItem key={city} value={city}>
              {city}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </>
  );
}}
```

## Example: Conditional Visibility

Show additional fields based on checkbox:

```tsx
customFields={(values, onChange) => (
  <>
    <Grid item xs={12}>
      <FormControlLabel
        control={
          <Checkbox
            checked={values.hasSpecialRequirements || false}
            onChange={(e) => onChange('hasSpecialRequirements', e.target.checked)}
          />
        }
        label="Has Special Requirements"
      />
    </Grid>

    {/* Only show these fields if checkbox is checked */}
    {values.hasSpecialRequirements && (
      <>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Requirement Type"
            value={values.requirementType || ''}
            onChange={(e) => onChange('requirementType', e.target.value)}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Details"
            value={values.requirementDetails || ''}
            onChange={(e) => onChange('requirementDetails', e.target.value)}
            fullWidth
            multiline
            rows={2}
          />
        </Grid>
      </>
    )}
  </>
)}
```

## Example: Integration with Third-Party Components

Using a date range picker:

```tsx
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

customFields={(values, onChange) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Grid item xs={12} sm={6}>
      <DatePicker
        label="Start Date"
        value={values.startDate ? dayjs(values.startDate) : null}
        onChange={(newValue) => onChange('startDate', newValue?.toISOString())}
        slotProps={{
          textField: { fullWidth: true }
        }}
      />
    </Grid>

    <Grid item xs={12} sm={6}>
      <DatePicker
        label="End Date"
        value={values.endDate ? dayjs(values.endDate) : null}
        onChange={(newValue) => onChange('endDate', newValue?.toISOString())}
        minDate={values.startDate ? dayjs(values.startDate) : undefined}
        slotProps={{
          textField: {
            fullWidth: true,
            helperText: 'Must be after start date'
          }
        }}
      />
    </Grid>
  </LocalizationProvider>
)}
```

## Mixing Standard and Custom Fields

You can use both standard field configs AND custom fields together:

```tsx
<DynamicSearch
  fields={[
    // Standard field config
    {
      name: 'productName',
      label: 'Product Name',
      type: 'text',
    },
    {
      name: 'price',
      label: 'Price',
      type: 'number',
    },
  ]}
  onSearch={handleSearch}
  columnLayout={2}
  // Add custom fields alongside standard ones
  customFields={(values, onChange) => (
    <>
      {/* Custom interdependent fields */}
      <Grid item xs={12} sm={6}>
        <TextField
          select
          label="Discount Type"
          value={values.discountType || ''}
          onChange={(e) => {
            onChange('discountType', e.target.value);
            // Auto-calculate based on discount type
            const price = values.price || 0;
            const discount = e.target.value === 'premium' ? price * 0.2 : price * 0.1;
            onChange('discountAmount', discount);
          }}
          fullWidth
        >
          <MenuItem value="standard">Standard (10%)</MenuItem>
          <MenuItem value="premium">Premium (20%)</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="Discount Amount ($)"
          value={values.discountAmount || 0}
          InputProps={{ readOnly: true }}
          fullWidth
          helperText="Calculated from price and discount type"
        />
      </Grid>
    </>
  )}
/>
```

## Best Practices

### 1. **Always Wrap in Grid Items**
Custom fields should return Grid items to maintain layout consistency:

```tsx
customFields={(values, onChange) => (
  <>
    <Grid item xs={12} sm={6}>
      {/* Your field */}
    </Grid>
  </>
)}
```

### 2. **Handle Undefined Values**
Always provide fallback values:

```tsx
value={values.myField || ''}  // For strings
value={values.myNumber || 0}  // For numbers
checked={values.myCheckbox || false}  // For booleans
```

### 3. **Clear Dependent Fields**
When a parent field changes, reset dependent fields:

```tsx
onChange={(e) => {
  onChange('parentField', e.target.value);
  onChange('dependentField', ''); // Clear dependent
}}
```

### 4. **Use Type-Safe Updates**
Be explicit about data types:

```tsx
onChange('quantity', parseInt(e.target.value, 10) || 0);
onChange('price', parseFloat(e.target.value) || 0);
onChange('enabled', e.target.checked);
```

### 5. **Add Helper Text**
Guide users on field behavior:

```tsx
<TextField
  helperText="Auto-populated from category selection"
  // ...
/>
```

## Accessing Custom Field Values

All custom field values are included in the search parameters:

```tsx
const handleSearch = (params: Record<string, any>) => {
  console.log(params);
  // {
  //   productName: 'Laptop',      // from standard field
  //   price: 999,                 // from standard field
  //   category: 'electronics',    // from custom field
  //   description: 'Consumer...', // from custom field
  //   discountType: 'premium',    // from custom field
  //   discountAmount: 199.8       // from custom field
  // }
};
```

## Complete Working Example

See [page.tsx](app/page.tsx) for a live demo, or use this template:

```tsx
'use client';

import { useState } from 'react';
import { Grid, TextField, MenuItem, Chip, Box } from '@mui/material';
import { DynamicSearch } from '@/components/DynamicSearch';

const templates: Record<string, string> = {
  greeting: 'Hello! How can we help you today?',
  followup: 'Thank you for your previous inquiry. We wanted to follow up...',
  closing: 'Thank you for your business. We look forward to serving you again.',
};

export default function MySearchPage() {
  const handleSearch = (params: Record<string, any>) => {
    console.log('Search params:', params);
    // Use params to fetch/filter data
  };

  return (
    <DynamicSearch
      fields={[
        {
          name: 'subject',
          label: 'Subject',
          type: 'text',
          required: true,
        },
      ]}
      onSearch={handleSearch}
      columnLayout={2}
      customFields={(values, onChange) => (
        <>
          {/* Template Selector */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Email Template"
              value={values.template || ''}
              onChange={(e) => {
                const template = e.target.value;
                onChange('template', template);
                onChange('message', templates[template] || '');
              }}
              fullWidth
              helperText="Select a template to auto-fill message"
            >
              <MenuItem value="greeting">Greeting</MenuItem>
              <MenuItem value="followup">Follow-up</MenuItem>
              <MenuItem value="closing">Closing</MenuItem>
            </TextField>
          </Grid>

          {/* Character Counter */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
              <Chip
                label={`${(values.message || '').length} characters`}
                color={
                  (values.message || '').length > 500 ? 'error' :
                  (values.message || '').length > 300 ? 'warning' :
                  'success'
                }
              />
            </Box>
          </Grid>

          {/* Message Field */}
          <Grid item xs={12}>
            <TextField
              label="Message"
              value={values.message || ''}
              onChange={(e) => onChange('message', e.target.value)}
              fullWidth
              multiline
              rows={4}
              helperText="Auto-populated from template (editable)"
            />
          </Grid>

          {/* Preview */}
          {values.message && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                <Typography variant="caption" gutterBottom>
                  Preview:
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {values.message}
                </Typography>
              </Paper>
            </Grid>
          )}
        </>
      )}
    />
  );
}
```

## Summary

Custom fields give you **complete control** while still benefiting from DynamicSearch's features:
- ✅ Integrated state management
- ✅ Form submission handling
- ✅ Layout integration
- ✅ Saved search support
- ✅ Reset functionality

Use custom fields when you need flexibility beyond the standard field types!
