import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { StandaloneDateField } from '../StandaloneDateField';

const meta = {
  title: 'Standalone Fields/DateField',
  component: StandaloneDateField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div style={{ width: '350px' }}>
          <Story />
        </div>
      </LocalizationProvider>
    ),
  ],
  argTypes: {
    disablePast: {
      control: 'boolean',
      description: 'Disable past dates',
    },
    disableFuture: {
      control: 'boolean',
      description: 'Disable future dates',
    },
  },
} satisfies Meta<typeof StandaloneDateField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(null);
    return (
      <div>
        <StandaloneDateField {...args} value={value} onChange={setValue} />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          Selected: {value ? value.format('YYYY-MM-DD') : 'None'}
        </p>
      </div>
    );
  },
  args: {
    label: 'Event Date',
    helperText: 'Select a date',
  },
};

export const WithTooltip: Story = {
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(null);
    return (
      <StandaloneDateField {...args} value={value} onChange={setValue} />
    );
  },
  args: {
    label: 'Birth Date',
    helperText: 'Enter your date of birth',
    tooltip: 'Used for age verification purposes',
  },
};

export const Required: Story = {
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(null);
    const error = !value ? 'Date is required' : '';
    return (
      <StandaloneDateField
        {...args}
        value={value}
        onChange={setValue}
        error={error}
      />
    );
  },
  args: {
    label: 'Appointment Date',
    required: true,
  },
};

export const DisablePast: Story = {
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(null);
    return (
      <div>
        <StandaloneDateField {...args} value={value} onChange={setValue} />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          Only future dates can be selected
        </p>
      </div>
    );
  },
  args: {
    label: 'Delivery Date',
    disablePast: true,
    helperText: 'Choose a future delivery date',
    tooltip: 'We can only deliver on future dates',
  },
};

export const DisableFuture: Story = {
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(null);
    return (
      <div>
        <StandaloneDateField {...args} value={value} onChange={setValue} />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          Only past and present dates can be selected
        </p>
      </div>
    );
  },
  args: {
    label: 'Purchase Date',
    disableFuture: true,
    helperText: 'When did you buy this item?',
  },
};

export const WithMinDate: Story = {
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(null);
    const minDate = dayjs('2024-01-01');
    return (
      <div>
        <StandaloneDateField
          {...args}
          value={value}
          onChange={setValue}
          minDate={minDate}
        />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          Minimum date: {minDate.format('YYYY-MM-DD')}
        </p>
      </div>
    );
  },
  args: {
    label: 'Start Date',
    helperText: 'Must be after January 1, 2024',
  },
};

export const WithMaxDate: Story = {
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(null);
    const maxDate = dayjs('2026-12-31');
    return (
      <div>
        <StandaloneDateField
          {...args}
          value={value}
          onChange={setValue}
          maxDate={maxDate}
        />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          Maximum date: {maxDate.format('YYYY-MM-DD')}
        </p>
      </div>
    );
  },
  args: {
    label: 'End Date',
    helperText: 'Must be before December 31, 2026',
  },
};

export const WithDateRange: Story = {
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(null);
    const minDate = dayjs().add(1, 'week');
    const maxDate = dayjs().add(3, 'month');
    return (
      <div>
        <StandaloneDateField
          {...args}
          value={value}
          onChange={setValue}
          minDate={minDate}
          maxDate={maxDate}
        />
        <div
          style={{
            marginTop: '12px',
            padding: '12px',
            background: '#e3f2fd',
            borderRadius: '4px',
            fontSize: '12px',
          }}
        >
          <p style={{ margin: 0, fontWeight: 'bold' }}>Valid Range:</p>
          <p style={{ margin: '4px 0 0 0' }}>
            From: {minDate.format('YYYY-MM-DD')}
            <br />
            To: {maxDate.format('YYYY-MM-DD')}
          </p>
        </div>
      </div>
    );
  },
  args: {
    label: 'Vacation Date',
    required: true,
    helperText: 'Select a date within the next 3 months',
  },
};

export const PreselectedDate: Story = {
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(dayjs());
    return (
      <div>
        <StandaloneDateField {...args} value={value} onChange={setValue} />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          Defaults to today&apos;s date
        </p>
      </div>
    );
  },
  args: {
    label: 'Report Date',
    helperText: 'Date for the report generation',
  },
};

export const Disabled: Story = {
  render: (args) => {
    const [value] = useState<Dayjs | null>(dayjs('2024-06-15'));
    return (
      <div>
        <StandaloneDateField {...args} value={value} onChange={() => {}} />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          This date is locked and cannot be changed
        </p>
      </div>
    );
  },
  args: {
    label: 'Contract Start Date',
    disabled: true,
    helperText: 'Fixed contract date',
  },
};
