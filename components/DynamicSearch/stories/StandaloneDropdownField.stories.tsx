import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { StandaloneDropdownField } from '../StandaloneDropdownField';

const meta = {
  title: 'Standalone Fields/DropdownField',
  component: StandaloneDropdownField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StandaloneDropdownField>;

export default meta;
type Story = StoryObj<typeof meta>;

const categoryOptions = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'books', label: 'Books' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'toys', label: 'Toys & Games' },
];

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number>('');
    return (
      <div style={{ width: '300px' }}>
        <StandaloneDropdownField {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    label: 'Category',
    options: categoryOptions,
    helperText: 'Select a category',
  },
};

export const WithTooltip: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number>('');
    return (
      <div style={{ width: '300px' }}>
        <StandaloneDropdownField {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    label: 'Product Category',
    options: categoryOptions,
    tooltip: 'Choose the best category for this product',
    helperText: 'Select one category',
  },
};

export const Required: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number>('');
    const error = !value ? 'Category is required' : '';
    return (
      <div style={{ width: '300px' }}>
        <StandaloneDropdownField
          {...args}
          value={value}
          onChange={setValue}
          error={error}
        />
      </div>
    );
  },
  args: {
    label: 'Category',
    options: categoryOptions,
    required: true,
  },
};

export const WithPreselectedValue: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number>('electronics');
    return (
      <div style={{ width: '300px' }}>
        <StandaloneDropdownField {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    label: 'Category',
    options: categoryOptions,
    helperText: 'Electronics is pre-selected',
  },
};

export const WithAPIEndpoint: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number>('');
    return (
      <div style={{ width: '300px' }}>
        <StandaloneDropdownField {...args} value={value} onChange={setValue} />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          Loads options from /api/categories
        </p>
      </div>
    );
  },
  args: {
    label: 'Category (API)',
    apiEndpoint: '/api/categories',
    helperText: 'Options loaded from API',
  },
};

export const CustomFieldMapping: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number>('');
    return (
      <div style={{ width: '300px' }}>
        <div
          style={{
            padding: '12px',
            marginBottom: '16px',
            background: '#f5f5f5',
            borderRadius: '4px',
          }}
        >
          <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold' }}>
            API Response Format:
          </p>
          <pre style={{ margin: '8px 0 0 0', fontSize: '11px' }}>
            {`[{ id: 1, name: 'Electronics' }]`}
          </pre>
        </div>
        <StandaloneDropdownField
          label="Category"
          value={value}
          onChange={setValue}
          options={categoryOptions}
          helperText="Use apiValueField='id' and apiLabelField='name'"
        />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          Props: <code>apiValueField="id"</code>,{' '}
          <code>apiLabelField="name"</code>
        </p>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: (args) => {
    const [value] = useState<string | number>('electronics');
    return (
      <div style={{ width: '300px' }}>
        <StandaloneDropdownField {...args} value={value} onChange={() => {}} />
      </div>
    );
  },
  args: {
    label: 'Category',
    options: categoryOptions,
    disabled: true,
    helperText: 'This field is disabled',
  },
};
