/**
 * Example: Edit Dialog with Fresh Data Fetching
 *
 * This demonstrates the recommended pattern for editing records:
 * 1. Fetch fresh data when dialog opens
 * 2. Show loading state while fetching
 * 3. Handle errors with retry option
 * 4. Implement optimistic locking to prevent conflicts
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Box,
  Alert,
} from '@mui/material';
import { DynamicSearch, FieldConfig } from '@/components/DynamicSearch';

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  recordId: string | number | null;
  onSave: (data: any) => void;
  fields: FieldConfig[];
}

export default function EditDialogWithFreshData({
  open,
  recordId,
  onClose,
  onSave,
  fields,
}: EditDialogProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [freshData, setFreshData] = useState<any>(null);
  const [version, setVersion] = useState<number>(0); // For optimistic locking

  /**
   * Fetch fresh data from API when dialog opens
   * This ensures we're editing the latest version of the record
   */
  const fetchFreshData = async () => {
    if (!recordId) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/products/${recordId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found. It may have been deleted.');
        }
        throw new Error('Failed to fetch product data');
      }

      const data = await response.json();

      // Store fresh data and version
      setFreshData(data);
      setVersion(data.version || 0);

    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err instanceof Error ? err.message : 'Failed to load product');
      setFreshData(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch data when dialog opens or recordId changes
   */
  useEffect(() => {
    if (open && recordId) {
      fetchFreshData();
    }

    // Reset state when dialog closes
    if (!open) {
      setFreshData(null);
      setError('');
      setVersion(0);
    }
  }, [open, recordId]);

  /**
   * Save edited data with optimistic locking
   */
  const handleSave = async (editedData: Record<string, any>) => {
    if (!recordId) return;

    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/products/${recordId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editedData,
          version, // Send current version for optimistic locking
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle version conflict (409 Conflict)
        if (response.status === 409) {
          setError(
            'This record was modified by another user. Please close and reopen to get the latest version.'
          );
          return;
        }

        throw new Error(errorData.message || `Failed to save (${response.status})`);
      }

      const updatedData = await response.json();

      // Call parent's onSave callback
      onSave(updatedData);

      // Close dialog
      onClose();

    } catch (err) {
      console.error('Error saving product:', err);
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle dialog close
   */
  const handleClose = () => {
    if (saving) return; // Prevent closing while saving
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Edit Product {freshData?.productName && `- ${freshData.productName}`}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {/* Loading State */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress />
              <Box sx={{ ml: 2 }}>Loading latest data...</Box>
            </Box>
          )}

          {/* Error State */}
          {error && !loading && (
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={fetchFreshData}>
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {/* Edit Form - Only show when data is loaded */}
          {freshData && !loading && !error && (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                Editing latest version of this record (loaded {new Date().toLocaleTimeString()})
              </Alert>

              <DynamicSearch
                key={`edit-${recordId}-${version}`} // Include version in key
                fields={fields}
                onSearch={handleSave}
                searchButtonText="Save Changes"
                resetButtonText="Cancel"
                enableSaveSearch={false}
                initialValues={freshData} // Use fresh data from API
                columnLayout={1}
                formMode="edit"
              />
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={saving} variant="outlined">
          {saving ? 'Saving...' : 'Cancel'}
        </Button>
        {saving && <CircularProgress size={24} sx={{ ml: 2 }} />}
      </DialogActions>
    </Dialog>
  );
}

/**
 * Usage in parent component:
 *
 * const [editDialogOpen, setEditDialogOpen] = useState(false);
 * const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
 *
 * const handleEditRow = (row: any) => {
 *   setSelectedRecordId(row.id); // Store ID, not full row data
 *   setEditDialogOpen(true);
 * };
 *
 * const handleSaveEdit = (updatedData: any) => {
 *   // Update grid with fresh data
 *   setGridData(prev =>
 *     prev.map(item => item.id === updatedData.id ? updatedData : item)
 *   );
 * };
 *
 * return (
 *   <>
 *     <DataGrid
 *       rows={gridData}
 *       columns={columns}
 *       onRowClick={(params) => handleEditRow(params.row)}
 *     />
 *
 *     <EditDialogWithFreshData
 *       open={editDialogOpen}
 *       recordId={selectedRecordId}
 *       onClose={() => setEditDialogOpen(false)}
 *       onSave={handleSaveEdit}
 *       fields={editFields}
 *     />
 *   </>
 * );
 */
