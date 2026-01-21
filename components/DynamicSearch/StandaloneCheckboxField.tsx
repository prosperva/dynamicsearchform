'use client';

import React from 'react';
import {
  FormControl,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Box,
  Tooltip,
} from '@mui/material';
import { HelpOutline as HelpIcon } from '@mui/icons-material';

export interface StandaloneCheckboxFieldProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  tooltip?: string;
}

/**
 * StandaloneCheckboxField - A checkbox field
 *
 * Features:
 * - Single checkbox with label
 * - Optional tooltip
 * - Error state support
 * - Helper text
 *
 * @example
 * <StandaloneCheckboxField
 *   label="In Stock Only"
 *   value={inStockOnly}
 *   onChange={setInStockOnly}
 *   helperText="Show only products in stock"
 * />
 */
export const StandaloneCheckboxField: React.FC<StandaloneCheckboxFieldProps> = ({
  label,
  value = false,
  onChange,
  helperText,
  error,
  required = false,
  disabled = false,
  tooltip,
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
    <FormControl error={!!error} disabled={disabled} required={required}>
      <FormControlLabel
        control={
          <Checkbox
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
          />
        }
        label={labelWithTooltip}
      />
      {(error || helperText) && (
        <FormHelperText>{error || helperText}</FormHelperText>
      )}
    </FormControl>
  );
};
