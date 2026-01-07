'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
} from '@mui/material';
import { DynamicSearch, FieldConfig, SavedSearch } from '@/components/DynamicSearch';

export default function Home() {
  const [searchResults, setSearchResults] = useState<Record<string, any> | null>(null);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  // Define the search fields configuration
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

  const handleSearch = (params: Record<string, any>) => {
    console.log('Search Parameters:', params);
    setSearchResults(params);
  };

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
        </Alert>
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
      />

      {searchResults && (
        <Box mt={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Search Results
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              This is a demo. In a real application, you would fetch and display actual search
              results based on these parameters.
            </Alert>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Parameter</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Value</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(searchResults).map(([key, value]) => {
                    if (value === '' || value === false || (Array.isArray(value) && value.length === 0)) {
                      return null;
                    }

                    return (
                      <TableRow key={key}>
                        <TableCell>{key}</TableCell>
                        <TableCell>
                          {Array.isArray(value) ? (
                            <Box display="flex" gap={1} flexWrap="wrap">
                              {value.map((v) => (
                                <Chip key={v} label={v} size="small" color="primary" />
                              ))}
                            </Box>
                          ) : typeof value === 'boolean' ? (
                            <Chip label={value ? 'Yes' : 'No'} size="small" color={value ? 'success' : 'default'} />
                          ) : (
                            String(value)
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}
    </Container>
  );
}
