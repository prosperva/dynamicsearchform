import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { StandalonePillField } from '../StandalonePillField';

const meta = {
  title: 'Standalone Fields/PillField',
  component: StandalonePillField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    pillType: {
      control: 'select',
      options: ['text', 'number'],
      description: 'Type of values (text or number)',
    },
    allowRanges: {
      control: 'boolean',
      description: 'Allow number ranges (e.g., 1-5)',
    },
    showClearButton: {
      control: 'boolean',
      description: 'Show Clear All button',
    },
    compactDisplayLimit: {
      control: 'number',
      description: 'Max chips before collapse',
    },
  },
} satisfies Meta<typeof StandalonePillField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextMode: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div style={{ width: '500px' }}>
        <StandalonePillField {...args} value={value} onChange={setValue} />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          Type tags separated by commas, then press Enter
        </p>
      </div>
    );
  },
  args: {
    label: 'Product Tags',
    pillType: 'text',
    placeholder: 'Enter tags separated by commas (e.g., featured, new, sale)',
    helperText: 'Press Enter to add tags',
  },
};

export const NumberMode: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div style={{ width: '500px' }}>
        <StandalonePillField {...args} value={value} onChange={setValue} />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          Type numbers separated by commas, then press Enter
        </p>
      </div>
    );
  },
  args: {
    label: 'SKU Numbers',
    pillType: 'number',
    placeholder: 'Enter SKU numbers (e.g., 100, 200, 300)',
    helperText: 'Enter numeric SKUs only',
  },
};

export const WithRanges: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div style={{ width: '500px' }}>
        <StandalonePillField {...args} value={value} onChange={setValue} />
        <div
          style={{
            marginTop: '12px',
            padding: '12px',
            background: '#e3f2fd',
            borderRadius: '4px',
          }}
        >
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold' }}>
            Range Examples:
          </p>
          <ul style={{ margin: '8px 0 0 20px', fontSize: '12px' }}>
            <li>
              <code>1-5</code> expands to: 1, 2, 3, 4, 5
            </li>
            <li>
              <code>100-105, 200</code> expands to: 100, 101, 102, 103, 104,
              105, 200
            </li>
          </ul>
        </div>
      </div>
    );
  },
  args: {
    label: 'ID Ranges',
    pillType: 'number',
    allowRanges: true,
    placeholder: 'Enter ranges (e.g., 100-150, 178)',
    helperText: 'Use ranges like 1-5 or individual numbers',
  },
};

export const WithManyChips: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>([
      'featured',
      'new',
      'sale',
      'bestseller',
      'trending',
      'popular',
      'recommended',
      'clearance',
      'limited',
      'exclusive',
      'premium',
      'budget',
      'organic',
      'eco-friendly',
      'handmade',
      'vintage',
      'modern',
      'classic',
      'luxury',
      'affordable',
      'durable',
      'lightweight',
      'portable',
      'wireless',
      'rechargeable',
    ]);
    return (
      <div style={{ width: '500px' }}>
        <StandalonePillField {...args} value={value} onChange={setValue} />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          {value.length} tags total. First 20 shown, rest collapsed.
        </p>
      </div>
    );
  },
  args: {
    label: 'Many Tags',
    pillType: 'text',
    compactDisplayLimit: 20,
    helperText: 'Showing first 20, click "Show More" to see all',
  },
};

export const WithTooltip: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(['organic', 'eco-friendly']);
    return (
      <div style={{ width: '500px' }}>
        <StandalonePillField {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    label: 'Product Attributes',
    pillType: 'text',
    tooltip: 'Add searchable attributes for your product',
    helperText: 'These will help customers find your product',
  },
};

export const Required: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    const error = value.length === 0 ? 'At least one tag is required' : '';
    return (
      <div style={{ width: '500px' }}>
        <StandalonePillField
          {...args}
          value={value}
          onChange={setValue}
          error={error}
        />
      </div>
    );
  },
  args: {
    label: 'Tags',
    pillType: 'text',
    required: true,
    placeholder: 'Add at least one tag',
  },
};

export const WithoutClearButton: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(['tag1', 'tag2', 'tag3']);
    return (
      <div style={{ width: '500px' }}>
        <StandalonePillField {...args} value={value} onChange={setValue} />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          Clear All button is hidden
        </p>
      </div>
    );
  },
  args: {
    label: 'Tags',
    pillType: 'text',
    showClearButton: false,
  },
};

export const Disabled: Story = {
  render: (args) => {
    const [value] = useState<string[]>(['locked', 'tag']);
    return (
      <div style={{ width: '500px' }}>
        <StandalonePillField {...args} value={value} onChange={() => {}} />
      </div>
    );
  },
  args: {
    label: 'Read-only Tags',
    pillType: 'text',
    disabled: true,
    helperText: 'These tags cannot be modified',
  },
};
