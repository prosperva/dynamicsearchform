import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { StandaloneTextField } from '../StandaloneTextField';

const meta = {
  title: 'Standalone Fields/TextField',
  component: StandaloneTextField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Field label',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'url', 'tel'],
      description: 'Input type',
    },
    multiline: {
      control: 'boolean',
      description: 'Enable multiline input',
    },
    rows: {
      control: 'number',
      description: 'Number of rows (multiline only)',
    },
    required: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof StandaloneTextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <StandaloneTextField {...args} value={value} onChange={setValue} />;
  },
  args: {
    label: 'Product Name',
    placeholder: 'Enter product name',
    helperText: 'Minimum 3 characters',
  },
};

export const WithTooltip: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <StandaloneTextField {...args} value={value} onChange={setValue} />;
  },
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'user@example.com',
    helperText: 'We will never share your email',
    tooltip: 'Enter a valid email address',
  },
};

export const Required: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <StandaloneTextField {...args} value={value} onChange={setValue} />;
  },
  args: {
    label: 'Username',
    required: true,
    placeholder: 'Enter username',
  },
};

export const WithError: Story = {
  render: (args) => {
    const [value, setValue] = useState('ab');
    const error = value.length < 3 ? 'Minimum 3 characters required' : '';
    return (
      <StandaloneTextField
        {...args}
        value={value}
        onChange={setValue}
        error={error}
      />
    );
  },
  args: {
    label: 'Username',
    required: true,
    placeholder: 'Enter username (min 3 chars)',
  },
};

export const Multiline: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <StandaloneTextField {...args} value={value} onChange={setValue} />;
  },
  args: {
    label: 'Description',
    multiline: true,
    rows: 4,
    placeholder: 'Enter product description',
    helperText: 'Maximum 500 characters',
  },
};

export const Password: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <StandaloneTextField {...args} value={value} onChange={setValue} />;
  },
  args: {
    label: 'Password',
    type: 'password',
    required: true,
    helperText: 'Must be at least 8 characters',
  },
};

export const Disabled: Story = {
  render: (args) => {
    const [value] = useState('Cannot edit this');
    return <StandaloneTextField {...args} value={value} onChange={() => {}} />;
  },
  args: {
    label: 'Read Only Field',
    disabled: true,
    helperText: 'This field is disabled',
  },
};
