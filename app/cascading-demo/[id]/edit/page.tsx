'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface CodeEntry {
  id: string;
  code: string;
  status: 'saved' | 'validating' | 'valid' | 'invalid';
  message?: string;
}

interface Submission {
  id: string;
  name: string;
  description: string;
  category: string;
  subCategory: string | null;
  codes: CodeEntry[];
  referenceNumber: string;
  createdAt: string;
}

const CODE_REGEX = /^\d+(\.\d+)*( \(\d+\))?$/;
const fieldSx = { '& .MuiOutlinedInput-root fieldset': { borderColor: '#1976d2' } };

export default function EditSubmissionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Editable codes list — saved codes start with status 'saved'
  const [codes, setCodes] = useState<CodeEntry[]>([]);
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{ referenceNumber: string; updatedAt: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/mock/submissions/${id}`)
      .then((r) => r.json())
      .then((data: Submission) => {
        setSubmission(data);
        // Mark existing codes as 'saved' (already validated)
        setCodes(data.codes.map((c) => ({ ...c, status: 'saved' as const })));
      })
      .catch(() => setFetchError('Failed to load submission.'))
      .finally(() => setLoading(false));
  }, [id]);

  const hasValidating = codes.some((c) => c.status === 'validating');
  const hasAnyCode = codes.some((c) => c.status === 'saved' || c.status === 'valid');

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
      const res = await fetch(`/api/mock/submissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: submission?.name,
          description: submission?.description,
          codes: codes.filter((c) => c.status === 'saved' || c.status === 'valid').map((c) => c.code),
        }),
      });
      const data = await res.json();
      setSaveResult(data);
      // Promote 'valid' codes to 'saved'
      setCodes((prev) => prev.map((c) => c.status === 'valid' ? { ...c, status: 'saved' as const, message: undefined } : c));
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
        if (value === 'saved') return <Chip icon={<CheckCircleIcon />} label="Saved" color="primary" size="small" />;
        if (value === 'valid') return <Chip icon={<CheckCircleIcon />} label="Valid" color="success" size="small" />;
        return <Chip icon={<CancelIcon />} label="Invalid" color="error" size="small" />;
      },
    },
    {
      field: 'message',
      headerName: 'Message',
      flex: 1.5,
      renderCell: ({ value, row }) => (
        <Typography variant="caption" color="text.secondary">
          {row.status === 'saved' ? 'Previously validated' : (value ?? '—')}
        </Typography>
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

  if (loading) {
    return (
      <Container maxWidth={false} disableGutters sx={{ py: 4, px: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        <Box display="flex" justifyContent="center" pt={8}><CircularProgress /></Box>
      </Container>
    );
  }

  if (fetchError || !submission) {
    return (
      <Container maxWidth={false} disableGutters sx={{ py: 4, px: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        <Alert severity="error">{fetchError || 'Submission not found.'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} disableGutters sx={{ py: 4, px: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>

      {/* Toolbar */}
      <Paper elevation={2} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, mb: 0.75, minHeight: '64px', borderRadius: '8px', bgcolor: '#fff' }}>
        <IconButton onClick={() => router.push('/cascading-demo/list')} sx={{ color: '#212121' }}>
          <ArrowBackIcon sx={{ fontSize: '1.5rem', width: '1em', height: '1em' }} />
        </IconButton>
        <Divider orientation="vertical" sx={{ height: '36px', alignSelf: 'center' }} />
        <Button
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={saving || !hasAnyCode || hasValidating}
          sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 500 }}
        >
          Save
        </Button>
        <Divider orientation="vertical" sx={{ height: '36px', alignSelf: 'center' }} />
      </Paper>

      {/* Record Info */}
      <Paper elevation={2} sx={{ p: 2, mb: 0.75, borderRadius: '8px', bgcolor: '#fff' }}>
        <Typography variant="body2" color="text.secondary">
          Reference: <strong>{submission.referenceNumber}</strong>
          &nbsp;·&nbsp;Created: <strong>{new Date(submission.createdAt).toLocaleDateString()}</strong>
        </Typography>
      </Paper>

      {/* Form */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: '8px' }}>

        {/* General Info — read only */}
        <Typography sx={{ mb: 2, fontFamily: 'Arial, sans-serif', fontSize: '0.875rem', fontWeight: 700 }}>
          General Information
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
          <TextField label="Name" value={submission.name} size="medium" slotProps={{ inputLabel: { shrink: true } }} sx={fieldSx} disabled />
          <TextField label="Description" value={submission.description} size="medium" slotProps={{ inputLabel: { shrink: true } }} sx={fieldSx} disabled />
          <TextField
            label="Category"
            value={submission.subCategory ? `${submission.category} › ${submission.subCategory}` : submission.category}
            size="medium"
            slotProps={{ inputLabel: { shrink: true } }}
            sx={fieldSx}
            disabled
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Codes */}
        <Typography sx={{ mb: 0.5, fontFamily: 'Arial, sans-serif', fontSize: '0.875rem', fontWeight: 700 }}>
          Codes
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          Add new codes in the format <strong>X.X.X.X (Y)</strong>. Existing codes can be deleted. New codes are validated before being accepted.
        </Typography>

        <Box display="flex" gap={1} alignItems="flex-start" sx={{ mb: 2 }}>
          <TextField
            inputRef={inputRef}
            label="New Code"
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
          <Box sx={{ height: Math.min(56 + codes.length * 52, 350), mb: 3 }}>
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

        {codes.length === 0 && (
          <Alert severity="warning" sx={{ mb: 3 }}>No codes remaining. Add at least one code before saving.</Alert>
        )}

        <Divider sx={{ mb: 3 }} />

        {saveResult && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <strong>Saved successfully!</strong> Reference: <strong>{saveResult.referenceNumber}</strong>
            &nbsp;·&nbsp;{new Date(saveResult.updatedAt).toLocaleString()}
          </Alert>
        )}

        <Box display="flex" gap={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            size="large"
            onClick={() => router.push('/cascading-demo/list')}
            sx={{ textTransform: 'none', borderRadius: '6px', borderColor: '#90caf9', color: '#1976d2', bgcolor: '#fff', width: '250px', '&:hover': { borderColor: '#1976d2', bgcolor: '#f5f9ff' } }}
          >
            Back to list
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving || !hasAnyCode || hasValidating}
            sx={{ textTransform: 'none', borderRadius: '6px', bgcolor: '#1a2744', width: '250px', '&:hover': { bgcolor: '#1976d2' } }}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </Paper>

      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={toast?.severity} onClose={() => setToast(null)} sx={{ width: '100%' }}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
