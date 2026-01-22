import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { StandaloneRadioField } from '../StandaloneRadioField';

const meta = {
  title: 'Standalone Fields/RadioField',
  component: StandaloneRadioField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    row: {
      control: 'boolean',
      description: 'Display options horizontally',
    },
  },
} satisfies Meta<typeof StandaloneRadioField>;

export default meta;
type Story = StoryObj<typeof meta>;

const sizeOptions = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'xlarge', label: 'X-Large' },
];

const shippingOptions = [
  { value: 'standard', label: 'Standard Shipping (5-7 days)' },
  { value: 'express', label: 'Express Shipping (2-3 days)' },
  { value: 'overnight', label: 'Overnight Shipping (1 day)' },
];

const conditionOptions = [
  { value: 'new', label: 'New' },
  { value: 'used', label: 'Used - Like New' },
  { value: 'refurbished', label: 'Refurbished' },
];

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number>('');
    return (
      <div style={{ width: '400px' }}>
        <StandaloneRadioField {...args} value={value} onChange={setValue} />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          Selected: {value || 'None'}
        </p>
      </div>
    );
  },
  args: {
    label: 'Product Size',
    options: sizeOptions,
    helperText: 'Select a size',
  },
};

export const Horizontal: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number>('medium');
    return (
      <div style={{ width: '500px' }}>
        <StandaloneRadioField {...args} value={value} onChange={setValue} />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          Options displayed in a row
        </p>
      </div>
    );
  },
  args: {
    label: 'Size',
    options: sizeOptions,
    row: true,
    helperText: 'Choose your preferred size',
  },
};

export const WithTooltip: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number>('');
    return (
      <div style={{ width: '400px' }}>
        <StandaloneRadioField {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    label: 'Shipping Method',
    options: shippingOptions,
    tooltip: 'Shipping costs calculated at checkout',
    helperText: 'Select your preferred shipping speed',
  },
};

export const Required: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number>('');
    const error = !value ? 'Please select a condition' : '';
    return (
      <div style={{ width: '400px' }}>
        <StandaloneRadioField
          {...args}
          value={value}
          onChange={setValue}
          error={error}
        />
      </div>
    );
  },
  args: {
    label: 'Product Condition',
    options: conditionOptions,
    required: true,
  },
};

export const WithPreselectedValue: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number>('new');
    return (
      <div style={{ width: '400px' }}>
        <StandaloneRadioField {...args} value={value} onChange={setValue} />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          &quot;New&quot; is pre-selected
        </p>
      </div>
    );
  },
  args: {
    label: 'Condition',
    options: conditionOptions,
    helperText: 'Select product condition',
  },
};

export const ManyOptions: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number>('');
    const colorOptions = [
      { value: 'red', label: 'Red' },
      { value: 'blue', label: 'Blue' },
      { value: 'green', label: 'Green' },
      { value: 'yellow', label: 'Yellow' },
      { value: 'orange', label: 'Orange' },
      { value: 'purple', label: 'Purple' },
      { value: 'black', label: 'Black' },
      { value: 'white', label: 'White' },
      { value: 'gray', label: 'Gray' },
      { value: 'pink', label: 'Pink' },
    ];

    return (
      <div style={{ width: '400px' }}>
        <StandaloneRadioField
          label="Color"
          value={value}
          onChange={setValue}
          options={colorOptions}
          helperText="Select a color"
        />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          Vertical layout works well for many options
        </p>
      </div>
    );
  },
};

export const PaymentMethod: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number>('credit');
    const paymentOptions = [
      { value: 'credit', label: 'Credit Card (Visa, Mastercard, Amex)' },
      { value: 'paypal', label: 'PayPal' },
      { value: 'bank', label: 'Bank Transfer' },
      { value: 'crypto', label: 'Cryptocurrency' },
    ];

    return (
      <div style={{ width: '500px' }}>
        <StandaloneRadioField
          label="Payment Method"
          value={value}
          onChange={setValue}
          options={paymentOptions}
          required
          helperText="Choose how you would like to pay"
          tooltip="All payment methods are secure and encrypted"
        />
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            background: '#e3f2fd',
            borderRadius: '4px',
          }}
        >
          <p style={{ margin: 0, fontSize: '13px' }}>
            Selected: <strong>{value}</strong>
          </p>
        </div>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: (args) => {
    const [value] = useState<string | number>('standard');
    return (
      <div style={{ width: '400px' }}>
        <StandaloneRadioField {...args} value={value} onChange={() => {}} />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          Shipping method locked for this order
        </p>
      </div>
    );
  },
  args: {
    label: 'Shipping Method',
    options: shippingOptions,
    disabled: true,
    helperText: 'This option cannot be changed',
  },
};
