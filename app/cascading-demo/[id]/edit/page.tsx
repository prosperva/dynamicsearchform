'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Divider,
  CircularProgress,
  IconButton,
  Snackbar,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import CodesSection, { CodeEntry } from '@/components/CodesSection/CodesSection';

interface Submission {
  id: string;
  name: string;
  description: string;
  category: string;
  subCategory: string | null;
  codes: { id: string; code: string; status: string }[];
  referenceNumber: string;
  createdAt: string;
}

const fieldSx = { '& .MuiOutlinedInput-root fieldset': { borderColor: '#1976d2' } };

export default function EditSubmissionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [codes, setCodes] = useState<CodeEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{ referenceNumber: string; updatedAt: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetch(`/api/mock/submissions/${id}`)
      .then((r) => r.json())
      .then((data: Submission) => {
        setSubmission(data);
        setCodes(data.codes.map((c) => ({ ...c, status: 'saved' as const })));
      })
      .catch(() => setFetchError('Failed to load submission.'))
      .finally(() => setLoading(false));
  }, [id]);

  const hasValidating = codes.some((c) => c.status === 'validating');
  const hasAnyCode = codes.some((c) => c.status === 'saved' || c.status === 'valid');

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
      setCodes((prev) => prev.map((c) => c.status === 'valid' ? { ...c, status: 'saved' as const, message: undefined } : c));
      setToast({ message: `Saved! Reference: ${data.referenceNumber}`, severity: 'success' });
    } catch {
      setToast({ message: 'Failed to save. Please try again.', severity: 'error' });
    } finally {
      setSaving(false);
    }
  }

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
          Add new codes in the format <strong>X.X.X.X</strong> or <strong>X.X.X.X (Y)</strong>. Existing codes can be deleted.
        </Typography>
        <CodesSection codes={codes} onChange={setCodes} />

        {codes.length === 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>No codes remaining. Add at least one code before saving.</Alert>
        )}

        <Divider sx={{ mt: 3, mb: 3 }} />

        {saveResult && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <strong>Saved!</strong> Reference: <strong>{saveResult.referenceNumber}</strong>
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
