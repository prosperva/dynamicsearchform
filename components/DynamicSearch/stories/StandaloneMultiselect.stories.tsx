import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { StandaloneMultiselectField } from '../StandaloneMultiselectField';

const meta = {
  title: 'Standalone Fields/MultiselectField',
  component: StandaloneMultiselectField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    showSelectAllButtons: {
      control: 'boolean',
      description: 'Show Select All and Clear All buttons',
    },
    limitTags: {
      control: 'number',
      description: 'Number of tags to show before "+X more"',
    },
    required: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof StandaloneMultiselectField>;

export default meta;
type Story = StoryObj<typeof meta>;

const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'cn', label: 'China' },
  { value: 'in', label: 'India' },
  { value: 'br', label: 'Brazil' },
];

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<(string | number)[]>([]);
    return (
      <div style={{ width: '400px' }}>
        <StandaloneMultiselectField
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
  args: {
    label: 'Select Countries',
    options: countryOptions,
    placeholder: 'Search countries...',
    helperText: 'Select one or more countries',
  },
};

export const WithSelectAllButtons: Story = {
  render: (args) => {
    const [value, setValue] = useState<(string | number)[]>([]);
    return (
      <div style={{ width: '400px' }}>
        <StandaloneMultiselectField
          {...args}
          value={value}
          onChange={setValue}
        />
        <p style={{ marginTop: '16px', color: '#666', fontSize: '14px' }}>
          Selected: {value.length} {value.length === 1 ? 'country' : 'countries'}
        </p>
      </div>
    );
  },
  args: {
    label: 'Select Countries',
    options: countryOptions,
    showSelectAllButtons: true,
    helperText: 'Use buttons to select or clear all',
  },
};

export const WithTooltip: Story = {
  render: (args) => {
    const [value, setValue] = useState<(string | number)[]>([]);
    return (
      <div style={{ width: '400px' }}>
        <StandaloneMultiselectField
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
  args: {
    label: 'Shipping Countries',
    options: countryOptions,
    tooltip: 'Select all countries where you ship products',
    helperText: 'Multiple selection allowed',
    showSelectAllButtons: true,
  },
};

export const LimitedTags: Story = {
  render: (args) => {
    const [value, setValue] = useState<(string | number)[]>(['us', 'uk', 'ca']);
    return (
      <div style={{ width: '400px' }}>
        <StandaloneMultiselectField
          {...args}
          value={value}
          onChange={setValue}
        />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          Try selecting more countries to see the "+X more" indicator
        </p>
      </div>
    );
  },
  args: {
    label: 'Countries',
    options: countryOptions,
    limitTags: 2,
    showSelectAllButtons: true,
    helperText: 'Only showing 2 tags, rest collapsed',
  },
};

export const Required: Story = {
  render: (args) => {
    const [value, setValue] = useState<(string | number)[]>([]);
    const error = value.length === 0 ? 'Please select at least one country' : '';
    return (
      <div style={{ width: '400px' }}>
        <StandaloneMultiselectField
          {...args}
          value={value}
          onChange={setValue}
          error={error}
        />
      </div>
    );
  },
  args: {
    label: 'Required Countries',
    options: countryOptions,
    required: true,
    showSelectAllButtons: true,
  },
};

export const WithAPIEndpoint: Story = {
  render: (args) => {
    const [value, setValue] = useState<(string | number)[]>([]);
    return (
      <div style={{ width: '400px' }}>
        <StandaloneMultiselectField
          {...args}
          value={value}
          onChange={setValue}
        />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          Note: This example uses the /api/countries endpoint
        </p>
      </div>
    );
  },
  args: {
    label: 'Countries (API)',
    apiEndpoint: '/api/countries',
    showSelectAllButtons: true,
    helperText: 'Loaded from API',
  },
};

export const CustomFieldMapping: Story = {
  render: (args) => {
    const [value, setValue] = useState<(string | number)[]>([]);

    // Simulated API response with custom field names
    const customOptions = countryOptions.map((opt) => ({
      countryId: opt.value,
      countryName: opt.label,
    }));

    // We'd normally use apiEndpoint with apiValueField and apiLabelField
    // For demo, we'll show the concept
    return (
      <div style={{ width: '400px' }}>
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
          <pre style={{ margin: '8px 0 0 0', fontSize: '11px', overflow: 'auto' }}>
            {JSON.stringify(customOptions.slice(0, 2), null, 2)}
          </pre>
        </div>
        <StandaloneMultiselectField
          label="Countries"
          value={value}
          onChange={setValue}
          options={countryOptions}
          showSelectAllButtons
          helperText="Use apiValueField='countryId' and apiLabelField='countryName'"
          tooltip="Custom field mapping example"
        />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          Props: <code>apiValueField="countryId"</code>,{' '}
          <code>apiLabelField="countryName"</code>
        </p>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: (args) => {
    const [value] = useState<(string | number)[]>(['us', 'uk']);
    return (
      <div style={{ width: '400px' }}>
        <StandaloneMultiselectField
          {...args}
          value={value}
          onChange={() => {}}
        />
      </div>
    );
  },
  args: {
    label: 'Disabled Field',
    options: countryOptions,
    disabled: true,
    helperText: 'This field is disabled',
  },
};
