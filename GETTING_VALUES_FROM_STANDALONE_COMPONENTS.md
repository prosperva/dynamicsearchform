# Getting Values from Standalone Components

All standalone components are **controlled components** using React's state management. This means you manage the state in your parent component, and values are always accessible from your state variables.

## Quick Answer

```tsx
'use client';

import { useState } from 'react';
import {
  SearchableDropdown,
  SearchableMultiSelect,
  StandalonePillField
} from '@/components/DynamicSearch';

export default function MyForm() {
  // 1. Declare state for each field
  const [category, setCategory] = useState<string | number | null>(null);
  const [tags, setTags] = useState<(string | number)[]>([]);
  const [skus, setSkus] = useState<string[]>([]);

  // 2. Access values directly from state
  const handleSubmit = () => {
    console.log('Category:', category);
    console.log('Tags:', tags);
    console.log('SKUs:', skus);

    // Use the values
    const formData = {
      category,
      tags,
      skus,
    };

    // Send to API, etc.
    fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  };

  return (
    <>
      {/* 3. Connect state to components via value and onChange */}
      <SearchableDropdown
        label="Category"
        value={category}
        onChange={setCategory} // Updates state automatically
      />

      <SearchableMultiSelect
        label="Tags"
        value={tags}
        onChange={setTags} // Updates state automatically
      />

      <StandalonePillField
        label="SKUs"
        value={skus}
        onChange={setSkus} // Updates state automatically
      />

      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}
```

## How It Works

### 1. SearchableDropdown

```tsx
const [category, setCategory] = useState<string | number | null>(null);

<SearchableDropdown
  label="Category"
  value={category}        // Current value
  onChange={setCategory}  // Updates when user selects
/>

// Access the value
console.log(category); // 'electronics' or 123 or null
```

### 2. SearchableMultiSelect

```tsx
const [tags, setTags] = useState<(string | number)[]>([]);

<SearchableMultiSelect
  label="Tags"
  value={tags}        // Current selected values
  onChange={setTags}  // Updates when user selects/deselects
/>

// Access the values
console.log(tags); // ['react', 'typescript', 'nextjs']
```

### 3. StandalonePillField

```tsx
const [skus, setSkus] = useState<string[]>([]);

<StandalonePillField
  label="SKUs"
  value={skus}        // Current values
  onChange={setSkus}  // Updates when user types/deletes
/>

// Access the values
console.log(skus); // ['100', '101', '102', '200']
```

## Complete Form Example

```tsx
'use client';

import { useState } from 'react';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import {
  SearchableDropdown,
  SearchableMultiSelect,
  StandalonePillField
} from '@/components/DynamicSearch';

export default function ProductForm() {
  // State for all fields
  const [category, setCategory] = useState<string | number | null>(null);
  const [subcategory, setSubcategory] = useState<string | number | null>(null);
  const [tags, setTags] = useState<(string | number)[]>([]);
  const [countries, setCountries] = useState<(string | number)[]>([]);
  const [skus, setSkus] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!category) {
      newErrors.category = 'Category is required';
    }

    if (tags.length < 1) {
      newErrors.tags = 'At least one tag is required';
    }

    if (keywords.length < 2) {
      newErrors.keywords = 'At least two keywords are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // All values are accessible from state
    const formData = {
      category,
      subcategory,
      tags,
      countries,
      skus,
      keywords,
    };

    console.log('Form Data:', formData);

    // Send to API
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        // Reset form
        handleReset();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleReset = () => {
    setCategory(null);
    setSubcategory(null);
    setTags([]);
    setCountries([]);
    setSkus([]);
    setKeywords([]);
    setErrors({});
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Product Form
      </Typography>

      <Grid container spacing={3}>
        {/* Single-select dropdowns */}
        <Grid item xs={12} md={6}>
          <SearchableDropdown
            label="Category"
            value={category}
            onChange={(val) => {
              setCategory(val);
              setErrors(prev => ({ ...prev, category: '' }));
            }}
            apiUrl="/api/categories"
            error={errors.category}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <SearchableDropdown
            label="Subcategory"
            value={subcategory}
            onChange={setSubcategory}
            apiUrl="/api/subcategories"
          />
        </Grid>

        {/* Multi-select dropdowns */}
        <Grid item xs={12} md={6}>
          <SearchableMultiSelect
            label="Tags"
            value={tags}
            onChange={(val) => {
              setTags(val);
              setErrors(prev => ({ ...prev, tags: '' }));
            }}
            options={[
              { label: 'New', value: 'new' },
              { label: 'Featured', value: 'featured' },
              { label: 'Sale', value: 'sale' },
            ]}
            error={errors.tags}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <SearchableMultiSelect
            label="Available Countries"
            value={countries}
            onChange={setCountries}
            apiUrl="/api/countries"
          />
        </Grid>

        {/* Pill fields */}
        <Grid item xs={12} md={6}>
          <StandalonePillField
            label="SKU Numbers"
            value={skus}
            onChange={setSkus}
            pillType="number"
            allowRanges={true}
            helperText="Enter SKUs or ranges (e.g., 100-105, 200)"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <StandalonePillField
            label="Keywords"
            value={keywords}
            onChange={(val) => {
              setKeywords(val);
              setErrors(prev => ({ ...prev, keywords: '' }));
            }}
            pillType="text"
            error={errors.keywords}
            required
          />
        </Grid>

        {/* Action buttons */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!category || tags.length < 1}
            >
              Submit
            </Button>
            <Button variant="outlined" onClick={handleReset}>
              Reset
            </Button>
          </Box>
        </Grid>

        {/* Display current values for debugging */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" gutterBottom>
              Current Form Values:
            </Typography>
            <pre style={{ fontSize: '12px' }}>
              {JSON.stringify(
                {
                  category,
                  subcategory,
                  tags,
                  countries,
                  skus,
                  keywords,
                },
                null,
                2
              )}
            </pre>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
}
```

## Integration with Form Libraries

### React Hook Form

```tsx
import { Controller, useForm } from 'react-hook-form';
import { SearchableDropdown } from '@/components/DynamicSearch';

export default function RHFExample() {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    // Values are in data object
    console.log('Form data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <SearchableDropdown
            label="Category"
            value={field.value || null}
            onChange={field.onChange}
            options={categoryOptions}
          />
        )}
      />

      <button type="submit">Submit</button>
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
      tags: [],
    },
    onSubmit: (values) => {
      // Values are in values object
      console.log('Form values:', values);
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

      <button type="submit">Submit</button>
    </form>
  );
}
```

## Key Points

1. **Controlled Components**: All standalone components are controlled via `value` and `onChange` props
2. **State is the Source of Truth**: Values are always accessible from your state variables
3. **Real-time Access**: Values update in state immediately when user makes changes
4. **TypeScript Support**: Proper typing for all value types
5. **No Hidden State**: Unlike uncontrolled components, you always know the current values

## Summary

Getting values from standalone components is simple:
1. Create state with `useState`
2. Pass state to component via `value` prop
3. Pass state setter to component via `onChange` prop
4. Access values directly from state whenever needed

No refs, no manual extraction - just clean, predictable React state management!
