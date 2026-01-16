/**
 * Example: Using StandalonePillField Component
 *
 * This file demonstrates how to use the StandalonePillField component
 * for multi-value input with chip display.
 */

'use client';

import { useState } from 'react';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { StandalonePillField } from '@/components/DynamicSearch';

export default function StandalonePillFieldExample() {
  // Text pills
  const [tags, setTags] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>(['react', 'typescript', 'nextjs']);

  // Number pills
  const [productIds, setProductIds] = useState<string[]>([]);
  const [skuNumbers, setSkuNumbers] = useState<string[]>([]);

  // Validation
  const [tagsError, setTagsError] = useState<string>('');

  const handleTagsChange = (values: string[]) => {
    setTags(values);

    // Custom validation
    if (values.length < 1) {
      setTagsError('At least one tag is required');
    } else {
      setTagsError('');
    }
  };

  const handleSubmit = () => {
    // Validate
    if (tags.length < 1) {
      setTagsError('At least one tag is required');
      return;
    }

    // Get all values
    const formData = {
      tags,
      keywords,
      productIds,
      skuNumbers,
    };

    console.log('Form submitted:', formData);
    alert('Form submitted! Check console for data.');
  };

  const handleReset = () => {
    setTags([]);
    setKeywords([]);
    setProductIds([]);
    setSkuNumbers([]);
    setTagsError('');
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 1000, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Standalone PillField Component Example
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Multi-value input field with chip display, range expansion, and more
      </Typography>

      <Grid container spacing={3}>
        {/* Text mode - basic */}
        <Grid item xs={12} md={6}>
          <StandalonePillField
            label="Tags"
            value={tags}
            onChange={handleTagsChange}
            pillType="text"
            placeholder="Enter tags separated by commas (e.g., react, typescript)"
            helperText="Enter comma-separated tags and press Enter"
            error={tagsError}
            required
          />
        </Grid>

        {/* Text mode - with default values */}
        <Grid item xs={12} md={6}>
          <StandalonePillField
            label="Keywords"
            value={keywords}
            onChange={setKeywords}
            pillType="text"
            tooltip="Keywords help improve search results"
            helperText="Manage your keywords"
          />
        </Grid>

        {/* Number mode - without ranges */}
        <Grid item xs={12} md={6}>
          <StandalonePillField
            label="Product IDs"
            value={productIds}
            onChange={setProductIds}
            pillType="number"
            placeholder="Enter product IDs (e.g., 100, 200, 300)"
            helperText="Only numeric values allowed"
          />
        </Grid>

        {/* Number mode - WITH ranges */}
        <Grid item xs={12} md={6}>
          <StandalonePillField
            label="SKU Numbers"
            value={skuNumbers}
            onChange={setSkuNumbers}
            pillType="number"
            allowRanges={true}
            placeholder="Enter SKUs or ranges (e.g., 100-105, 200)"
            helperText="Use ranges like 100-105 to expand. Press Enter to expand."
            tooltip="Ranges will be expanded into individual numbers"
          />
        </Grid>

        {/* Action buttons */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={tags.length < 1}
            >
              Submit
            </Button>
            <Button variant="outlined" onClick={handleReset}>
              Reset
            </Button>
          </Box>
        </Grid>

        {/* Display current values */}
        {(tags.length > 0 || keywords.length > 0 || productIds.length > 0 || skuNumbers.length > 0) && (
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="subtitle2" gutterBottom>
                Current Values:
              </Typography>

              {tags.length > 0 && (
                <Typography variant="body2">
                  <strong>Tags ({tags.length}):</strong> {tags.join(', ')}
                </Typography>
              )}

              {keywords.length > 0 && (
                <Typography variant="body2">
                  <strong>Keywords ({keywords.length}):</strong> {keywords.join(', ')}
                </Typography>
              )}

              {productIds.length > 0 && (
                <Typography variant="body2">
                  <strong>Product IDs ({productIds.length}):</strong> {productIds.join(', ')}
                </Typography>
              )}

              {skuNumbers.length > 0 && (
                <Typography variant="body2">
                  <strong>SKU Numbers ({skuNumbers.length}):</strong> {skuNumbers.join(', ')}
                </Typography>
              )}
            </Paper>
          </Grid>
        )}

        {/* Usage tips */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'info.lighter' }}>
            <Typography variant="subtitle2" gutterBottom>
              Tips:
            </Typography>
            <Typography variant="body2" component="div">
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                <li>Type values separated by commas</li>
                <li>Press <strong>Enter</strong> to confirm (especially for range expansion)</li>
                <li>Click the × on any chip to remove it</li>
                <li>Use <strong>Clear All</strong> to remove all values</li>
                <li>For number mode with ranges: Use format like "1-5, 10, 15-20"</li>
                <li>Large lists automatically collapse after 20 items</li>
              </ul>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
}
