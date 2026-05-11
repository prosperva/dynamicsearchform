'use client';

import { useState, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Chip,
  Alert,
  Divider,
  CircularProgress,
  IconButton,
  Snackbar,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Verified as VerifiedIcon,
  SearchOff as SearchOffIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CascadingDropdowns from '@/components/CascadingDropdowns/CascadingDropdowns';

interface Item {
  id: string | number;
  name: string;
  parentId?: string | number | null;
}

interface CodeEntry {
  id: string;
  code: string;
  status: 'validating' | 'valid' | 'invalid';
  message?: string;
}

const FAKE_CATEGORIES: Item[] = [
  { id: 1, name: 'Electronics', parentId: null },
  { id: 2, name: 'Clothing', parentId: null },
  { id: 3, name: 'Home & Garden', parentId: null },
  { id: 4, name: 'Sports', parentId: null },
  { id: 10, name: 'Laptops', parentId: 1 },
  { id: 11, name: 'Smartphones', parentId: 1 },
  { id: 12, name: 'Tablets', parentId: 1 },
  { id: 13, name: 'Accessories', parentId: 1 },
  { id: 20, name: "Men's", parentId: 2 },
  { id: 21, name: "Women's", parentId: 2 },
  { id: 22, name: "Kids'", parentId: 2 },
  { id: 30, name: 'Furniture', parentId: 3 },
  { id: 31, name: 'Kitchen', parentId: 3 },
  { id: 32, name: 'Garden Tools', parentId: 3 },
  { id: 40, name: 'Outdoor', parentId: 4 },
  { id: 41, name: 'Fitness', parentId: 4 },
  { id: 42, name: 'Team Sports', parentId: 4 },
];

const CODE_REGEX = /^\d+(\.\d+)*( \(\d+\))?$/;

const fieldSx = { '& .MuiOutlinedInput-root fieldset': { borderColor: '#1976d2' } };

export default function CascadingDemoPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<{ parent: Item; child: Item | null } | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codes, setCodes] = useState<CodeEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{ referenceNumber: string; submittedAt: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasValidating = codes.some((c) => c.status === 'validating');

  function validateFormat(code: string): string {
    if (!code.trim()) return 'Please enter a code.';
    if (!CODE_REGEX.test(code.trim())) return 'Format must be X.X.X.X or X.X.X.X (Y) — e.g. 3.2.4.5 or 3.2.4.5 (0)';
    if (codes.some((c) => c.code === code.trim())) return 'This code has already been added.';
    return '';
  }

  async function handleAddCode() {
    const trimmed = codeInput.trim();
    const err = validateFormat(trimmed);
    if (err) { setCodeError(err); return; }
    setCodeError('');

    const entry: CodeEntry = { id: crypto.randomUUID(), code: trimmed, status: 'validating' };
    setCodes((prev) => [...prev, entry]);
    setCodeInput('');
    inputRef.current?.focus();

    try {
      const res = await fetch('/api/mock/validate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed }),
      });
      const data = await res.json();
      setCodes((prev) =>
        prev.map((c) => c.id === entry.id ? { ...c, status: data.valid ? 'valid' : 'invalid', message: data.message } : c)
      );
    } catch {
      setCodes((prev) =>
        prev.map((c) => c.id === entry.id ? { ...c, status: 'invalid', message: 'Validation request failed.' } : c)
      );
    }
  }

  function handleRemoveCode(id: string) {
    setCodes((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleSave() {
    setSaving(true);
    setSaveResult(null);
    try {
      const res = await fetch('/api/mock/save-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          category: category?.parent?.name,
          subCategory: category?.child?.name ?? null,
          codes: codes.filter((c) => c.status === 'valid').map((c) => c.code),
        }),
      });
      const data = await res.json();
      setSaveResult(data);
      setToast({ message: `Saved! Reference: ${data.referenceNumber}`, severity: 'success' });
    } catch {
      setToast({ message: 'Failed to save. Please try again.', severity: 'error' });
    } finally {
      setSaving(false);
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'code',
      headerName: 'Code',
      flex: 1,
      renderCell: ({ value }) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{value}</Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 160,
      renderCell: ({ value }) => {
        if (value === 'validating') {
          return (
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={14} />
              <Typography variant="caption" color="text.secondary">Validating...</Typography>
            </Box>
          );
        }
        if (value === 'valid') return <Chip icon={<CheckCircleIcon />} label="Valid" color="success" size="small" />;
        return <Chip icon={<CancelIcon />} label="Invalid" color="error" size="small" />;
      },
    },
    {
      field: 'message',
      headerName: 'Message',
      flex: 1.5,
      renderCell: ({ value }) => (
        <Typography variant="caption" color="text.secondary">{value ?? '—'}</Typography>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      renderCell: ({ row }) => (
        <IconButton size="small" onClick={() => handleRemoveCode(row.id)} disabled={row.status === 'validating'}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <Container maxWidth={false} disableGutters sx={{ py: 4, px: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography sx={{ mb: 2, fontFamily: 'Arial, sans-serif', fontSize: '1.5rem', lineHeight: 1.334, fontWeight: 400 }}>
        New Submission
      </Typography>

      <Paper elevation={2} sx={{ p: 3, borderRadius: '8px' }}>

        {/* General Information */}
        <Typography sx={{ mb: 2, fontFamily: 'Arial, sans-serif', fontSize: '0.875rem', fontWeight: 700 }}>
          General Information
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 3 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            size="medium"
            slotProps={{ inputLabel: { shrink: true } }}
            sx={fieldSx}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            size="medium"
            slotProps={{ inputLabel: { shrink: true } }}
            sx={fieldSx}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Category */}
        <Typography sx={{ mb: 2, fontFamily: 'Arial, sans-serif', fontSize: '0.875rem', fontWeight: 700 }}>
          Category
        </Typography>
        <Box sx={{ maxWidth: 500, mb: 3 }}>
          <CascadingDropdowns
            mockData={FAKE_CATEGORIES}
            parentLabel="Category"
            childLabel="Sub-category"
            onSelect={(parent, child) => setCategory({ parent, child })}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Codes */}
        <Typography sx={{ mb: 0.5, fontFamily: 'Arial, sans-serif', fontSize: '0.875rem', fontWeight: 700 }}>
          Codes
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          Enter codes in the format <strong>X.X.X.X (Y)</strong> — e.g. <code>3.2.4.5 (0)</code>. Each code will be validated before being added.
        </Typography>

        <Box display="flex" gap={1} alignItems="flex-start" sx={{ mb: 2 }}>
          <TextField
            inputRef={inputRef}
            label="Code"
            placeholder="e.g. 3.2.4.5 (0)"
            value={codeInput}
            onChange={(e) => { setCodeInput(e.target.value); setCodeError(''); }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAddCode(); }}
            error={!!codeError}
            helperText={codeError || 'Press Enter or click Validate & Add'}
            size="medium"
            sx={{ width: 300, ...fieldSx }}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Button
            variant="contained"
            onClick={handleAddCode}
            size="large"
            startIcon={<VerifiedIcon />}
            sx={{ height: '56px', textTransform: 'none', borderRadius: '6px', bgcolor: '#1a2744', '&:hover': { bgcolor: '#1976d2' } }}
          >
            Validate & Add
          </Button>
        </Box>

        {codes.length > 0 && (
          <Box sx={{ height: Math.min(56 + codes.length * 52, 300), mb: 3 }}>
            <DataGrid
              rows={codes}
              columns={columns}
              hideFooter
              disableColumnMenu
              disableRowSelectionOnClick
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': { bgcolor: '#f5f5f5' },
                '& .MuiDataGrid-columnHeader': { bgcolor: '#f5f5f5' },
                '& .MuiDataGrid-cell': { borderBottom: '1px solid #f0f0f0' },
              }}
            />
          </Box>
        )}

        <Divider sx={{ mb: 3 }} />

        {/* Save */}
        {saveResult && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <strong>Saved successfully!</strong> Reference: <strong>{saveResult.referenceNumber}</strong> &nbsp;·&nbsp;
            {new Date(saveResult.submittedAt).toLocaleString()}
          </Alert>
        )}
        <Box display="flex" gap={2} justifyContent="flex-start">
          <Button
            variant="outlined"
            size="large"
            startIcon={<SearchOffIcon />}
            onClick={() => { setName(''); setDescription(''); setCategory(null); setCodes([]); setSaveResult(null); }}
            sx={{ textTransform: 'none', borderRadius: '6px', borderColor: '#90caf9', color: '#1976d2', bgcolor: '#fff', width: '250px', '&:hover': { borderColor: '#1976d2', bgcolor: '#f5f9ff' } }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving || !name || hasValidating}
            sx={{ textTransform: 'none', borderRadius: '6px', bgcolor: '#1a2744', width: '250px', '&:hover': { bgcolor: '#1976d2' } }}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </Box>
        {!name && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'left' }}>
            A name is required to save.
          </Typography>
        )}
      </Paper>

      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={toast?.severity} onClose={() => setToast(null)} sx={{ width: '100%' }}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
