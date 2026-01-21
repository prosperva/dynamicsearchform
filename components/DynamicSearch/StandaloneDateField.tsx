'use client';

import React from 'react';
import { Box, Tooltip } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { HelpOutline as HelpIcon } from '@mui/icons-material';

export interface StandaloneDateFieldProps {
  label: string;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  tooltip?: string;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  disablePast?: boolean;
  disableFuture?: boolean;
}

/**
 * StandaloneDateField - A date picker field
 *
 * Features:
 * - Date selection with calendar UI
 * - Min/max date constraints
 * - Disable past/future dates
 * - Optional tooltip
 * - Localization support
 *
 * @example
 * import dayjs from 'dayjs';
 *
 * <StandaloneDateField
 *   label="Start Date"
 *   value={startDate}
 *   onChange={setStartDate}
 *   disablePast
 *   helperText="Select a start date"
 * />
 */
export const StandaloneDateField: React.FC<StandaloneDateFieldProps> = ({
  label,
  value = null,
  onChange,
  helperText,
  error,
  required = false,
  disabled = false,
  tooltip,
  minDate,
  maxDate,
  disablePast = false,
  disableFuture = false,
}) => {
  const labelWithTooltip = tooltip ? (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      {label}
      <Tooltip title={tooltip} arrow placement="top" enterDelay={200} leaveDelay={200}>
        <Box
          component="span"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            ml: 0.5,
            cursor: 'help',
            color: 'action.active',
          }}
        >
          <HelpIcon fontSize="small" sx={{ fontSize: '1rem' }} />
        </Box>
      </Tooltip>
    </Box>
  ) : label;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={labelWithTooltip}
        value={value}
        onChange={onChange}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        disablePast={disablePast}
        disableFuture={disableFuture}
        slotProps={{
          textField: {
            fullWidth: true,
            error: !!error,
            helperText: error || helperText,
            required,
          },
        }}
      />
    </LocalizationProvider>
  );
};
