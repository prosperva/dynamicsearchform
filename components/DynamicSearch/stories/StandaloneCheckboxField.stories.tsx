import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { StandaloneCheckboxField } from '../StandaloneCheckboxField';

const meta = {
  title: 'Standalone Fields/CheckboxField',
  component: StandaloneCheckboxField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StandaloneCheckboxField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(false);
    return (
      <div style={{ width: '400px' }}>
        <StandaloneCheckboxField {...args} value={value} onChange={setValue} />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          Current value: {value ? 'true' : 'false'}
        </p>
      </div>
    );
  },
  args: {
    label: 'Subscribe to newsletter',
    helperText: 'Receive updates about new products',
  },
};

export const WithTooltip: Story = {
  render: (args) => {
    const [value, setValue] = useState(false);
    return (
      <div style={{ width: '400px' }}>
        <StandaloneCheckboxField {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    label: 'Enable notifications',
    helperText: 'Get email alerts for important updates',
    tooltip: 'You can change this setting anytime in your profile',
  },
};

export const Required: Story = {
  render: (args) => {
    const [value, setValue] = useState(false);
    const error = !value ? 'You must accept the terms to continue' : '';
    return (
      <div style={{ width: '400px' }}>
        <StandaloneCheckboxField
          {...args}
          value={value}
          onChange={setValue}
          error={error}
        />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          This checkbox must be checked
        </p>
      </div>
    );
  },
  args: {
    label: 'I agree to the Terms and Conditions',
    required: true,
  },
};

export const PreChecked: Story = {
  render: (args) => {
    const [value, setValue] = useState(true);
    return (
      <div style={{ width: '400px' }}>
        <StandaloneCheckboxField {...args} value={value} onChange={setValue} />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          This checkbox is checked by default
        </p>
      </div>
    );
  },
  args: {
    label: 'In Stock',
    helperText: 'Product is available for purchase',
  },
};

export const WithLongLabel: Story = {
  render: (args) => {
    const [value, setValue] = useState(false);
    return (
      <div style={{ width: '500px' }}>
        <StandaloneCheckboxField {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    label:
      'I acknowledge that I have read and understood the privacy policy, terms of service, and cookie policy',
    helperText:
      'By checking this box, you consent to our data processing practices',
  },
};

export const FeatureToggle: Story = {
  render: (args) => {
    const [features, setFeatures] = useState({
      darkMode: false,
      notifications: true,
      analytics: false,
      autoSave: true,
    });

    return (
      <div style={{ width: '400px' }}>
        <div
          style={{
            padding: '16px',
            background: '#f5f5f5',
            borderRadius: '4px',
          }}
        >
          <h3 style={{ marginTop: 0 }}>Feature Settings</h3>
          <StandaloneCheckboxField
            label="Dark Mode"
            value={features.darkMode}
            onChange={(val) => setFeatures({ ...features, darkMode: val })}
            helperText="Enable dark theme"
          />
          <StandaloneCheckboxField
            label="Push Notifications"
            value={features.notifications}
            onChange={(val) => setFeatures({ ...features, notifications: val })}
            helperText="Receive push notifications"
          />
          <StandaloneCheckboxField
            label="Usage Analytics"
            value={features.analytics}
            onChange={(val) => setFeatures({ ...features, analytics: val })}
            helperText="Help us improve the product"
          />
          <StandaloneCheckboxField
            label="Auto-Save"
            value={features.autoSave}
            onChange={(val) => setFeatures({ ...features, autoSave: val })}
            helperText="Automatically save your work"
          />
        </div>
        <pre
          style={{
            marginTop: '16px',
            padding: '12px',
            background: '#e3f2fd',
            borderRadius: '4px',
            fontSize: '12px',
          }}
        >
          {JSON.stringify(features, null, 2)}
        </pre>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: (args) => {
    const [value] = useState(true);
    return (
      <div style={{ width: '400px' }}>
        <StandaloneCheckboxField {...args} value={value} onChange={() => {}} />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          This setting is managed by your administrator
        </p>
      </div>
    );
  },
  args: {
    label: 'Two-Factor Authentication',
    disabled: true,
    helperText: 'This feature is permanently enabled for security',
  },
};
