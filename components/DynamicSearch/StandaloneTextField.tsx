'use client';

import React from 'react';
import { TextField, Box, Tooltip } from '@mui/material';
import { HelpOutline as HelpIcon } from '@mui/icons-material';

export interface StandaloneTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  tooltip?: string;
  multiline?: boolean;
  rows?: number;
  type?: 'text' | 'email' | 'password' | 'url' | 'tel';
}

/**
 * StandaloneTextField - A text input field
 *
 * Features:
 * - Single or multiline text input
 * - Optional tooltip
 * - Error state support
 * - Different input types (email, password, url, tel)
 *
 * @example
 * <StandaloneTextField
 *   label="Product Name"
 *   value={productName}
 *   onChange={setProductName}
 *   required
 *   helperText="Enter the product name"
 * />
 */
export const StandaloneTextField: React.FC<StandaloneTextFieldProps> = ({
  label,
  value = '',
  onChange,
  placeholder,
  helperText,
  error,
  required = false,
  disabled = false,
  tooltip,
  multiline = false,
  rows = 3,
  type = 'text',
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
      label={labelWithTooltip}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      variant="outlined"
      error={!!error}
      helperText={error || helperText}
      required={required}
      disabled={disabled}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      type={type}
    />
  );
};
