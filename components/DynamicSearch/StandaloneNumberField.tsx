'use client';

import React from 'react';
import { TextField, Box, Tooltip } from '@mui/material';
import { HelpOutline as HelpIcon } from '@mui/icons-material';

export interface StandaloneNumberFieldProps {
  label: string;
  value: number | string;
  onChange: (value: number | string) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  tooltip?: string;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * StandaloneNumberField - A numeric input field
 *
 * Features:
 * - Numeric input with validation
 * - Min/max value constraints
 * - Step increment support
 * - Optional tooltip
 *
 * @example
 * <StandaloneNumberField
 *   label="Price"
 *   value={price}
 *   onChange={setPrice}
 *   min={0}
 *   step={0.01}
 *   helperText="Enter product price"
 * />
 */
export const StandaloneNumberField: React.FC<StandaloneNumberFieldProps> = ({
  label,
  value = '',
  onChange,
  placeholder,
  helperText,
  error,
  required = false,
  disabled = false,
  tooltip,
  min,
  max,
  step,
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
    <TextField
      fullWidth
      type="number"
      label={labelWithTooltip}
      value={value}
      onChange={(e) => {
        const val = e.target.value;
        onChange(val === '' ? '' : Number(val));
      }}
      placeholder={placeholder}
      variant="outlined"
      error={!!error}
      helperText={error || helperText}
      required={required}
      disabled={disabled}
      InputProps={{
        inputProps: {
          min,
          max,
          step,
        },
      }}
    />
  );
};
