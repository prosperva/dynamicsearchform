'use client';

import React, { useState, useEffect } from 'react';
import {
  Autocomplete,
  TextField,
  Chip,
  Box,
  Tooltip,
  CircularProgress,
  Button,
  Stack,
} from '@mui/material';
import { HelpOutline as HelpIcon } from '@mui/icons-material';

export interface MultiselectOption {
  value: string | number;
  label: string;
}

export interface StandaloneMultiselectFieldProps {
  label: string;
  value: (string | number)[];
  onChange: (values: (string | number)[]) => void;
  options?: MultiselectOption[];
  apiEndpoint?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  tooltip?: string;
  limitTags?: number; // Number of tags to show before "+X more"
  showSelectAllButtons?: boolean; // Show "Select All" and "Clear All" buttons (default: false)
}

/**
 * StandaloneMultiselectField - A multi-select autocomplete field
 *
 * Features:
 * - Multiple value selection with autocomplete
 * - Static options or API-loaded options
 * - Chip display for selected values
 * - Search/filter functionality
 * - Optional tooltip
 *
 * @example
 * // Static options
 * <StandaloneMultiselectField
 *   label="Countries"
 *   value={countries}
 *   onChange={setCountries}
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'uk', label: 'United Kingdom' }
 *   ]}
 * />
 *
 * @example
 * // API-loaded options
 * <StandaloneMultiselectField
 *   label="Countries"
 *   value={countries}
 *   onChange={setCountries}
 *   apiEndpoint="/api/countries"
 * />
 */
export const StandaloneMultiselectField: React.FC<StandaloneMultiselectFieldProps> = ({
  label,
  value = [],
  onChange,
  options: initialOptions = [],
  apiEndpoint,
  placeholder,
  helperText,
  error,
  required = false,
  disabled = false,
  tooltip,
  limitTags = 3,
  showSelectAllButtons = false,
}) => {
  const [options, setOptions] = useState<MultiselectOption[]>(initialOptions);
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
          console.error('Failed to fetch multiselect options:', error);
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

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  const handleSelectAll = () => {
    onChange(options.map((opt) => opt.value));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <Box>
      {showSelectAllButtons && options.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={handleSelectAll}
            disabled={disabled || loading}
          >
            Select All
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={handleClearAll}
            disabled={disabled || loading}
          >
            Clear All
          </Button>
        </Stack>
      )}
      <Autocomplete
      multiple
      fullWidth
      options={options}
      value={selectedOptions}
      onChange={(_, newValue) => {
        onChange(newValue.map((opt) => opt.value));
      }}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      disabled={disabled || loading}
      loading={loading}
      limitTags={limitTags}
      renderInput={(params) => (
        <TextField
          {...params}
          label={labelWithTooltip}
          placeholder={placeholder}
          error={!!error}
          helperText={error || helperText}
          required={required}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={option.value}
            label={option.label}
            size="small"
          />
        ))
      }
    />
    </Box>
  );
};
