# Standalone Field Components - Complete Guide

All DynamicSearch field types are now available as standalone, reusable components that can be used independently outside of the DynamicSearch component.

---

## 📦 Installation

All standalone fields are already included in your project. Simply import them:

```typescript
import {
  StandaloneTextField,
  StandaloneNumberField,
  StandaloneDropdownField,
  StandaloneCheckboxField,
  StandaloneRadioField,
  StandaloneDateField,
  StandaloneMultiselectField,
  StandalonePillField,
  RichTextEditor,
  ModalSelectField,
} from '@/components/DynamicSearch/standalone';
```

---

## 🎯 Available Components

### 1. StandaloneTextField

**Purpose**: Single or multiline text input

**Features**:
- Text, email, password, URL, or tel input types
- Multiline support
- Tooltip support
- Error handling

**Props**:
```typescript
interface StandaloneTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  tooltip?: string;
  multiline?: boolean;
  rows?: number;
  type?: 'text' | 'email' | 'password' | 'url' | 'tel';
}
```

**Example**:
```typescript
import { StandaloneTextField } from '@/components/DynamicSearch/standalone';

function MyForm() {
  const [name, setName] = useState('');

  return (
    <StandaloneTextField
      label="Product Name"
      value={name}
      onChange={setName}
      required
      placeholder="Enter product name"
      helperText="Minimum 3 characters"
      tooltip="This will be displayed on the product page"
    />
  );
}
```

---

### 2. StandaloneNumberField

**Purpose**: Numeric input with validation

**Features**:
- Min/max constraints
- Step increment
- Numeric validation
- Tooltip support

**Props**:
```typescript
interface StandaloneNumberFieldProps {
  label: string;
  value: number | string;
  onChange: (value: number | string) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  tooltip?: string;
  min?: number;
  max?: number;
  step?: number;
}
```

**Example**:
```typescript
<StandaloneNumberField
  label="Price"
  value={price}
  onChange={setPrice}
  min={0}
  step={0.01}
  helperText="Product price in USD"
  tooltip="Enter the retail price"
/>
```

---

### 3. StandaloneDropdownField

**Purpose**: Select one option from a list

**Features**:
- Static or API-loaded options
- Custom API field mapping
- Loading state
- Optional "None" option
- Tooltip support

**Props**:
```typescript
interface StandaloneDropdownFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options?: DropdownOption[];
  apiEndpoint?: string;
  apiValueField?: string; // Field name for value in API response (default: 'value')
  apiLabelField?: string; // Field name for label in API response (default: 'label')
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  tooltip?: string;
}

interface DropdownOption {
  value: string | number;
  label: string;
}
```

**Example (Static Options)**:
```typescript
<StandaloneDropdownField
  label="Category"
  value={category}
  onChange={setCategory}
  options={[
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' }
  ]}
  required
/>
```

**Example (API-Loaded)**:
```typescript
<StandaloneDropdownField
  label="Category"
  value={category}
  onChange={setCategory}
  apiEndpoint="/api/categories"
  helperText="Select a product category"
/>
```

**Example (API with Custom Field Names)**:
```typescript
// API returns: [{ id: 1, name: 'Electronics' }, { id: 2, name: 'Clothing' }]
<StandaloneDropdownField
  label="Category"
  value={category}
  onChange={setCategory}
  apiEndpoint="/api/categories"
  apiValueField="id"
  apiLabelField="name"
  helperText="Select a product category"
/>
```

---

### 4. StandaloneCheckboxField

**Purpose**: Single checkbox with label

**Features**:
- Boolean value
- Helper text
- Tooltip support
- Error handling

**Props**:
```typescript
interface StandaloneCheckboxFieldProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  tooltip?: string;
}
```

**Example**:
```typescript
<StandaloneCheckboxField
  label="In Stock Only"
  value={inStockOnly}
  onChange={setInStockOnly}
  helperText="Show only products currently in stock"
  tooltip="Filter out out-of-stock items"
/>
```

---

### 5. StandaloneRadioField

**Purpose**: Select one option from radio buttons

**Features**:
- Multiple options
- Horizontal or vertical layout
- Tooltip support
- Error handling

**Props**:
```typescript
interface StandaloneRadioFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: RadioOption[];
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  tooltip?: string;
  row?: boolean;
}

interface RadioOption {
  value: string | number;
  label: string;
}
```

**Example**:
```typescript
<StandaloneRadioField
  label="Condition"
  value={condition}
  onChange={setCondition}
  options={[
    { value: 'new', label: 'New' },
    { value: 'used', label: 'Used' },
    { value: 'refurbished', label: 'Refurbished' }
  ]}
  row
  required
  helperText="Select product condition"
/>
```

---

### 6. StandaloneDateField

**Purpose**: Date picker with calendar UI

**Features**:
- Calendar UI
- Min/max date constraints
- Disable past/future dates
- Localization support
- Tooltip support

**Props**:
```typescript
interface StandaloneDateFieldProps {
  label: string;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  tooltip?: string;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  disablePast?: boolean;
  disableFuture?: boolean;
}
```

**Example**:
```typescript
import dayjs, { Dayjs } from 'dayjs';

function MyForm() {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);

  return (
    <StandaloneDateField
      label="Start Date"
      value={startDate}
      onChange={setStartDate}
      disablePast
      helperText="Select a future date"
      tooltip="Campaign start date"
    />
  );
}
```

---

### 7. StandaloneMultiselectField

**Purpose**: Select multiple options with autocomplete

**Features**:
- Multiple selection
- Autocomplete/search
- Chip display
- Static or API-loaded options
- Custom API field mapping
- Loading state
- Limit tags display
- Optional "Select All" and "Clear All" buttons

**Props**:
```typescript
interface StandaloneMultiselectFieldProps {
  label: string;
  value: (string | number)[];
  onChange: (values: (string | number)[]) => void;
  options?: MultiselectOption[];
  apiEndpoint?: string;
  apiValueField?: string; // Field name for value in API response (default: 'value')
  apiLabelField?: string; // Field name for label in API response (default: 'label')
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  tooltip?: string;
  limitTags?: number;
  showSelectAllButtons?: boolean; // Show "Select All" and "Clear All" buttons (default: false)
}

interface MultiselectOption {
  value: string | number;
  label: string;
}
```

**Example (Static)**:
```typescript
<StandaloneMultiselectField
  label="Tags"
  value={tags}
  onChange={setTags}
  options={[
    { value: 'featured', label: 'Featured' },
    { value: 'sale', label: 'On Sale' },
    { value: 'new', label: 'New Arrival' }
  ]}
  limitTags={2}
  helperText="Select product tags"
/>
```

**Example (API)**:
```typescript
<StandaloneMultiselectField
  label="Countries"
  value={countries}
  onChange={setCountries}
  apiEndpoint="/api/countries"
  limitTags={3}
/>
```

**Example (With Select All/Clear All Buttons)**:
```typescript
<StandaloneMultiselectField
  label="Tags"
  value={tags}
  onChange={setTags}
  options={[
    { value: 'featured', label: 'Featured' },
    { value: 'sale', label: 'On Sale' },
    { value: 'new', label: 'New Arrival' }
  ]}
  showSelectAllButtons={true}
  helperText="Select product tags"
/>
```

**Example (API with Custom Field Names)**:
```typescript
// API returns: [{ countryId: 'us', countryName: 'United States' }, ...]
<StandaloneMultiselectField
  label="Countries"
  value={countries}
  onChange={setCountries}
  apiEndpoint="/api/countries"
  apiValueField="countryId"
  apiLabelField="countryName"
  showSelectAllButtons={true}
/>
```

---

### 8. StandalonePillField

**Purpose**: Multi-value input with chip display

**Features**:
- Comma-separated input
- Number mode with range expansion
- Collapsible chip display
- Clear all functionality
- Tooltip support

**Props**:
```typescript
interface StandalonePillFieldProps {
  label: string;
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  pillType?: 'number' | 'text';
  allowRanges?: boolean;
  tooltip?: string;
  compactDisplayLimit?: number;
  showClearButton?: boolean;
}
```

**Example (Text)**:
```typescript
<StandalonePillField
  label="Tags"
  value={tags}
  onChange={setTags}
  pillType="text"
  placeholder="Enter tags separated by commas"
  helperText="Press Enter after typing"
/>
```

**Example (Number with Ranges)**:
```typescript
<StandalonePillField
  label="SKU Numbers"
  value={skus}
  onChange={setSkus}
  pillType="number"
  allowRanges
  helperText="Enter numbers or ranges (e.g., 100-105, 200)"
  compactDisplayLimit={20}
/>
```

---

### 9. RichTextEditor

**Purpose**: WYSIWYG rich text editor

**Features**:
- Bold, italic, code formatting
- Bullet and numbered lists
- Blockquotes
- Undo/redo
- HTML output
- Disabled state

**Props**:
```typescript
interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  helperText?: string;
}
```

**Example**:
```typescript
<RichTextEditor
  value={description}
  onChange={setDescription}
  label="Product Description"
  placeholder="Enter product description with formatting..."
  helperText="Use the toolbar to format text"
/>
```

---

### 10. ModalSelectField

**Purpose**: Select from a list in a modal dialog

**Features**:
- Modal dialog for selection
- Search/filter
- Static or API-loaded options
- Selected count badge

**Props**:
```typescript
interface ModalSelectFieldProps {
  label: string;
  value: (string | number)[];
  onChange: (values: (string | number)[]) => void;
  options?: DropdownOption[];
  apiEndpoint?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  tooltip?: string;
  modalTitle?: string;
  modalPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
}
```

**Example**:
```typescript
<ModalSelectField
  label="Select Products"
  value={selectedProducts}
  onChange={setSelectedProducts}
  apiEndpoint="/api/products"
  modalTitle="Choose Products"
  modalPosition="center"
  helperText="Click to open product selector"
/>
```

---

## 🔧 Common Patterns

### Form with Multiple Fields

```typescript
import {
  StandaloneTextField,
  StandaloneNumberField,
  StandaloneDropdownField,
  StandaloneCheckboxField,
  StandaloneDateField,
} from '@/components/DynamicSearch/standalone';
import { Grid, Button, Paper } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

function ProductForm() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [category, setCategory] = useState('');
  const [inStock, setInStock] = useState(false);
  const [releaseDate, setReleaseDate] = useState<Dayjs | null>(null);

  const handleSubmit = () => {
    console.log({ name, price, category, inStock, releaseDate });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StandaloneTextField
            label="Product Name"
            value={name}
            onChange={setName}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <StandaloneNumberField
            label="Price"
            value={price}
            onChange={setPrice}
            min={0}
            step={0.01}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <StandaloneDropdownField
            label="Category"
            value={category}
            onChange={setCategory}
            apiEndpoint="/api/categories"
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <StandaloneDateField
            label="Release Date"
            value={releaseDate}
            onChange={setReleaseDate}
          />
        </Grid>

        <Grid item xs={12}>
          <StandaloneCheckboxField
            label="In Stock"
            value={inStock}
            onChange={setInStock}
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
```

---

### Validation Example

```typescript
import { StandaloneTextField } from '@/components/DynamicSearch/standalone';
import { useState } from 'react';

function ValidatedForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleChange = (value: string) => {
    setEmail(value);

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      setError('Invalid email format');
    } else {
      setError('');
    }
  };

  return (
    <StandaloneTextField
      label="Email"
      value={email}
      onChange={handleChange}
      type="email"
      error={error}
      required
    />
  );
}
```

---

## 📊 Comparison: Standalone vs DynamicSearch

| Feature | Standalone Fields | DynamicSearch |
|---------|------------------|---------------|
| **Use Case** | Custom forms, specific layouts | Search forms, dynamic configs |
| **Configuration** | Direct props | JSON field config |
| **Layout** | Manual (Grid/Box) | Automatic grid layout |
| **Validation** | Manual | Built-in |
| **State Management** | Manual | Built-in |
| **Flexibility** | High | Medium |
| **Setup Complexity** | Manual | Config-driven |

**When to use Standalone Fields**:
- Custom form layouts
- Non-search forms (e.g., checkout, registration)
- Need full control over layout
- Want to integrate with existing forms

**When to use DynamicSearch**:
- Search forms
- Config-driven UIs
- Need automatic layout
- Want built-in search/reset functionality

---

## ✅ Summary

All DynamicSearch field types now have standalone versions:

1. ✅ **StandaloneTextField** - Text/email/password input
2. ✅ **StandaloneNumberField** - Numeric input
3. ✅ **StandaloneDropdownField** - Select dropdown
4. ✅ **StandaloneCheckboxField** - Single checkbox
5. ✅ **StandaloneRadioField** - Radio button group
6. ✅ **StandaloneDateField** - Date picker
7. ✅ **StandaloneMultiselectField** - Multi-select autocomplete
8. ✅ **StandalonePillField** - Multi-value chip input
9. ✅ **RichTextEditor** - WYSIWYG editor (already standalone)
10. ✅ **ModalSelectField** - Modal selection (already standalone)

**Import all at once**:
```typescript
import * as StandaloneFields from '@/components/DynamicSearch/standalone';
```

**Or import individually**:
```typescript
import { StandaloneTextField } from '@/components/DynamicSearch/standalone';
```

The DynamicSearch component remains unchanged and continues to work as before! 🎉
