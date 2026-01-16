# Accordion Groups & Field Copying Features

## Overview

The DynamicSearch component now supports two powerful new features for complex forms:

1. **Accordion Groups** - Collapsible sections to organize related fields
2. **Field Copying** - Allow users to copy values from one field to another

## 1. Accordion Groups

Group related fields in collapsible accordion sections for better organization and reduced visual clutter.

### Usage

```tsx
{
  name: 'shippingInfo',
  label: 'Shipping Information',
  type: 'accordion',
  defaultExpanded: false, // Start collapsed
  helperText: 'Additional shipping details',
  fields: [
    {
      name: 'warehouse',
      label: 'Warehouse Location',
      type: 'text',
      placeholder: 'Enter warehouse location...',
    },
    {
      name: 'estimatedShipping',
      label: 'Est. Shipping Days',
      type: 'number',
      defaultValue: 3,
    },
  ],
}
```

### Properties

- `type: 'accordion'` - Defines this as an accordion field
- `defaultExpanded?: boolean` - Whether the accordion starts expanded (default: false)
- `fields: FieldConfig[]` - Array of fields to display inside the accordion
- `label: string` - Title displayed in the accordion header
- `helperText?: string` - Subtitle/description shown in the header

### Styling

Accordions have:
- Hover effect on the header
- Expand/collapse icon (chevron)
- Consistent spacing with other form elements
- Nested field validation support

## 2. Field Copying

Allow users to copy values from one field to another with a button click.

### Usage

```tsx
{
  name: 'billingAddress',
  label: 'Billing Address',
  type: 'text',
  placeholder: 'Enter billing address...',
},
{
  name: 'shippingAddress',
  label: 'Shipping Address',
  type: 'text',
  placeholder: 'Enter shipping address...',
  copyFromField: 'billingAddress',
  copyButtonText: 'Copy from Billing Address', // Optional
}
```

### Properties

- `copyFromField: string` - Name of the field to copy value from
- `copyButtonText?: string` - Custom button text (default: "Copy from {fieldLabel}")

### Features

- Button appears below the target field
- Automatically disabled if source field is empty
- Works with text and number fields
- Recursively searches through groups and accordions to find the source field
- Shows the source field's label in the button text

### Example: Same Address

```tsx
const fields = [
  {
    name: 'homeAddress',
    label: 'Home Address',
    type: 'text',
  },
  {
    name: 'workAddress',
    label: 'Work Address',
    type: 'text',
    copyFromField: 'homeAddress',
  },
];
```

## Combined Example

Here's an example combining both features:

```tsx
const editFields: FieldConfig[] = [
  {
    name: 'productName',
    label: 'Product Name',
    type: 'text',
    required: true,
  },
  {
    name: 'price',
    label: 'Price',
    type: 'number',
    required: true,
  },
  // Accordion with field copying inside
  {
    name: 'shippingInfo',
    label: 'Shipping Information',
    type: 'accordion',
    defaultExpanded: false,
    fields: [
      {
        name: 'warehouse',
        label: 'Primary Warehouse',
        type: 'text',
      },
      {
        name: 'alternateWarehouse',
        label: 'Alternate Warehouse',
        type: 'text',
        copyFromField: 'warehouse',
        copyButtonText: 'Copy from Primary',
      },
    ],
  },
];
```

## Technical Implementation

### How Accordion Works

1. Accordion fields are rendered using MUI's `Accordion` component
2. They store nested field values in an object structure
3. Validation works recursively through nested fields
4. Pass `allValues` and `allFields` props to nested `FieldRenderer` components

### How Field Copying Works

1. When a field has `copyFromField` set, a copy button is rendered
2. The `findFieldByName()` helper recursively searches all fields (including nested ones)
3. Clicking the button copies the value from the source field
4. Button is disabled if source field has no value

### Data Structure

Accordion fields store data as nested objects:

```javascript
{
  productName: "Widget",
  price: 99,
  shippingInfo: {
    warehouse: "Warehouse A",
    alternateWarehouse: "Warehouse A", // Copied value
  }
}
```

## Validation

Both features support full validation:

```tsx
{
  name: 'shippingInfo',
  label: 'Shipping Information',
  type: 'accordion',
  fields: [
    {
      name: 'warehouse',
      label: 'Warehouse',
      type: 'text',
      required: true, // ✅ Validation works in accordions
    },
  ],
}
```

## Use Cases

### Accordion Groups

- Advanced settings sections
- Optional fields that don't need to be visible initially
- Grouping related fields (shipping, billing, preferences)
- Reducing form height for better UX
- Progressive disclosure of complex forms

### Field Copying

- Same as billing address
- Copy contact info to alternate contact
- Duplicate locations or settings
- Fill backup/alternate fields
- Copy templates or defaults

## Notes

- Accordion and regular `group` type work similarly, but accordion is collapsible
- Field copying works across all field types (text, number, etc.)
- Source and target fields can be in different groups/accordions
- Multiple fields can copy from the same source
- Copy button updates automatically when source field changes

## Browser Compatibility

- Works in all modern browsers
- Uses MUI Accordion (Material Design)
- No special polyfills needed
