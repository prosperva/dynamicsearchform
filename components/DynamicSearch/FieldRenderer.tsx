'use client';

import React, { useEffect, useState } from 'react';
import {
  TextField,
  FormControl,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  FormHelperText,
  Chip,
  Box,
  CircularProgress,
  Button,
  Stack,
  Autocomplete,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  HelpOutline as HelpIcon,
  ExpandMore as ExpandMoreIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { FieldConfig, DropdownOption } from './types';
import { PillField } from './PillField';
import { ModalSelectField } from './ModalSelectField';

interface FieldRendererProps {
  field: FieldConfig;
  value: any;
  onChange: (name: string, value: any) => void;
  error?: string;
  allValues?: Record<string, any>; // All form values for field copying
  allFields?: FieldConfig[]; // All field configs to lookup labels
}

// Helper component to render label with optional tooltip
const LabelWithTooltip: React.FC<{ label: string; tooltip?: string }> = ({ label, tooltip }) => {
  if (!tooltip) return <>{label}</>;

  return (
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
  );
};

export const FieldRenderer: React.FC<FieldRendererProps> = ({ field, value, onChange, error, allValues = {}, allFields = [] }) => {
  const [options, setOptions] = useState<DropdownOption[]>(field.options || []);
  const [loading, setLoading] = useState(false);

  // Helper to find a field by name (recursively search through groups/accordions)
  const findFieldByName = (name: string, fields: FieldConfig[]): FieldConfig | null => {
    for (const f of fields) {
      if (f.name === name) return f;
      if (f.fields) {
        const found = findFieldByName(name, f.fields);
        if (found) return found;
      }
    }
    return null;
  };

  // Handle copying value from another field
  const handleCopyFromField = () => {
    if (field.copyFromField && allValues[field.copyFromField] !== undefined) {
      onChange(field.name, allValues[field.copyFromField]);
    }
  };

  useEffect(() => {
    if (field.apiUrl && !field.options) {
      fetchOptions();
    }
  }, [field.apiUrl]);


  const fetchOptions = async () => {
    if (!field.apiUrl) return;

    setLoading(true);
    try {
      const response = await fetch(field.apiUrl);
      const data = await response.json();

      // Map API response to DropdownOption format
      const labelField = field.apiLabelField || 'label';
      const valueField = field.apiValueField || 'value';

      const mappedOptions: DropdownOption[] = data.map((item: any) => ({
        label: item[labelField],
        value: item[valueField],
      }));

      setOptions(mappedOptions);
    } catch (error) {
      console.error(`Error fetching options for ${field.name}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (newValue: any) => {
    onChange(field.name, newValue);
  };

  // Render copy button if field has copyFromField configured
  const renderCopyButton = () => {
    if (!field.copyFromField) return null;

    const sourceField = findFieldByName(field.copyFromField, allFields);
    const sourceValue = allValues[field.copyFromField];
    const buttonText = field.copyButtonText || `Copy from ${sourceField?.label || field.copyFromField}`;

    return (
      <Button
        size="small"
        startIcon={<ContentCopyIcon />}
        onClick={handleCopyFromField}
        disabled={!sourceValue}
        variant="outlined"
        sx={{ mt: 1 }}
      >
        {buttonText}
      </Button>
    );
  };

  if (loading) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <CircularProgress size={20} />
        <span>Loading {field.label}...</span>
      </Box>
    );
  }

  switch (field.type) {
    case 'text':
      return (
        <Box>
          <TextField
            fullWidth
            label={<LabelWithTooltip label={field.label} tooltip={field.tooltip} />}
            name={field.name}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            helperText={error || field.helperText}
            required={field.required}
            variant="outlined"
            error={!!error}
          />
          {renderCopyButton()}
        </Box>
      );

    case 'number':
      return (
        <TextField
          fullWidth
          type="number"
          label={<LabelWithTooltip label={field.label} tooltip={field.tooltip} />}
          name={field.name}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={field.placeholder}
          helperText={error || field.helperText}
          required={field.required}
          variant="outlined"
          error={!!error}
        />
      );

    case 'date':
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={<LabelWithTooltip label={field.label} tooltip={field.tooltip} />}
            value={value ? dayjs(value) : null}
            onChange={(newValue: Dayjs | null) => {
              handleChange(newValue ? newValue.format('YYYY-MM-DD') : '');
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                required: field.required,
                helperText: error || field.helperText,
                variant: 'outlined',
                error: !!error,
              },
            }}
          />
        </LocalizationProvider>
      );

    case 'dropdown':
      const selectedOption = options.find((opt) => opt.value === value) || null;

      return (
        <Autocomplete
          options={options}
          value={selectedOption}
          onChange={(_, newValue) => {
            handleChange(newValue ? newValue.value : '');
          }}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderInput={(params) => (
            <TextField
              {...params}
              label={<LabelWithTooltip label={field.label} tooltip={field.tooltip} />}
              required={field.required}
              helperText={error || field.helperText}
              variant="outlined"
              error={!!error}
            />
          )}
          fullWidth
        />
      );

    case 'multiselect':
      const allOptionValues = options.map(opt => opt.value);
      const allSelected = value?.length === options.length;
      const selectedOptions = options.filter((opt) => (value || []).includes(opt.value));

      const handleSelectAll = () => {
        handleChange(allOptionValues);
      };

      const handleClearAll = () => {
        handleChange([]);
      };

      return (
        <Box>
          <Autocomplete
            multiple
            options={options}
            value={selectedOptions}
            onChange={(_, newValue) => {
              handleChange(newValue.map((opt) => opt.value));
            }}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            renderInput={(params) => (
              <TextField
                {...params}
                label={<LabelWithTooltip label={field.label} tooltip={field.tooltip} />}
                required={field.required}
                helperText={error || field.helperText}
                variant="outlined"
                error={!!error}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option.value}
                  label={option.label}
                  size="small"
                />
              ))
            }
            fullWidth
          />
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button
              size="small"
              onClick={handleSelectAll}
              disabled={allSelected}
              variant="outlined"
            >
              Select All
            </Button>
            <Button
              size="small"
              onClick={handleClearAll}
              disabled={!value || value.length === 0}
              variant="outlined"
            >
              Clear All
            </Button>
          </Stack>
        </Box>
      );

    case 'checkbox':
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={value || false}
              onChange={(e) => handleChange(e.target.checked)}
              name={field.name}
            />
          }
          label={<LabelWithTooltip label={field.label} tooltip={field.tooltip} />}
          sx={{ mt: 1 }}
        />
      );

    case 'radio':
      return (
        <FormControl component="fieldset" required={field.required} error={!!error}>
          <FormLabel component="legend">
            <LabelWithTooltip label={field.label} tooltip={field.tooltip} />
          </FormLabel>
          <RadioGroup
            name={field.name}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
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
          {(error || field.helperText) && (
            <FormHelperText>{error || field.helperText}</FormHelperText>
          )}
        </FormControl>
      );

    case 'pill':
      return (
        <PillField
          label={field.label}
          name={field.name}
          value={value || []}
          onChange={onChange}
          placeholder={field.placeholder}
          helperText={field.helperText}
          required={field.required}
          pillType={field.pillType}
          allowRanges={field.allowRanges}
          tooltip={field.tooltip}
          error={error}
        />
      );

    case 'group':
      return (
        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormLabel component="legend" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
              <LabelWithTooltip label={field.label} tooltip={field.tooltip} />
            </FormLabel>
          </Box>
          {field.helperText && (
            <FormHelperText sx={{ mt: -1, mb: 2 }}>{field.helperText}</FormHelperText>
          )}
          <Stack spacing={2}>
            {field.fields?.map((subField) => (
              <FieldRenderer
                key={subField.name}
                field={subField}
                value={value?.[subField.name]}
                onChange={(name, val) => {
                  const newValue = { ...(value || {}), [name]: val };
                  onChange(field.name, newValue);
                }}
                allValues={{ ...allValues, ...(value || {}) }}
                allFields={allFields}
              />
            ))}
          </Stack>
        </Box>
      );

    case 'accordion':
      return (
        <Accordion defaultExpanded={field.defaultExpanded ?? false}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              bgcolor: 'action.hover',
              '&:hover': { bgcolor: 'action.selected' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <FormLabel component="legend" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                <LabelWithTooltip label={field.label} tooltip={field.tooltip} />
              </FormLabel>
              {field.helperText && (
                <FormHelperText sx={{ ml: 'auto', fontSize: '0.75rem' }}>
                  {field.helperText}
                </FormHelperText>
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 2 }}>
            <Stack spacing={2}>
              {field.fields?.map((subField) => (
                <FieldRenderer
                  key={subField.name}
                  field={subField}
                  value={value?.[subField.name]}
                  onChange={(name, val) => {
                    const newValue = { ...(value || {}), [name]: val };
                    onChange(field.name, newValue);
                  }}
                  allValues={{ ...allValues, ...(value || {}) }}
                  allFields={allFields}
                />
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      );

    case 'modal-select':
      return (
        <ModalSelectField
          label={field.label}
          name={field.name}
          value={field.allowMultiple ? (value || []) : (value || '')}
          onChange={onChange}
          options={field.options}
          apiUrl={field.apiUrl}
          apiLabelField={field.apiLabelField}
          apiValueField={field.apiValueField}
          placeholder={field.placeholder}
          helperText={field.helperText}
          required={field.required}
          tooltip={field.tooltip}
          allowMultiple={field.allowMultiple}
          error={error}
        />
      );

    default:
      return null;
  }
};
