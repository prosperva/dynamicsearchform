/**
 * Example: Using Standalone Dropdown Components
 *
 * This file demonstrates how to use SearchableDropdown and SearchableMultiSelect
 * components independently without the full DynamicSearch form.
 */

'use client';

import { useState } from 'react';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { SearchableDropdown, SearchableMultiSelect } from '@/components/DynamicSearch';

export default function StandaloneExample() {
  // Single-select dropdown state
  const [category, setCategory] = useState<string | number | null>(null);
  const [country, setCountry] = useState<string | number | null>(null);

  // Multi-select dropdown state
  const [tags, setTags] = useState<(string | number)[]>([]);
  const [shippingCountries, setShippingCountries] = useState<(string | number)[]>([]);

  // Validation errors
  const [categoryError, setCategoryError] = useState<string>('');

  const handleCategoryChange = (value: string | number | null) => {
    setCategory(value);

    // Custom validation
    if (!value) {
      setCategoryError('Category is required');
    } else {
      setCategoryError('');
    }
  };

  const handleSubmit = () => {
    // Validate
    if (!category) {
      setCategoryError('Category is required');
      return;
    }

    // Submit form data
    const formData = {
      category,
      country,
      tags,
      shippingCountries,
    };

    console.log('Form submitted:', formData);
    alert('Form submitted! Check console for data.');
  };

  const handleReset = () => {
    setCategory(null);
    setCountry(null);
    setTags([]);
    setShippingCountries([]);
    setCategoryError('');
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Standalone Dropdown Components Example
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Using SearchableDropdown and SearchableMultiSelect independently without DynamicSearch
      </Typography>

      <Grid container spacing={3}>
        {/* Single-select dropdown with validation */}
        <Grid item xs={12} md={6}>
          <SearchableDropdown
            label="Category"
            value={category}
            onChange={handleCategoryChange}
            options={[
              { label: 'Electronics', value: 'electronics' },
              { label: 'Books', value: 'books' },
              { label: 'Clothing', value: 'clothing' },
              { label: 'Home & Garden', value: 'home-garden' },
            ]}
            placeholder="Select a category..."
            helperText="Choose your product category"
            error={categoryError}
            required
          />
        </Grid>

        {/* API-driven dropdown */}
        <Grid item xs={12} md={6}>
          <SearchableDropdown
            label="Country"
            value={country}
            onChange={setCountry}
            apiUrl="/api/countries"
            placeholder="Select a country..."
            helperText="Loaded from API"
          />
        </Grid>

        {/* Multi-select with static options */}
        <Grid item xs={12} md={6}>
          <SearchableMultiSelect
            label="Tags"
            value={tags}
            onChange={setTags}
            options={[
              { label: 'New', value: 'new' },
              { label: 'Featured', value: 'featured' },
              { label: 'Sale', value: 'sale' },
              { label: 'Popular', value: 'popular' },
              { label: 'Trending', value: 'trending' },
            ]}
            placeholder="Select tags..."
            helperText="You can select multiple tags"
          />
        </Grid>

        {/* Multi-select with API */}
        <Grid item xs={12} md={6}>
          <SearchableMultiSelect
            label="Shipping Countries"
            value={shippingCountries}
            onChange={setShippingCountries}
            apiUrl="/api/countries"
            placeholder="Select countries..."
            helperText="Select one or more shipping countries"
          />
        </Grid>

        {/* Action buttons */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!category}
            >
              Submit
            </Button>
            <Button variant="outlined" onClick={handleReset}>
              Reset
            </Button>
          </Box>
        </Grid>

        {/* Display selected values */}
        {category && (
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="subtitle2" gutterBottom>
                Selected Values:
              </Typography>
              <Typography variant="body2">
                <strong>Category:</strong> {category}
              </Typography>
              {country && (
                <Typography variant="body2">
                  <strong>Country:</strong> {country}
                </Typography>
              )}
              {tags.length > 0 && (
                <Typography variant="body2">
                  <strong>Tags:</strong> {tags.join(', ')}
                </Typography>
              )}
              {shippingCountries.length > 0 && (
                <Typography variant="body2">
                  <strong>Shipping Countries:</strong> {shippingCountries.join(', ')}
                </Typography>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}
