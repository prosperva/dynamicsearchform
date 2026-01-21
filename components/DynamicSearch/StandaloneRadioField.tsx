'use client';

import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  Box,
  Tooltip,
} from '@mui/material';
import { HelpOutline as HelpIcon } from '@mui/icons-material';

export interface RadioOption {
  value: string | number;
  label: string;
}

export interface StandaloneRadioFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: RadioOption[];
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  tooltip?: string;
  row?: boolean; // Display options horizontally
}

/**
 * StandaloneRadioField - A radio button group field
 *
 * Features:
 * - Multiple radio options
 * - Horizontal or vertical layout
 * - Optional tooltip
 * - Error state support
 *
 * @example
 * <StandaloneRadioField
 *   label="Condition"
 *   value={condition}
 *   onChange={setCondition}
 *   options={[
 *     { value: 'new', label: 'New' },
 *     { value: 'used', label: 'Used' },
 *     { value: 'refurbished', label: 'Refurbished' }
 *   ]}
 *   row
 * />
 */
export const StandaloneRadioField: React.FC<StandaloneRadioFieldProps> = ({
  label,
  value = '',
  onChange,
  options = [],
  helperText,
  error,
  required = false,
  disabled = false,
  tooltip,
  row = false,
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
    <FormControl error={!!error} disabled={disabled} required={required} fullWidth>
      <FormLabel>{labelWithTooltip}</FormLabel>
      <RadioGroup
        value={value}
        onChange={(e) => onChange(e.target.value)}
        row={row}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
      {(error || helperText) && (
        <FormHelperText>{error || helperText}</FormHelperText>
      )}
    </FormControl>
  );
};
