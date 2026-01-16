'use client';

import React, { useState, useEffect } from 'react';
import {
  TextField,
  CircularProgress,
  Box,
  Autocomplete,
} from '@mui/material';

export interface DropdownOption {
  label: string;
  value: string | number;
}

export interface SearchableDropdownProps {
  label: string;
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  options?: DropdownOption[];
  apiUrl?: string;
  apiLabelField?: string; // Field name for label in API response (default: 'label')
  apiValueField?: string; // Field name for value in API response (default: 'value')
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  loading?: boolean; // Allow parent to control loading state
  onLoadOptions?: (options: DropdownOption[]) => void; // Callback when options are loaded from API
}

/**
 * SearchableDropdown - Standalone dropdown component with built-in search/filter
 *
 * Features:
 * - Type to search/filter options
 * - Works with static options or API-driven data
 * - Custom field mapping for non-standard APIs
 * - Loading states
 * - Error handling
 * - Full Material-UI theming support
 *
 * @example
 * // Static options
 * <SearchableDropdown
 *   label="Category"
 *   value={category}
 *   onChange={setCategory}
 *   options={[
 *     { label: 'Electronics', value: 'electronics' },
 *     { label: 'Books', value: 'books' },
 *   ]}
 * />
 *
 * @example
 * // API-driven with custom field mapping
 * <SearchableDropdown
 *   label="City"
 *   value={cityId}
 *   onChange={setCityId}
 *   apiUrl="/api/cities"
 *   apiLabelField="name"
 *   apiValueField="id"
 * />
 */
export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  label,
  value,
  onChange,
  options: staticOptions,
  apiUrl,
  apiLabelField = 'label',
  apiValueField = 'value',
  placeholder,
  helperText,
  error,
  required = false,
  disabled = false,
  fullWidth = true,
  loading: externalLoading,
  onLoadOptions,
}) => {
  const [options, setOptions] = useState<DropdownOption[]>(staticOptions || []);
  const [internalLoading, setInternalLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Use external loading if provided, otherwise use internal
  const isLoading = externalLoading !== undefined ? externalLoading : internalLoading;

  useEffect(() => {
    // If static options are provided, use them
    if (staticOptions) {
      setOptions(staticOptions);
      return;
    }

    // If API URL is provided, fetch options
    if (apiUrl) {
      fetchOptions();
    }
  }, [apiUrl, staticOptions]);

  const fetchOptions = async () => {
    if (!apiUrl) return;

    setInternalLoading(true);
    setApiError(null);

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Map API response to DropdownOption format
      const mappedOptions: DropdownOption[] = data.map((item: any) => ({
        label: item[apiLabelField],
        value: item[apiValueField],
      }));

      setOptions(mappedOptions);

      // Notify parent if callback provided
      if (onLoadOptions) {
        onLoadOptions(mappedOptions);
      }
    } catch (err) {
      console.error(`Error fetching options for ${label}:`, err);
      setApiError(err instanceof Error ? err.message : 'Failed to load options');
      setOptions([]);
    } finally {
      setInternalLoading(false);
    }
  };

  // Find the selected option object
  const selectedOption = options.find((opt) => opt.value === value) || null;

  return (
    <Autocomplete
      options={options}
      value={selectedOption}
      onChange={(_, newValue) => {
        onChange(newValue ? newValue.value : null);
      }}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      disabled={disabled || isLoading}
      loading={isLoading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          helperText={error || apiError || helperText}
          error={!!error || !!apiError}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      fullWidth={fullWidth}
    />
  );
};
