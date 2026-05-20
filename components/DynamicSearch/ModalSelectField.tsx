'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  TextField,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  InputAdornment,
  Stack,
  Tooltip,
  IconButton,
  CircularProgress,
  Checkbox,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  HelpOutline as HelpIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DropdownOption } from './types';

export interface ModalSelectFieldProps {
  label: string;
  name: string;
  value: string | number | (string | number)[];
  onChange: (name: string, value: string | number | (string | number)[]) => void;
  options?: DropdownOption[];
  apiUrl?: string;
  apiLabelField?: string;
  apiValueField?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  tooltip?: string;
  allowMultiple?: boolean;
  error?: string;
  columns?: GridColDef[];
  // Raw data rows for grid mode — use when your options are mapped DropdownOption[] but grid needs the full original objects
  rows?: any[];
  inline?: boolean;
  displayField?: string;
  showClear?: boolean;
}

export const ModalSelectField: React.FC<ModalSelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options: staticOptions,
  apiUrl,
  apiLabelField,
  apiValueField,
  placeholder,
  helperText,
  required,
  disabled = false,
  tooltip,
  allowMultiple = false,
  error,
  columns,
  rows: effectiveRowsProp,
  inline = false,
  displayField,
  showClear = true,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [apiOptions, setApiOptions] = useState<DropdownOption[]>([]);
  const [rawRows, setRawRows] = useState<any[]>([]);
  const [gridSelection, setGridSelection] = useState<(string | number)[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // List mode pending selection (not committed until Done)
  const [pendingValue, setPendingValue] = useState<string | number | (string | number)[]>(
    allowMultiple ? [] : ''
  );

  const options = staticOptions !== undefined ? staticOptions : apiOptions;

  // Sync effectiveRows from staticOptions when no explicit rows prop and no apiUrl
  const prevStaticRef = useRef<DropdownOption[] | undefined>(undefined);
  useEffect(() => {
    if (effectiveRowsProp === undefined && staticOptions !== undefined && staticOptions !== prevStaticRef.current) {
      prevStaticRef.current = staticOptions;
      setRawRows(staticOptions);
    }
  });

  // Effective rows: prefer prop > fetched state
  const effectiveRows: any[] = effectiveRowsProp !== undefined ? effectiveRowsProp : rawRows;

  // Fetch from API once
  useEffect(() => {
    if (apiUrl && staticOptions === undefined && !hasLoadedOnce) {
      setLoading(true);
      fetch(apiUrl, { credentials: 'include' })
        .then(r => r.json())
        .then(responseData => {
          const data = Array.isArray(responseData) ? responseData : (responseData.data || responseData);
          if (!Array.isArray(data)) return;
          const labelField = apiLabelField || 'label';
          const valueField = apiValueField || 'value';
          const mapped: DropdownOption[] = data.map((item: any) => ({ label: item[labelField], value: item[valueField] }));
          setApiOptions(mapped);
          setRawRows(data);
          setHasLoadedOnce(true);
        })
        .catch(err => console.error(`Error fetching options for ${name}:`, err))
        .finally(() => setLoading(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl, hasLoadedOnce]);

  const displayText = useMemo(() => {
    const getDisplay = (v: string | number) => {
      if (displayField) {
        const row = effectiveRows.find((r: any) => r[apiValueField || 'value'] === v);
        return row ? String(row[displayField] ?? '') : String(v);
      }
      return options.find(opt => opt.value === v)?.label ?? String(v);
    };
    if (allowMultiple && Array.isArray(value)) {
      return value.length === 0 ? '' : value.map(getDisplay).join(', ');
    }
    if (value === '' || value === null || value === undefined) return '';
    return getDisplay(value as string | number);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, options, effectiveRows, displayField, apiValueField, allowMultiple]);

  const filteredOptions = useMemo(() => {
    const selectable = options.filter(opt => opt.value !== undefined);
    if (!filterText.trim()) return selectable;
    const lower = filterText.toLowerCase();
    return selectable.filter(opt => opt.label.toLowerCase().includes(lower));
  }, [filterText, options]);

  const handleOpenModal = () => {
    setFilterText('');
    setGridSelection([]);
    setPendingValue(allowMultiple ? (Array.isArray(value) ? value : []) : (value || ''));
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFilterText('');
    setGridSelection([]);
  };

  const handleClear = () => onChange(name, allowMultiple ? [] : '');

  const handleSelectOption = (optionValue: string | number) => {
    if (allowMultiple) {
      setPendingValue(prev => {
        const cur = Array.isArray(prev) ? prev : [];
        return cur.includes(optionValue) ? cur.filter(v => v !== optionValue) : [...cur, optionValue];
      });
    } else {
      setPendingValue(optionValue);
    }
  };

  const isSelected = (optionValue: string | number) => {
    if (allowMultiple && Array.isArray(pendingValue)) return pendingValue.includes(optionValue);
    return pendingValue === optionValue;
  };

  const labelWithTooltip = tooltip ? (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      {label}
      <Tooltip title={tooltip} arrow placement="top" enterDelay={200} leaveDelay={200}>
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', ml: 0.5, cursor: 'help', color: 'action.active' }}>
          <HelpIcon fontSize="small" sx={{ fontSize: '1rem' }} />
        </Box>
      </Tooltip>
    </Box>
  ) : label;

  const hasValue = allowMultiple ? (Array.isArray(value) && value.length > 0) : !!value;

  const buttons = (
    <Stack direction="row" spacing={0.5} sx={inline ? {} : { mt: 0.5 }}>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleOpenModal}
        size="small"
        disabled={disabled}
        sx={inline ? { whiteSpace: 'nowrap', height: '40px' } : {}}
      >
        Select
      </Button>
      {showClear && hasValue && (
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClear}
          size="small"
          startIcon={<ClearIcon />}
          disabled={disabled}
          sx={inline ? { whiteSpace: 'nowrap', height: '40px' } : {}}
        >
          Clear
        </Button>
      )}
    </Stack>
  );

  const textField = (
    <TextField
      fullWidth
      size="small"
      label={labelWithTooltip}
      value={displayText}
      placeholder={placeholder || 'Click Select to choose...'}
      helperText={error || helperText}
      required={required}
      variant="outlined"
      disabled={disabled}
      error={!!error}
      slotProps={{ input: { readOnly: true } }}
    />
  );

  return (
    <Box>
      {inline ? (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          {textField}
          {buttons}
        </Box>
      ) : (
        <>{textField}{buttons}</>
      )}

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth={columns ? 'md' : 'sm'}
        fullWidth
        slotProps={{ paper: { sx: { height: '65vh' } } }}
      >
        <DialogTitle>{label}</DialogTitle>
        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 1.5, pb: 1, position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Filter options..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              autoFocus
              disabled={loading}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                  endAdornment: filterText && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setFilterText('')}><ClearIcon fontSize="small" /></IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          {columns ? (
            <Box sx={{ flex: 1, px: 1.5, pb: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                  <CircularProgress size={40} />
                </Box>
              ) : (
                <Box sx={{ flex: 1, minHeight: 0 }}>
                  <DataGrid
                    rows={effectiveRows.filter((row: any) => {
                      if (!filterText.trim()) return true;
                      const search = filterText.toLowerCase();
                      return Object.values(row).some(v => String(v ?? '').toLowerCase().includes(search));
                    })}
                    columns={columns}
                    getRowId={(row) => row[apiValueField || 'value'] ?? row['id'] ?? row['label']}
                    onRowClick={({ id }) => {
                      if (allowMultiple) {
                        setGridSelection(prev =>
                          prev.some(s => String(s) === String(id))
                            ? prev.filter(x => String(x) !== String(id))
                            : [...prev, id as string | number]
                        );
                      } else {
                        setGridSelection([id as string | number]);
                      }
                    }}
                    pageSizeOptions={[25, 50, 100]}
                    initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
                    density="compact"
                    hideFooterSelectedRowCount
                    sx={{
                      border: 'none',
                      height: '100%',
                      '& .MuiDataGrid-row': { cursor: 'pointer' },
                      '& .MuiDataGrid-row.row-selected': { bgcolor: 'primary.light' },
                      '& .MuiDataGrid-row.row-selected:hover': { bgcolor: 'primary.light' },
                    }}
                    getRowClassName={({ id }) => gridSelection.some(s => String(s) === String(id)) ? 'row-selected' : ''}
                    disableRowSelectionOnClick
                  />
                </Box>
              )}
              <Box sx={{ px: 0, py: 1, display: 'flex', gap: 1, borderTop: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={gridSelection.length === 0}
                  onClick={() => {
                    onChange(name, allowMultiple ? gridSelection : gridSelection[0]);
                    handleCloseModal();
                  }}
                >
                  Select
                </Button>
                <Button fullWidth onClick={handleCloseModal}>Cancel</Button>
              </Box>
            </Box>
          ) : (
            <List sx={{ pt: 0, flex: 1, overflow: 'auto' }}>
              {loading ? (
                <ListItem>
                  <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 4 }}>
                    <CircularProgress size={40} />
                  </Box>
                </ListItem>
              ) : filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <ListItem key={option.value} disablePadding>
                    <ListItemButton selected={isSelected(option.value!)} onClick={() => handleSelectOption(option.value!)}>
                      {allowMultiple && (
                        <Checkbox edge="start" checked={isSelected(option.value!)} tabIndex={-1} disableRipple sx={{ mr: 1 }} />
                      )}
                      <ListItemText primary={option.label} />
                    </ListItemButton>
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No options found" secondary="Try adjusting your filter" sx={{ textAlign: 'center', color: 'text.secondary' }} />
                </ListItem>
              )}
            </List>
          )}
        </DialogContent>

        {!columns && (
          <DialogActions sx={{ flexDirection: 'column', gap: 1, p: 2 }}>
            <Button
              onClick={() => { onChange(name, pendingValue); handleCloseModal(); }}
              variant="contained"
              fullWidth
              disabled={loading || (allowMultiple ? (Array.isArray(pendingValue) && pendingValue.length === 0) : !pendingValue)}
            >
              Done
            </Button>
            <Button onClick={handleCloseModal} fullWidth>Cancel</Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
};
