# Standalone Components

## Overview

While the `DynamicSearch` component provides a complete search form solution, you can also use individual components independently. This is perfect when you need just a searchable dropdown or multi-select without the full form infrastructure.

---

## SearchableDropdown

A standalone dropdown component with built-in search/filter functionality.

### Features

- ✅ Type to search/filter options instantly
- ✅ Works with static options or API-driven data
- ✅ Custom field mapping for non-standard APIs
- ✅ Loading states with spinner
- ✅ Error handling with helpful messages
- ✅ Full Material-UI theming support
- ✅ Same look and feel as DynamicSearch dropdowns
- ✅ Fully controlled component

### Installation

No additional dependencies needed - uses the same packages as DynamicSearch.

### Basic Usage

```tsx
import { useState } from 'react';
import { SearchableDropdown } from '@/components/DynamicSearch';

export default function MyComponent() {
  const [category, setCategory] = useState<string | number | null>(null);

  return (
    <SearchableDropdown
      label="Category"
      value={category}
      onChange={setCategory}
      options={[
        { label: 'Electronics', value: 'electronics' },
        { label: 'Books', value: 'books' },
        { label: 'Clothing', value: 'clothing' },
      ]}
      placeholder="Select a category..."
      helperText="Choose your product category"
    />
  );
}
```

### API-Driven Example

```tsx
import { useState } from 'react';
import { SearchableDropdown } from '@/components/DynamicSearch';

export default function CountrySelector() {
  const [country, setCountry] = useState<string | number | null>(null);

  return (
    <SearchableDropdown
      label="Country"
      value={country}
      onChange={setCountry}
      apiUrl="/api/countries"
      placeholder="Select a country..."
    />
  );
}
```

### Custom API Field Mapping

If your API returns data in a different format (e.g., `{id: 1, name: "Option"}` instead of `{value: 1, label: "Option"}`):

```tsx
<SearchableDropdown
  label="City"
  value={cityId}
  onChange={setCityId}
  apiUrl="/api/cities"
  apiLabelField="name"  // API field to use as label
  apiValueField="id"    // API field to use as value
/>
```

**API Response:**
```json
[
  { "id": 1, "name": "New York", "country": "US" },
  { "id": 2, "name": "London", "country": "UK" }
]
```

The component automatically maps `name` → `label` and `id` → `value`.

### Advanced Usage

```tsx
import { useState } from 'react';
import { SearchableDropdown, DropdownOption } from '@/components/DynamicSearch';

export default function AdvancedExample() {
  const [status, setStatus] = useState<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<DropdownOption[]>([]);

  const handleChange = (value: string | number | null) => {
    setStatus(value);

    // Custom validation
    if (value === 'archived') {
      setError('Cannot select archived status');
    } else {
      setError(null);
    }
  };

  const handleOptionsLoaded = (loadedOptions: DropdownOption[]) => {
    console.log('Options loaded:', loadedOptions);
    setOptions(loadedOptions);
  };

  return (
    <SearchableDropdown
      label="Status"
      value={status}
      onChange={handleChange}
      apiUrl="/api/statuses"
      error={error || undefined}
      required
      onLoadOptions={handleOptionsLoaded}
      helperText={error ? undefined : 'Select a status'}
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | Required | Field label |
| `value` | `string \| number \| null` | Required | Current selected value |
| `onChange` | `(value: string \| number \| null) => void` | Required | Callback when value changes |
| `options` | `DropdownOption[]` | `undefined` | Static options array |
| `apiUrl` | `string` | `undefined` | API endpoint to fetch options |
| `apiLabelField` | `string` | `'label'` | Field name for label in API response |
| `apiValueField` | `string` | `'value'` | Field name for value in API response |
| `placeholder` | `string` | `undefined` | Placeholder text |
| `helperText` | `string` | `undefined` | Helper text below field |
| `error` | `string` | `undefined` | Error message (shows field in error state) |
| `required` | `boolean` | `false` | Whether field is required |
| `disabled` | `boolean` | `false` | Whether field is disabled |
| `fullWidth` | `boolean` | `true` | Whether field takes full width |
| `loading` | `boolean` | `undefined` | External loading state control |
| `onLoadOptions` | `(options: DropdownOption[]) => void` | `undefined` | Callback when API options are loaded |

---

## SearchableMultiSelect

A standalone multi-select dropdown with built-in search/filter and chip display.

### Features

- ✅ Type to search/filter options
- ✅ Select multiple values
- ✅ Displays selected values as removable chips
- ✅ "Select All" and "Clear All" buttons
- ✅ Works with static options or API-driven data
- ✅ Custom field mapping for non-standard APIs
- ✅ Loading states
- ✅ Error handling
- ✅ Same look and feel as DynamicSearch multi-selects

### Basic Usage

```tsx
import { useState } from 'react';
import { SearchableMultiSelect } from '@/components/DynamicSearch';

export default function TagSelector() {
  const [tags, setTags] = useState<(string | number)[]>([]);

  return (
    <SearchableMultiSelect
      label="Tags"
      value={tags}
      onChange={setTags}
      options={[
        { label: 'React', value: 'react' },
        { label: 'TypeScript', value: 'typescript' },
        { label: 'Next.js', value: 'nextjs' },
        { label: 'Material-UI', value: 'mui' },
      ]}
      placeholder="Select tags..."
      helperText="You can select multiple tags"
    />
  );
}
```

### API-Driven Example

```tsx
import { useState } from 'react';
import { SearchableMultiSelect } from '@/components/DynamicSearch';

export default function CountrySelector() {
  const [countries, setCountries] = useState<(string | number)[]>([]);

  return (
    <SearchableMultiSelect
      label="Shipping Countries"
      value={countries}
      onChange={setCountries}
      apiUrl="/api/countries"
      placeholder="Select countries..."
      helperText="Select one or more countries"
    />
  );
}
```

### Without Action Buttons

```tsx
<SearchableMultiSelect
  label="Languages"
  value={languages}
  onChange={setLanguages}
  options={languageOptions}
  showSelectAllButtons={false} // Hide Select All/Clear All buttons
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | Required | Field label |
| `value` | `(string \| number)[]` | Required | Current selected values array |
| `onChange` | `(values: (string \| number)[]) => void` | Required | Callback when values change |
| `options` | `DropdownOption[]` | `undefined` | Static options array |
| `apiUrl` | `string` | `undefined` | API endpoint to fetch options |
| `apiLabelField` | `string` | `'label'` | Field name for label in API response |
| `apiValueField` | `string` | `'value'` | Field name for value in API response |
| `placeholder` | `string` | `undefined` | Placeholder text |
| `helperText` | `string` | `undefined` | Helper text below field |
| `error` | `string` | `undefined` | Error message (shows field in error state) |
| `required` | `boolean` | `false` | Whether field is required |
| `disabled` | `boolean` | `false` | Whether field is disabled |
| `fullWidth` | `boolean` | `true` | Whether field takes full width |
| `showSelectAllButtons` | `boolean` | `true` | Show "Select All" and "Clear All" buttons |
| `loading` | `boolean` | `undefined` | External loading state control |
| `onLoadOptions` | `(options: DropdownOption[]) => void` | `undefined` | Callback when API options are loaded |

---

## Complete Form Example

Using standalone components together:

```tsx
'use client';

import { useState } from 'react';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { SearchableDropdown, SearchableMultiSelect } from '@/components/DynamicSearch';

export default function ProductFilterForm() {
  const [category, setCategory] = useState<string | number | null>(null);
  const [tags, setTags] = useState<(string | number)[]>([]);
  const [country, setCountry] = useState<string | number | null>(null);

  const handleSubmit = () => {
    const formData = {
      category,
      tags,
      country,
    };
    console.log('Form submitted:', formData);
    // Process form data...
  };

  const handleReset = () => {
    setCategory(null);
    setTags([]);
    setCountry(null);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Product Filters
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <SearchableDropdown
            label="Category"
            value={category}
            onChange={setCategory}
            apiUrl="/api/categories"
            placeholder="Select category..."
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <SearchableDropdown
            label="Country"
            value={country}
            onChange={setCountry}
            apiUrl="/api/countries"
            placeholder="Select country..."
          />
        </Grid>

        <Grid item xs={12}>
          <SearchableMultiSelect
            label="Tags"
            value={tags}
            onChange={setTags}
            options={[
              { label: 'New', value: 'new' },
              { label: 'Featured', value: 'featured' },
              { label: 'Sale', value: 'sale' },
              { label: 'Popular', value: 'popular' },
            ]}
            placeholder="Select tags..."
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!category} // Require category
            >
              Apply Filters
            </Button>
            <Button variant="outlined" onClick={handleReset}>
              Reset
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
```

---

## Custom Validation Example

```tsx
import { useState } from 'react';
import { SearchableDropdown } from '@/components/DynamicSearch';

export default function ValidatedDropdown() {
  const [value, setValue] = useState<string | number | null>(null);
  const [error, setError] = useState<string>('');

  const handleChange = (newValue: string | number | null) => {
    setValue(newValue);

    // Custom validation
    if (!newValue) {
      setError('This field is required');
    } else if (newValue === 'invalid') {
      setError('This option is not allowed');
    } else {
      setError('');
    }
  };

  return (
    <SearchableDropdown
      label="Status"
      value={value}
      onChange={handleChange}
      options={[
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Invalid (Test)', value: 'invalid' },
      ]}
      error={error}
      required
    />
  );
}
```

---

## TypeScript Types

```typescript
import type { DropdownOption } from '@/components/DynamicSearch';

// DropdownOption interface
interface DropdownOption {
  label: string;
  value: string | number;
}

// Usage in your component
const options: DropdownOption[] = [
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 },
];
```

---

## Benefits of Standalone Components

### ✅ **Flexibility**
Use just the dropdown without the full search form infrastructure.

### ✅ **Custom Validation**
Implement your own validation logic outside the form.

### ✅ **Custom Events**
Handle onChange, onLoadOptions, and other events directly.

### ✅ **Composition**
Combine with other form libraries (react-hook-form, Formik, etc.).

### ✅ **Lightweight**
Only import what you need.

### ✅ **Consistent UI**
Same look and feel as DynamicSearch components.

---

## Integration with Form Libraries

### React Hook Form

```tsx
import { Controller, useForm } from 'react-hook-form';
import { SearchableDropdown } from '@/components/DynamicSearch';

export default function RHFExample() {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="category"
        control={control}
        rules={{ required: 'Category is required' }}
        render={({ field, fieldState }) => (
          <SearchableDropdown
            label="Category"
            value={field.value || null}
            onChange={field.onChange}
            options={categoryOptions}
            error={fieldState.error?.message}
          />
        )}
      />
    </form>
  );
}
```

### Formik

```tsx
import { useFormik } from 'formik';
import { SearchableDropdown } from '@/components/DynamicSearch';

export default function FormikExample() {
  const formik = useFormik({
    initialValues: {
      category: null,
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <SearchableDropdown
        label="Category"
        value={formik.values.category}
        onChange={(value) => formik.setFieldValue('category', value)}
        options={categoryOptions}
      />
    </form>
  );
}
```

---

## StandalonePillField

A multi-value input field with chip display, perfect for tags, IDs, or lists of values.

### Features

- ✅ Enter comma-separated values in a textarea
- ✅ Displays values as removable chips
- ✅ Number mode with optional range expansion (e.g., "1-5" becomes [1,2,3,4,5])
- ✅ Collapsible display for large value lists
- ✅ "Clear All" button
- ✅ Tooltip support
- ✅ Custom validation
- ✅ Controlled component

### Basic Usage

```tsx
import { useState } from 'react';
import { StandalonePillField } from '@/components/DynamicSearch';

export default function TagInput() {
  const [tags, setTags] = useState<string[]>([]);

  return (
    <StandalonePillField
      label="Tags"
      value={tags}
      onChange={setTags}
      pillType="text"
      placeholder="Enter tags separated by commas"
      helperText="Press Enter to confirm"
    />
  );
}
```

### Number Mode with Ranges

Perfect for product IDs, SKU numbers, or any numeric lists:

```tsx
import { useState } from 'react';
import { StandalonePillField } from '@/components/DynamicSearch';

export default function SKUInput() {
  const [skus, setSkus] = useState<string[]>([]);

  return (
    <StandalonePillField
      label="SKU Numbers"
      value={skus}
      onChange={setSkus}
      pillType="number"
      allowRanges={true}
      placeholder="Enter SKUs or ranges (e.g., 100-105, 200)"
      helperText="Use ranges like 100-105. Press Enter to expand."
      tooltip="Ranges will be expanded into individual numbers"
    />
  );
}
```

When user enters: `100-105, 200, 300-302` and presses Enter:
- Expanded to: `['100', '101', '102', '103', '104', '105', '200', '300', '301', '302']`

### With Validation

```tsx
import { useState } from 'react';
import { StandalonePillField } from '@/components/DynamicSearch';

export default function ValidatedPillField() {
  const [values, setValues] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const handleChange = (newValues: string[]) => {
    setValues(newValues);

    // Custom validation
    if (newValues.length < 2) {
      setError('At least 2 values are required');
    } else if (newValues.length > 10) {
      setError('Maximum 10 values allowed');
    } else {
      setError('');
    }
  };

  return (
    <StandalonePillField
      label="Product Tags"
      value={values}
      onChange={handleChange}
      pillType="text"
      error={error}
      required
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | Required | Field label |
| `value` | `string[]` | Required | Current values array |
| `onChange` | `(values: string[]) => void` | Required | Callback when values change |
| `placeholder` | `string` | `undefined` | Placeholder text |
| `helperText` | `string` | `undefined` | Helper text below field |
| `error` | `string` | `undefined` | Error message (shows field in error state) |
| `required` | `boolean` | `false` | Whether field is required |
| `disabled` | `boolean` | `false` | Whether field is disabled |
| `pillType` | `'text' \| 'number'` | `'text'` | Type of values |
| `allowRanges` | `boolean` | `false` | Allow range syntax (only for `pillType='number'`) |
| `tooltip` | `string` | `undefined` | Tooltip text with help icon |
| `compactDisplayLimit` | `number` | `20` | Number of chips to show before collapsing |
| `showClearButton` | `boolean` | `true` | Show "Clear All" button |

### Getting Values

Values are always available in your state:

```tsx
const [tags, setTags] = useState<string[]>([]);

const handleSubmit = () => {
  console.log('Tags:', tags); // Access directly from state

  // Use the values
  const formData = {
    tags: tags,
  };

  fetch('/api/submit', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
};

return (
  <>
    <StandalonePillField
      label="Tags"
      value={tags}
      onChange={setTags}
    />
    <button onClick={handleSubmit}>Submit</button>
  </>
);
```

### Complete Example

```tsx
'use client';

import { useState } from 'react';
import { Box, Button, Grid } from '@mui/material';
import { StandalonePillField } from '@/components/DynamicSearch';

export default function ProductForm() {
  const [tags, setTags] = useState<string[]>([]);
  const [skus, setSkus] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const handleSubmit = () => {
    if (tags.length < 1) {
      setError('At least one tag is required');
      return;
    }

    const formData = { tags, skus };
    console.log('Submitted:', formData);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <StandalonePillField
          label="Tags"
          value={tags}
          onChange={(vals) => {
            setTags(vals);
            setError(vals.length < 1 ? 'Required' : '');
          }}
          pillType="text"
          error={error}
          required
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <StandalonePillField
          label="SKU Numbers"
          value={skus}
          onChange={setSkus}
          pillType="number"
          allowRanges={true}
          helperText="Use ranges: 100-105, 200"
        />
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={tags.length < 1}
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  );
}
```

---

## When to Use Which Component

### Use `DynamicSearch` when:
- Building a complete search form
- Need field validation, saved searches, view modes
- Want declarative field configuration
- Building search/filter interfaces

### Use `SearchableDropdown` when:
- Need a single searchable dropdown
- Want full control over validation and events
- Integrating with other form libraries
- Building custom forms

### Use `SearchableMultiSelect` when:
- Need multi-value selection from a predefined list
- Want chip-based display of selected values
- Need "Select All" / "Clear All" functionality
- Building tag selectors, filter lists, etc.

### Use `StandalonePillField` when:
- Need users to enter their own values (not from a list)
- Want multi-value text or number input
- Need range expansion for numbers (e.g., 1-5 → [1,2,3,4,5])
- Building tag creators, SKU entry, ID lists, etc.

---

## Summary

The standalone components give you:
- ✅ **SearchableDropdown** - Single-select with search/filter
- ✅ **SearchableMultiSelect** - Multi-select with chips and optional action buttons
- ✅ **StandalonePillField** - Multi-value text/number input with range expansion
- ✅ Same great UX as DynamicSearch components
- ✅ Full control over validation and events
- ✅ Easy integration with any form library
- ✅ Lightweight - use only what you need
- ✅ API-driven or static options (dropdowns)
- ✅ TypeScript support

Perfect for developers who want powerful input components without the full DynamicSearch infrastructure!
