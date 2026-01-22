import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Grid, Container, Typography, Paper, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
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
} from '../standalone';

/**
 * # Standalone Field Components
 *
 * A complete collection of reusable form field components that can be used independently
 * outside of the DynamicSearch component.
 *
 * ## Features
 * - **Fully Typed** - Complete TypeScript support
 * - **MUI Themed** - Consistent Material-UI styling
 * - **API Integration** - Built-in API loading with custom field mapping
 * - **Accessible** - WCAG compliant with tooltips
 * - **Flexible** - Works in any React form
 *
 * ## Usage
 * ```tsx
 * import { StandaloneTextField } from '@/components/DynamicSearch/standalone';
 *
 * function MyForm() {
 *   const [name, setName] = useState('');
 *
 *   return (
 *     <StandaloneTextField
 *       label="Product Name"
 *       value={name}
 *       onChange={setName}
 *       required
 *     />
 *   );
 * }
 * ```
 */
const meta = {
  title: 'Standalone Fields/Overview',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Interactive showcase of all standalone field components',
      },
    },
  },
  decorators: [
    (Story) => (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="lg">
          <Story />
        </Container>
      </LocalizationProvider>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ## Complete Form Example
 *
 * This example demonstrates all standalone field components working together in a form.
 */
export const CompleteForm: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      productName: '',
      price: '' as number | string,
      category: '',
      inStock: false,
      condition: 'new',
      releaseDate: null as Dayjs | null,
      countries: [] as (string | number)[],
      tags: [] as string[],
      description: '',
    });

    const categories = [
      { value: 'electronics', label: 'Electronics' },
      { value: 'clothing', label: 'Clothing' },
      { value: 'books', label: 'Books' },
      { value: 'furniture', label: 'Furniture' },
    ];

    const countryOptions = [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'ca', label: 'Canada' },
      { value: 'au', label: 'Australia' },
      { value: 'de', label: 'Germany' },
      { value: 'fr', label: 'France' },
    ];

    const conditionOptions = [
      { value: 'new', label: 'New' },
      { value: 'used', label: 'Used' },
      { value: 'refurbished', label: 'Refurbished' },
    ];

    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Product Form
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          All fields are interactive - try them out!
        </Typography>

        <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
          <Grid container spacing={3}>
            {/* Text Field */}
            <Grid item xs={12} md={6}>
              <StandaloneTextField
                label="Product Name"
                value={formData.productName}
                onChange={(val) =>
                  setFormData({ ...formData, productName: val })
                }
                required
                placeholder="Enter product name"
                helperText="Minimum 3 characters"
                tooltip="This will be displayed on the product page"
              />
            </Grid>

            {/* Number Field */}
            <Grid item xs={12} md={6}>
              <StandaloneNumberField
                label="Price (USD)"
                value={formData.price}
                onChange={(val) => setFormData({ ...formData, price: val })}
                min={0}
                step={0.01}
                required
                placeholder="0.00"
                helperText="Product retail price"
                tooltip="Enter the price in US dollars"
              />
            </Grid>

            {/* Dropdown Field */}
            <Grid item xs={12} md={6}>
              <StandaloneDropdownField
                label="Category"
                value={formData.category}
                onChange={(val) => setFormData({ ...formData, category: val as string })}
                options={categories}
                required
                helperText="Select a product category"
                tooltip="Choose the best category for this product"
              />
            </Grid>

            {/* Date Field */}
            <Grid item xs={12} md={6}>
              <StandaloneDateField
                label="Release Date"
                value={formData.releaseDate}
                onChange={(val) => setFormData({ ...formData, releaseDate: val })}
                disablePast
                helperText="Product release date"
                tooltip="When will this product be available?"
              />
            </Grid>

            {/* Checkbox Field */}
            <Grid item xs={12}>
              <StandaloneCheckboxField
                label="In Stock"
                value={formData.inStock}
                onChange={(val) => setFormData({ ...formData, inStock: val })}
                helperText="Check if product is currently available"
                tooltip="Toggle product availability status"
              />
            </Grid>

            {/* Radio Field */}
            <Grid item xs={12}>
              <StandaloneRadioField
                label="Condition"
                value={formData.condition}
                onChange={(val) => setFormData({ ...formData, condition: val as string })}
                options={conditionOptions}
                row
                required
                helperText="Select product condition"
                tooltip="Condition of the product"
              />
            </Grid>

            {/* Multiselect Field */}
            <Grid item xs={12}>
              <StandaloneMultiselectField
                label="Available Countries"
                value={formData.countries}
                onChange={(val) => setFormData({ ...formData, countries: val })}
                options={countryOptions}
                showSelectAllButtons
                limitTags={3}
                helperText="Select countries where this product is available"
                tooltip="Multiple selection allowed"
              />
            </Grid>

            {/* Pill Field */}
            <Grid item xs={12}>
              <StandalonePillField
                label="Tags"
                value={formData.tags}
                onChange={(val) => setFormData({ ...formData, tags: val })}
                pillType="text"
                placeholder="Enter tags separated by commas"
                helperText="Press Enter after typing tags"
                tooltip="Add searchable tags for this product"
              />
            </Grid>

            {/* Rich Text Editor */}
            <Grid item xs={12}>
              <RichTextEditor
                value={formData.description}
                onChange={(val) => setFormData({ ...formData, description: val })}
                label="Product Description"
                placeholder="Enter product description with formatting..."
                helperText="Use the toolbar to format text"
              />
            </Grid>
          </Grid>

          {/* Form Data Preview */}
          <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Form Data (Live Preview)
            </Typography>
            <pre style={{ overflow: 'auto', fontSize: '12px' }}>
              {JSON.stringify(formData, null, 2)}
            </pre>
          </Box>
        </Paper>
      </Box>
    );
  },
};
