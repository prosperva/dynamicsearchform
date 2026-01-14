'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  SxProps,
  Theme,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { DynamicSearch, FieldConfig, SavedSearch } from '@/components/DynamicSearch';

// Helper function to get dialog positioning styles
const getDialogStyles = (position: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'): SxProps<Theme> => {
  const positions = {
    center: { '& .MuiDialog-container': { alignItems: 'center', justifyContent: 'center' } },
    top: { '& .MuiDialog-container': { alignItems: 'flex-start', justifyContent: 'center', pt: 4 } },
    bottom: { '& .MuiDialog-container': { alignItems: 'flex-end', justifyContent: 'center', pb: 4 } },
    left: { '& .MuiDialog-container': { alignItems: 'center', justifyContent: 'flex-start', pl: 4 } },
    right: { '& .MuiDialog-container': { alignItems: 'center', justifyContent: 'flex-end', pr: 4 } },
    'top-left': { '& .MuiDialog-container': { alignItems: 'flex-start', justifyContent: 'flex-start', pt: 4, pl: 4 } },
    'top-right': { '& .MuiDialog-container': { alignItems: 'flex-start', justifyContent: 'flex-end', pt: 4, pr: 4 } },
    'bottom-left': { '& .MuiDialog-container': { alignItems: 'flex-end', justifyContent: 'flex-start', pb: 4, pl: 4 } },
    'bottom-right': { '& .MuiDialog-container': { alignItems: 'flex-end', justifyContent: 'flex-end', pb: 4, pr: 4 } },
  };
  return positions[position];
};

// Mock data for demonstration
const mockProducts = [
  { id: 1, productName: 'Wireless Mouse', category: 'electronics', condition: 'new', inStock: true, price: 25, country: 'us' },
  { id: 2, productName: 'Gaming Keyboard', category: 'electronics', condition: 'new', inStock: true, price: 89, country: 'ca' },
  { id: 3, productName: 'Office Chair', category: 'home-garden', condition: 'refurbished', inStock: false, price: 199, country: 'uk' },
  { id: 4, productName: 'Standing Desk', category: 'home-garden', condition: 'new', inStock: true, price: 450, country: 'us' },
  { id: 5, productName: 'USB-C Cable', category: 'electronics', condition: 'new', inStock: true, price: 12, country: 'cn' },
];

export default function Home() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [gridData, setGridData] = useState(mockProducts);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [modalPosition, setModalPosition] = useState<'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('center');

  // Define the search fields configuration (all optional for searching)
  // Note: Pill fields are placed at the end to prevent layout shifts when expanded
  const searchFields: FieldConfig[] = [
    {
      name: 'productName',
      label: 'Product Name',
      type: 'text',
      placeholder: 'Enter product name...',
      helperText: 'Search by product name',
      tooltip: 'Enter the name or partial name of the product you are looking for',
    },
    {
      name: 'category',
      label: 'Category',
      type: 'dropdown',
      apiUrl: '/api/categories',
      helperText: 'Select a category (loaded from API)',
    },
    {
      name: 'inStock',
      label: 'In Stock Only',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'condition',
      label: 'Condition',
      type: 'radio',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Used', value: 'used' },
        { label: 'Refurbished', value: 'refurbished' },
      ],
      helperText: 'Product condition',
    },
    {
      name: 'shippingFrom',
      label: 'Ships From',
      type: 'multiselect',
      apiUrl: '/api/countries',
      helperText: 'Select one or more countries',
      defaultValue: [],
      tooltip: 'Filter products that ship from specific countries. You can select multiple countries.',
    },
    {
      name: 'price',
      label: 'Price',
      type: 'number',
      placeholder: 'Enter price...',
      helperText: 'Product price in USD',
    },
    {
      name: 'dateAdded',
      label: 'Date Added After',
      type: 'date',
      helperText: 'Products added after this date',
    },
    {
      name: 'brand',
      label: 'Brand',
      type: 'dropdown',
      options: [
        { label: 'Apple', value: 'apple' },
        { label: 'Samsung', value: 'samsung' },
        { label: 'Sony', value: 'sony' },
        { label: 'LG', value: 'lg' },
        { label: 'Dell', value: 'dell' },
        { label: 'HP', value: 'hp' },
      ],
      helperText: 'Select brand (static options)',
    },
    {
      name: 'freeShipping',
      label: 'Free Shipping',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'rating',
      label: 'Minimum Rating',
      type: 'dropdown',
      options: [
        { label: '5 Stars', value: '5' },
        { label: '4 Stars & Up', value: '4' },
        { label: '3 Stars & Up', value: '3' },
        { label: '2 Stars & Up', value: '2' },
        { label: '1 Star & Up', value: '1' },
      ],
    },
    {
      name: 'city',
      label: 'City',
      type: 'dropdown',
      apiUrl: '/api/cities',
      apiLabelField: 'name', // API uses 'name' instead of 'label'
      apiValueField: 'id',   // API uses 'id' instead of 'value'
      helperText: 'Select a city (uses custom field mapping)',
      tooltip: 'This dropdown demonstrates custom API field mapping - the API returns {id, name} instead of {value, label}',
    },
    {
      name: 'country',
      label: 'Country (Modal Single Select)',
      type: 'modal-select',
      options: [
        { label: 'United States', value: 'us' },
        { label: 'Canada', value: 'ca' },
        { label: 'United Kingdom', value: 'uk' },
        { label: 'Germany', value: 'de' },
        { label: 'France', value: 'fr' },
        { label: 'Japan', value: 'jp' },
        { label: 'Australia', value: 'au' },
        { label: 'Brazil', value: 'br' },
        { label: 'India', value: 'in' },
        { label: 'China', value: 'cn' },
        { label: 'Mexico', value: 'mx' },
        { label: 'Spain', value: 'es' },
        { label: 'Italy', value: 'it' },
        { label: 'South Korea', value: 'kr' },
        { label: 'Netherlands', value: 'nl' },
      ],
      helperText: 'Single selection with modal dialog',
      tooltip: 'Opens a modal with searchable list for single selection',
    },
    {
      name: 'languages',
      label: 'Languages (Modal Multi-Select)',
      type: 'modal-select',
      allowMultiple: true,
      options: [
        { label: 'English', value: 'en' },
        { label: 'Spanish', value: 'es' },
        { label: 'French', value: 'fr' },
        { label: 'German', value: 'de' },
        { label: 'Chinese', value: 'zh' },
        { label: 'Japanese', value: 'ja' },
        { label: 'Korean', value: 'ko' },
        { label: 'Arabic', value: 'ar' },
        { label: 'Portuguese', value: 'pt' },
        { label: 'Russian', value: 'ru' },
        { label: 'Italian', value: 'it' },
        { label: 'Dutch', value: 'nl' },
      ],
      defaultValue: [],
      helperText: 'Select multiple languages using checkboxes',
      tooltip: 'Multi-select mode with checkboxes in modal dialog',
    },
    {
      name: 'farmInfo',
      label: 'Farm Information',
      type: 'group',
      helperText: 'Multiple fields grouped under one label',
      tooltip: 'This group demonstrates how to organize related fields together while keeping them as separate API parameters',
      fields: [
        {
          name: 'farmName',
          label: 'Farm Name',
          type: 'text',
          placeholder: 'Enter farm name...',
        },
        {
          name: 'animalType',
          label: 'Animal Type',
          type: 'dropdown',
          options: [
            { label: 'Cattle', value: 'cattle' },
            { label: 'Sheep', value: 'sheep' },
            { label: 'Pigs', value: 'pigs' },
            { label: 'Chickens', value: 'chickens' },
            { label: 'Goats', value: 'goats' },
          ],
        },
      ],
    },
    // Pill fields at the end to prevent layout shifts when they expand
    {
      name: 'specificPrices',
      label: 'Specific Prices',
      type: 'pill',
      pillType: 'number',
      allowRanges: true,
      placeholder: 'Enter prices or ranges (e.g., 100-150, 178, 190)',
      helperText: 'Add individual prices or ranges. Press Enter to add each value.',
      defaultValue: [],
      tooltip: 'You can enter individual prices (e.g., 99, 149) or ranges (e.g., 100-150) which will be expanded to include all values in between',
    },
    {
      name: 'keywords',
      label: 'Keywords',
      type: 'pill',
      pillType: 'text',
      allowRanges: false,
      placeholder: 'Enter keywords and press Enter',
      helperText: 'Add keywords one by one or comma-separated',
      defaultValue: [],
    },
    {
      name: 'productIds',
      label: 'Product IDs',
      type: 'pill',
      pillType: 'number',
      allowRanges: true,
      placeholder: 'Enter product IDs (e.g., 1-5, 10, 15-20)',
      helperText: 'Support ranges like 1-5 which expands to 1,2,3,4,5',
      defaultValue: [],
    },
  ];

  // Define edit fields configuration (with required validation)
  const editFields: FieldConfig[] = searchFields.map((field) => {
    // Make key fields required for editing
    if (['productName', 'category', 'condition', 'price'].includes(field.name)) {
      return { ...field, required: true };
    }
    return field;
  });

  const handleSearch = (params: Record<string, any>) => {
    console.log('Search Parameters:', params);
    // In a real app, you would filter gridData based on search params
    // For demo purposes, just log the search parameters
  };

  const handleRowClick = (params: GridRowParams) => {
    setSelectedRow(params.row);
    setEditDialogOpen(true);
  };

  const handleEditSave = (editedData: Record<string, any>) => {
    console.log('Saving edited data:', editedData);
    // Update the grid data
    setGridData((prev) =>
      prev.map((item) => (item.id === selectedRow.id ? { ...item, ...editedData } : item))
    );
    setEditDialogOpen(false);
    setSelectedRow(null);
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setSelectedRow(null);
  };

  // Define columns for the data grid
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'productName', headerName: 'Product Name', width: 200 },
    { field: 'category', headerName: 'Category', width: 130 },
    { field: 'condition', headerName: 'Condition', width: 130 },
    { field: 'inStock', headerName: 'In Stock', width: 100, type: 'boolean' },
    { field: 'price', headerName: 'Price ($)', width: 100, type: 'number' },
    { field: 'country', headerName: 'Country', width: 100 },
  ];

  const handleSaveSearch = (search: SavedSearch) => {
    setSavedSearches((prev) => [...prev, search]);
    console.log('Saved Search:', search);
  };

  const handleLoadSearch = (searchId: string) => {
    const loaded = savedSearches.find((s) => s.id === searchId);
    console.log('Loaded Search:', loaded);
  };

  const handleDeleteSearch = (searchId: string) => {
    setSavedSearches((prev) => prev.filter((s) => s.id !== searchId));
    console.log('Deleted Search ID:', searchId);
  };

  const handleRenameSearch = (searchId: string, newName: string) => {
    setSavedSearches((prev) =>
      prev.map((s) => (s.id === searchId ? { ...s, name: newName } : s))
    );
    console.log('Renamed Search ID:', searchId, 'to:', newName);
  };

  const handleChangeVisibility = (searchId: string, visibility: 'user' | 'global') => {
    setSavedSearches((prev) =>
      prev.map((s) => (s.id === searchId ? { ...s, visibility } : s))
    );
    console.log('Changed Search ID:', searchId, 'visibility to:', visibility);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Dynamic Search Component Demo
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          A flexible, reusable search component with support for multiple field types, API-driven
          dropdowns, pill-based inputs with range support, and enhanced saved search functionality
          with preview and user/global visibility options.
        </Typography>
        <Alert severity="info" sx={{ mt: 2 }}>
          <strong>New Features:</strong> Try the textarea-based pill fields (Specific Prices, Keywords, Product IDs)
          with comma-separated values and range support like &quot;100-150&quot;. Saved searches appear in a searchable dropdown -
          select to preview, use edit/delete icons for your searches. The layout uses auto-mode
          (adjusts columns based on field count), or override with <code>columnLayout</code> prop!
          You can now also configure modal positioning - try different positions below and open any dialog to see it in action!
        </Alert>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
            Modal Position Control (for dialogs)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
            {(['center', 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((pos) => (
              <Button
                key={pos}
                size="small"
                variant={modalPosition === pos ? 'contained' : 'outlined'}
                onClick={() => setModalPosition(pos)}
              >
                {pos}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>

      <DynamicSearch
        fields={searchFields}
        onSearch={handleSearch}
        onSave={handleSaveSearch}
        onLoad={handleLoadSearch}
        onDelete={handleDeleteSearch}
        onRename={handleRenameSearch}
        onChangeVisibility={handleChangeVisibility}
        savedSearches={savedSearches}
        enableSaveSearch={true}
        currentUser="demo_user"
        searchContext="products"
        allowCrossContext={false}
        isAdmin={false}
        columnLayout={4}
        modalPosition={modalPosition}
      />

      {/* Data Grid */}
      <Box mt={4}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Products Grid
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Click on any row to edit the product details. The DynamicSearch component is used for both searching and editing!
          </Alert>

          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={gridData}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              onRowClick={handleRowClick}
              sx={{ cursor: 'pointer' }}
            />
          </div>
        </Paper>
      </Box>

      {/* Edit Modal */}
      <Dialog open={editDialogOpen} onClose={handleEditCancel} maxWidth="lg" fullWidth sx={getDialogStyles(modalPosition)}>
        <DialogTitle>Edit Product - {selectedRow?.productName}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {selectedRow && (
              <DynamicSearch
                key={selectedRow.id} // Force re-mount when editing different rows
                fields={editFields}
                onSearch={handleEditSave}
                searchButtonText="Save Changes"
                resetButtonText="Cancel"
                enableSaveSearch={false}
                initialValues={selectedRow}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
