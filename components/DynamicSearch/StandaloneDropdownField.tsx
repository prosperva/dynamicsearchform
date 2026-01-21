'use client';

import React, { useState, useEffect } from 'react';
import {
  TextField,
  MenuItem,
  Box,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { HelpOutline as HelpIcon } from '@mui/icons-material';

export interface DropdownOption {
  value: string | number;
  label: string;
}

export interface StandaloneDropdownFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options?: DropdownOption[];
  apiEndpoint?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  tooltip?: string;
}

/**
 * StandaloneDropdownField - A dropdown/select field
 *
 * Features:
 * - Static options or API-loaded options
 * - Loading state for async data
 * - Optional tooltip
 * - Error state support
 *
 * @example
 * // Static options
 * <StandaloneDropdownField
 *   label="Category"
 *   value={category}
 *   onChange={setCategory}
 *   options={[
 *     { value: 'electronics', label: 'Electronics' },
 *     { value: 'clothing', label: 'Clothing' }
 *   ]}
 * />
 *
 * @example
 * // API-loaded options
 * <StandaloneDropdownField
 *   label="Category"
 *   value={category}
 *   onChange={setCategory}
 *   apiEndpoint="/api/categories"
 * />
 */
export const StandaloneDropdownField: React.FC<StandaloneDropdownFieldProps> = ({
  label,
  value = '',
  onChange,
  options: initialOptions = [],
  apiEndpoint,
  placeholder,
  helperText,
  error,
  required = false,
  disabled = false,
  tooltip,
}) => {
  const [options, setOptions] = useState<DropdownOption[]>(initialOptions);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (apiEndpoint) {
      const fetchOptions = async () => {
        setLoading(true);
        try {
          const response = await fetch(apiEndpoint);
          const data = await response.json();
          setOptions(data);
        } catch (error) {
          console.error('Failed to fetch dropdown options:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchOptions();
    }
  }, [apiEndpoint]);

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
      select
      fullWidth
      label={labelWithTooltip}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      variant="outlined"
      error={!!error}
      helperText={error || helperText}
      required={required}
      disabled={disabled || loading}
      InputProps={{
        endAdornment: loading ? <CircularProgress size={20} /> : null,
      }}
    >
      {!required && (
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
      )}
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
