'use client';

import { useEffect, useState } from 'react';
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
} from '@mui/material';

interface Item {
  id: string | number;
  name: string;
  parentId?: string | number | null;
}

interface CascadingDropdownsProps {
  apiUrl?: string;
  mockData?: Item[];
  parentLabel?: string;
  childLabel?: string;
  onSelect?: (parent: Item, child: Item | null) => void;
}

export default function CascadingDropdowns({
  apiUrl,
  mockData,
  parentLabel = 'Category',
  childLabel = 'Sub-category',
  onSelect,
}: CascadingDropdownsProps) {
  const [items, setItems] = useState<Item[]>(mockData ?? []);
  const [loading, setLoading] = useState(!mockData);
  const [selectedParent, setSelectedParent] = useState<Item | null>(null);
  const [selectedChild, setSelectedChild] = useState<Item | null>(null);

  useEffect(() => {
    if (mockData) return;
    if (!apiUrl) return;
    async function fetchItems() {
      try {
        const res = await fetch(apiUrl!);
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error('Failed to fetch items:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [apiUrl, mockData]);

  const parents = items.filter((item) => !item.parentId);
  const children = selectedParent
    ? items.filter((item) => String(item.parentId) === String(selectedParent.id))
    : [];
  const hasChildren = children.length > 0;

  function handleParentChange(_: any, value: Item | null) {
    setSelectedParent(value);
    setSelectedChild(null);
    if (value) onSelect?.(value, null);
  }

  function handleChildChange(_: any, value: Item | null) {
    setSelectedChild(value);
    if (selectedParent) onSelect?.(selectedParent, value);
  }

  if (loading) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <CircularProgress size={20} />
        <span>Loading...</span>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Autocomplete
        options={parents}
        value={selectedParent}
        onChange={handleParentChange}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, val) => String(option.id) === String(val.id)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={parentLabel}
            variant="outlined"
            size="medium"
            slotProps={{ inputLabel: { shrink: true } }}
          />
        )}
        fullWidth
      />

      {selectedParent && hasChildren && (
        <Autocomplete
          options={children}
          value={selectedChild}
          onChange={handleChildChange}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, val) => String(option.id) === String(val.id)}
          renderInput={(params) => (
            <TextField
              {...params}
              label={childLabel}
              variant="outlined"
              size="medium"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          )}
          fullWidth
        />
      )}
    </Box>
  );
}
