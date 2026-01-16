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
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Grid,
  TextField,
} from '@mui/material';
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Description as CsvIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { DynamicSearch, FieldConfig, SavedSearch, ViewMode, ReportFormat } from '@/components/DynamicSearch';

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
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('edit'); // Track if dialog is for viewing or editing
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [downloadMenuAnchor, setDownloadMenuAnchor] = useState<null | HTMLElement>(null);

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
      requiredForEdit: true, // Required when editing, optional when searching
    },
    {
      name: 'category',
      label: 'Category',
      type: 'dropdown',
      apiUrl: '/api/categories',
      helperText: 'Select a category (loaded from API)',
      requiredForEdit: true, // Required when editing, optional when searching
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
      requiredForEdit: true, // Required when editing, optional when searching
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
      requiredForEdit: true, // Required when editing, optional when searching
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

  // Add accordion section for advanced options (demonstrating accordion + field copying)
  const accordionField: FieldConfig = {
    name: 'shippingInfo',
    label: 'Shipping Information',
    type: 'accordion',
    defaultExpanded: false,
    helperText: 'Additional shipping details',
    fields: [
      {
        name: 'warehouse',
        label: 'Primary Warehouse Location',
        type: 'text',
        placeholder: 'Enter warehouse location...',
      },
      {
        name: 'alternateWarehouse',
        label: 'Alternate Warehouse',
        type: 'text',
        placeholder: 'Enter alternate location...',
        copyFromField: 'warehouse',
        copyButtonText: 'Copy from Primary Warehouse',
      },
      {
        name: 'estimatedShipping',
        label: 'Est. Shipping Days',
        type: 'number',
        defaultValue: 3,
      },
    ],
  };

  const editFieldsWithAccordion = [...searchFields, accordionField];

  const handleSearch = (params: Record<string, any>, selectedViewMode?: ViewMode) => {
    console.log('Search Parameters:', params);
    console.log('Selected View Mode:', selectedViewMode);

    // Filter gridData based on search params
    let filtered = [...gridData];

    if (params.productName) {
      filtered = filtered.filter(item =>
        item.productName.toLowerCase().includes(params.productName.toLowerCase())
      );
    }

    if (params.category) {
      filtered = filtered.filter(item => item.category === params.category);
    }

    if (params.condition) {
      filtered = filtered.filter(item => item.condition === params.condition);
    }

    if (params.inStock) {
      filtered = filtered.filter(item => item.inStock === true);
    }

    if (params.price) {
      filtered = filtered.filter(item => item.price <= Number(params.price));
    }

    if (params.country) {
      filtered = filtered.filter(item => item.country === params.country);
    }

    setSearchResults(filtered);
    setHasSearched(true);
  };

  const handleViewRow = (row: any) => {
    setSelectedRow(row);
    setDialogMode('view');
    setEditDialogOpen(true);
  };

  const handleEditRow = (row: any) => {
    setSelectedRow(row);
    setDialogMode('edit');
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
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<ViewIcon />}
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click event
              handleViewRow(params.row);
            }}
          >
            View
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<EditIcon />}
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click event
              handleEditRow(params.row);
            }}
          >
            Edit
          </Button>
        </Box>
      ),
    },
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

  // Render functions for different view modes
  const renderGridView = () => (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={searchResults}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );

  const handleDownloadReport = async (format: ReportFormat) => {
    setDownloadMenuAnchor(null);

    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `product-report-${timestamp}`;

    try {
      switch (format) {
        case 'pdf': {
          // Dynamic import to reduce bundle size
          const { jsPDF } = await import('jspdf');
          const autoTable = (await import('jspdf-autotable')).default;

          const doc = new jsPDF();

          // Add title
          doc.setFontSize(18);
          doc.text('Product Search Report', 14, 20);

          // Add date
          doc.setFontSize(10);
          doc.setTextColor(100);
          doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
          doc.text(`Total Results: ${searchResults.length}`, 14, 34);

          // Reset text color
          doc.setTextColor(0);

          // Generate table
          autoTable(doc, {
            startY: 42,
            head: [['Product Name', 'Category', 'Condition', 'In Stock', 'Price', 'Country']],
            body: searchResults.map(product => [
              product.productName,
              product.category,
              product.condition,
              product.inStock ? 'Yes' : 'No',
              `$${product.price}`,
              product.country.toUpperCase(),
            ]),
            styles: {
              fontSize: 10,
              cellPadding: 3,
            },
            headStyles: {
              fillColor: [63, 81, 181], // Primary color
              textColor: 255,
              fontStyle: 'bold',
            },
            alternateRowStyles: {
              fillColor: [245, 245, 245],
            },
            margin: { top: 42 },
          });

          doc.save(`${fileName}.pdf`);
          break;
        }

        case 'excel': {
          // Dynamic import to reduce bundle size
          const XLSX = await import('xlsx');

          // Prepare data with headers
          const worksheet = XLSX.utils.json_to_sheet(
            searchResults.map(product => ({
              'Product Name': product.productName,
              'Category': product.category,
              'Condition': product.condition,
              'In Stock': product.inStock ? 'Yes' : 'No',
              'Price': product.price,
              'Country': product.country.toUpperCase(),
            }))
          );

          // Set column widths
          const columnWidths = [
            { wch: 25 }, // Product Name
            { wch: 15 }, // Category
            { wch: 12 }, // Condition
            { wch: 10 }, // In Stock
            { wch: 10 }, // Price
            { wch: 10 }, // Country
          ];
          worksheet['!cols'] = columnWidths;

          // Create workbook and add worksheet
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

          // Add metadata
          workbook.Props = {
            Title: 'Product Search Report',
            Subject: 'Search Results',
            Author: 'Dynamic Search Component',
            CreatedDate: new Date(),
          };

          // Save file
          XLSX.writeFile(workbook, `${fileName}.xlsx`);
          break;
        }

        case 'csv': {
          // Generate CSV
          const headers = ['Product Name', 'Category', 'Condition', 'In Stock', 'Price', 'Country'];
          const csvRows = [
            headers.join(','),
            ...searchResults.map(product =>
              [
                `"${product.productName}"`,
                product.category,
                product.condition,
                product.inStock ? 'Yes' : 'No',
                product.price,
                product.country.toUpperCase(),
              ].join(',')
            ),
          ];
          const csvContent = csvRows.join('\n');
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', `${fileName}.csv`);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          break;
        }
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      alert(`Failed to download ${format.toUpperCase()} report. Please try again.`);
    }
  };

  const renderReportView = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={(e) => setDownloadMenuAnchor(e.currentTarget)}
        >
          Download Report
        </Button>
        <Menu
          anchorEl={downloadMenuAnchor}
          open={Boolean(downloadMenuAnchor)}
          onClose={() => setDownloadMenuAnchor(null)}
        >
          <MenuItem onClick={() => handleDownloadReport('pdf')}>
            <ListItemIcon>
              <PdfIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Download as PDF</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleDownloadReport('excel')}>
            <ListItemIcon>
              <ExcelIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Download as Excel</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleDownloadReport('csv')}>
            <ListItemIcon>
              <CsvIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Download as CSV</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell colSpan={2}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Product Search Report
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchResults.map((product, index) => (
              <React.Fragment key={product.id}>
                {index > 0 && (
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Divider />
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Product Name:</TableCell>
                  <TableCell>{product.productName}</TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: 'action.hover' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Category:</TableCell>
                  <TableCell>
                    <Chip label={product.category} size="small" color="primary" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Condition:</TableCell>
                  <TableCell>
                    <Chip label={product.condition} size="small" variant="outlined" />
                  </TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: 'action.hover' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>In Stock:</TableCell>
                  <TableCell>
                    <Chip
                      label={product.inStock ? 'Yes' : 'No'}
                      size="small"
                      color={product.inStock ? 'success' : 'error'}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Price:</TableCell>
                  <TableCell>${product.price}</TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: 'action.hover' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Country:</TableCell>
                  <TableCell>{product.country.toUpperCase()}</TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );


  const renderResults = () => {
    if (!hasSearched) {
      return (
        <Alert severity="info">
          Fill out the search form above and click "Search" to see results.
        </Alert>
      );
    }

    if (searchResults.length === 0) {
      return (
        <Alert severity="warning">
          No products found matching your search criteria. Try adjusting your filters.
        </Alert>
      );
    }

    switch (viewMode) {
      case 'grid':
        return renderGridView();
      case 'report':
        return renderReportView();
      default:
        return renderGridView();
    }
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
          <strong>New Features:</strong> Choose how to display search results - Grid (data table) or Report (detailed document with download options).
          Report view supports downloading as PDF, Excel, or CSV. Results only appear after clicking Search.
        </Alert>
        <Alert severity="success" sx={{ mt: 1 }}>
          <strong>Try these features:</strong> Interdependent fields (Brand → Model auto-fill), accordion fields
          with field copying in the edit modal, pill fields with range support (e.g., &quot;100-150&quot;), and separate View/Edit buttons in the grid.
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
        columnLayout={2}
        enableViewMode={true}
        defaultViewMode="grid"
        onViewModeChange={setViewMode}
        customFields={(values, onChange) => {
          // Example: Brand and Model interdependency
          const modelsByBrand: Record<string, string[]> = {
            apple: ['iPhone 15', 'iPhone 14', 'MacBook Pro', 'iPad Air'],
            samsung: ['Galaxy S24', 'Galaxy Note', 'Galaxy Tab'],
            sony: ['PlayStation 5', 'Xperia', 'Bravia TV'],
            lg: ['OLED TV', 'Gram Laptop', 'Wing Phone'],
            dell: ['XPS 13', 'Alienware', 'Inspiron'],
            hp: ['Spectre', 'Envy', 'Pavilion'],
          };

          const models = values.brand ? modelsByBrand[values.brand] || [] : [];

          return (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }}>
                  <Chip label="Custom Interdependent Fields" size="small" color="secondary" />
                </Divider>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Brand (Custom)"
                  value={values.brandCustom || ''}
                  onChange={(e) => {
                    onChange('brandCustom', e.target.value);
                    onChange('modelCustom', ''); // Reset model when brand changes
                  }}
                  fullWidth
                  helperText="Selecting a brand will populate available models"
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="apple">Apple</MenuItem>
                  <MenuItem value="samsung">Samsung</MenuItem>
                  <MenuItem value="sony">Sony</MenuItem>
                  <MenuItem value="lg">LG</MenuItem>
                  <MenuItem value="dell">Dell</MenuItem>
                  <MenuItem value="hp">HP</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Model (Auto-populated)"
                  value={values.modelCustom || ''}
                  onChange={(e) => onChange('modelCustom', e.target.value)}
                  fullWidth
                  disabled={!values.brandCustom}
                  helperText={
                    !values.brandCustom
                      ? 'Select a brand first'
                      : `${models.length} models available`
                  }
                >
                  {models.map((model) => (
                    <MenuItem key={model} value={model}>
                      {model}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {values.brandCustom && values.modelCustom && (
                <Grid item xs={12}>
                  <Alert severity="success">
                    Selected: <strong>{values.brandCustom}</strong> - <strong>{values.modelCustom}</strong>
                  </Alert>
                </Grid>
              )}
            </>
          );
        }}
      />

      {/* Search Results */}
      <Box mt={4}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">
              Search Results
              {hasSearched && (
                <Chip
                  label={`${searchResults.length} ${searchResults.length === 1 ? 'result' : 'results'}`}
                  size="small"
                  color="primary"
                  sx={{ ml: 2 }}
                />
              )}
            </Typography>
            {hasSearched && searchResults.length > 0 && (
              <Chip
                label={`View: ${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}`}
                color="secondary"
                variant="outlined"
              />
            )}
          </Box>
          {hasSearched && searchResults.length > 0 && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Click on any item to edit the product details. The DynamicSearch component is used for both searching and editing!
            </Alert>
          )}

          {renderResults()}
        </Paper>
      </Box>

      {/* View/Edit Modal */}
      <Dialog open={editDialogOpen} onClose={handleEditCancel} maxWidth="lg" fullWidth>
        <DialogTitle>
          {dialogMode === 'view' ? 'View Product Details' : 'Edit Product'} - {selectedRow?.productName}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {selectedRow && dialogMode === 'edit' && (
              <DynamicSearch
                key={`edit-${selectedRow.id}`} // Force re-mount when editing different rows
                fields={editFieldsWithAccordion}
                onSearch={handleEditSave}
                searchButtonText="Save Changes"
                resetButtonText="Cancel"
                enableSaveSearch={false}
                initialValues={selectedRow}
                columnLayout={1}
                formMode="edit" // Enable edit mode validation
              />
            )}
            {selectedRow && dialogMode === 'view' && (
              <Box>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Product Name:</TableCell>
                        <TableCell>{selectedRow.productName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Category:</TableCell>
                        <TableCell>
                          <Chip label={selectedRow.category} size="small" color="primary" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Condition:</TableCell>
                        <TableCell>
                          <Chip label={selectedRow.condition} size="small" variant="outlined" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>In Stock:</TableCell>
                        <TableCell>
                          <Chip
                            label={selectedRow.inStock ? 'Yes' : 'No'}
                            size="small"
                            color={selectedRow.inStock ? 'success' : 'error'}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Price:</TableCell>
                        <TableCell>${selectedRow.price}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Country:</TableCell>
                        <TableCell>{selectedRow.country?.toUpperCase()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setDialogMode('edit')}
                  >
                    Switch to Edit Mode
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          {dialogMode === 'edit' ? (
            <Button onClick={handleEditCancel} variant="outlined">
              Cancel
            </Button>
          ) : (
            <Button onClick={handleEditCancel} variant="contained">
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
}
