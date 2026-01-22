import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { StandaloneNumberField } from '../StandaloneNumberField';

const meta = {
  title: 'Standalone Fields/NumberField',
  component: StandaloneNumberField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    min: {
      control: 'number',
      description: 'Minimum allowed value',
    },
    max: {
      control: 'number',
      description: 'Maximum allowed value',
    },
    step: {
      control: 'number',
      description: 'Step increment for arrows',
    },
  },
} satisfies Meta<typeof StandaloneNumberField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<number | string>('');
    return (
      <div style={{ width: '300px' }}>
        <StandaloneNumberField {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    label: 'Quantity',
    placeholder: 'Enter quantity',
    helperText: 'Enter a whole number',
  },
};

export const WithMinMax: Story = {
  render: (args) => {
    const [value, setValue] = useState<number | string>('');
    return (
      <div style={{ width: '300px' }}>
        <StandaloneNumberField {...args} value={value} onChange={setValue} />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          Valid range: 0 to 100
        </p>
      </div>
    );
  },
  args: {
    label: 'Percentage',
    min: 0,
    max: 100,
    placeholder: '0-100',
    helperText: 'Enter a value between 0 and 100',
  },
};

export const CurrencyWithStep: Story = {
  render: (args) => {
    const [value, setValue] = useState<number | string>('');
    return (
      <div style={{ width: '300px' }}>
        <StandaloneNumberField {...args} value={value} onChange={setValue} />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          Use arrow buttons for 0.01 increments
        </p>
      </div>
    );
  },
  args: {
    label: 'Price (USD)',
    min: 0,
    step: 0.01,
    placeholder: '0.00',
    helperText: 'Enter price in dollars and cents',
    tooltip: 'Product retail price',
  },
};

export const WithTooltip: Story = {
  render: (args) => {
    const [value, setValue] = useState<number | string>('');
    return (
      <div style={{ width: '300px' }}>
        <StandaloneNumberField {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    label: 'Stock Quantity',
    min: 0,
    placeholder: 'Enter stock quantity',
    helperText: 'Number of items in inventory',
    tooltip: 'Total available units across all warehouses',
  },
};

export const Required: Story = {
  render: (args) => {
    const [value, setValue] = useState<number | string>('');
    const error = value === '' ? 'Quantity is required' : '';
    return (
      <div style={{ width: '300px' }}>
        <StandaloneNumberField
          {...args}
          value={value}
          onChange={setValue}
          error={error}
        />
      </div>
    );
  },
  args: {
    label: 'Quantity',
    required: true,
    min: 1,
    placeholder: 'Enter quantity',
  },
};

export const WithValidation: Story = {
  render: (args) => {
    const [value, setValue] = useState<number | string>(150);
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    const error =
      numValue > 100
        ? 'Value must be 100 or less'
        : numValue < 0
          ? 'Value must be 0 or greater'
          : '';

    return (
      <div style={{ width: '300px' }}>
        <StandaloneNumberField
          {...args}
          value={value}
          onChange={setValue}
          error={error}
        />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          Try entering a value outside the 0-100 range
        </p>
      </div>
    );
  },
  args: {
    label: 'Discount Percentage',
    min: 0,
    max: 100,
    required: true,
    placeholder: '0-100',
  },
};

export const LargeNumbers: Story = {
  render: (args) => {
    const [value, setValue] = useState<number | string>('');
    return (
      <div style={{ width: '300px' }}>
        <StandaloneNumberField {...args} value={value} onChange={setValue} />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          For product IDs, SKUs, etc.
        </p>
      </div>
    );
  },
  args: {
    label: 'Product ID',
    min: 1,
    step: 1,
    placeholder: 'Enter product ID',
    helperText: 'Unique numeric identifier',
  },
};

export const Disabled: Story = {
  render: (args) => {
    const [value] = useState<number | string>(42);
    return (
      <div style={{ width: '300px' }}>
        <StandaloneNumberField {...args} value={value} onChange={() => {}} />
      </div>
    );
  },
  args: {
    label: 'System Generated ID',
    disabled: true,
    helperText: 'This value is read-only',
  },
};
