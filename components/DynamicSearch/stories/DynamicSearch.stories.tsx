import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Description as CsvIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DynamicSearch,
  FieldConfig,
  SavedSearch,
  ViewMode,
  ReportFormat,
} from '../DynamicSearch';

/**
 * # DynamicSearch Component
 *
 * A complete search interface with grid display, edit/view dialogs, and data export.
 *
 * ## Features
 * - **Advanced Search** - Multiple field types with filters
 * - **Data Grid** - Sortable, paginated results
 * - **Edit/View Dialogs** - Modal forms for data manipulation
 * - **Data Export** - PDF, Excel, CSV formats
 * - **Saved Searches** - Save and load search criteria
 * - **Report Generation** - Generate formatted reports
 */
const meta = {
  title: 'DynamicSearch/Complete Example',
  component: DynamicSearch,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Complete implementation of DynamicSearch with grid, edit/view dialogs, and export functionality',
      },
    },
  },
  decorators: [
    (Story) => (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Story />
        </Container>
      </LocalizationProvider>
    ),
  ],
} satisfies Meta<typeof DynamicSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock product data
const mockProducts = [
  {
    id: 1,
    productName: 'Wireless Mouse',
    category: 'electronics',
    condition: 'new',
    inStock: true,
    price: 25.99,
    country: 'us',
    description: 'Ergonomic wireless mouse with 3 buttons',
  },
  {
    id: 2,
    productName: 'Gaming Keyboard',
    category: 'electronics',
    condition: 'new',
    inStock: true,
    price: 89.99,
    country: 'ca',
    description: 'Mechanical keyboard with RGB lighting',
  },
  {
    id: 3,
    productName: 'Office Chair',
    category: 'furniture',
    condition: 'refurbished',
    inStock: false,
    price: 199.99,
    country: 'uk',
    description: 'Comfortable ergonomic office chair',
  },
  {
    id: 4,
    productName: 'Standing Desk',
    category: 'furniture',
    condition: 'new',
    inStock: true,
    price: 450.0,
    country: 'us',
    description: 'Height-adjustable standing desk',
  },
  {
    id: 5,
    productName: 'USB-C Cable',
    category: 'electronics',
    condition: 'new',
    inStock: true,
    price: 12.99,
    country: 'cn',
    description: '6ft USB-C charging cable',
  },
  {
    id: 6,
    productName: 'Laptop Stand',
    category: 'electronics',
    condition: 'new',
    inStock: true,
    price: 35.99,
    country: 'us',
    description: 'Aluminum laptop stand with cooling',
  },
  {
    id: 7,
    productName: 'Bookshelf',
    category: 'furniture',
    condition: 'used',
    inStock: true,
    price: 75.0,
    country: 'uk',
    description: '5-tier wooden bookshelf',
  },
  {
    id: 8,
    productName: 'Webcam HD',
    category: 'electronics',
    condition: 'new',
    inStock: false,
    price: 59.99,
    country: 'de',
    description: '1080p HD webcam with microphone',
  },
];

// Field configuration for search
const searchFields: FieldConfig[] = [
  {
    name: 'productName',
    label: 'Product Name',
    type: 'text',
    placeholder: 'Search by product name',
    tooltip: 'Enter partial or full product name',
  },
  {
    name: 'category',
    label: 'Category',
    type: 'dropdown',
    options: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'furniture', label: 'Furniture' },
      { value: 'clothing', label: 'Clothing' },
    ],
    helperText: 'Filter by category',
  },
  {
    name: 'condition',
    label: 'Condition',
    type: 'radio',
    options: [
      { value: 'new', label: 'New' },
      { value: 'used', label: 'Used' },
      { value: 'refurbished', label: 'Refurbished' },
    ],
    row: true,
  },
  {
    name: 'inStock',
    label: 'In Stock Only',
    type: 'checkbox',
    defaultValue: false,
  },
  {
    name: 'maxPrice',
    label: 'Max Price',
    type: 'number',
    min: 0,
    step: 0.01,
    placeholder: 'Maximum price',
  },
  {
    name: 'country',
    label: 'Country',
    type: 'multiselect',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'ca', label: 'Canada' },
      { value: 'de', label: 'Germany' },
      { value: 'cn', label: 'China' },
    ],
    showSelectAllButtons: true,
    helperText: 'Select one or more countries',
  },
];

// Field configuration for edit form
const editFields: FieldConfig[] = [
  {
    name: 'productName',
    label: 'Product Name',
    type: 'text',
    required: true,
    placeholder: 'Enter product name',
  },
  {
    name: 'category',
    label: 'Category',
    type: 'dropdown',
    required: true,
    options: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'furniture', label: 'Furniture' },
      { value: 'clothing', label: 'Clothing' },
    ],
  },
  {
    name: 'condition',
    label: 'Condition',
    type: 'radio',
    required: true,
    options: [
      { value: 'new', label: 'New' },
      { value: 'used', label: 'Used' },
      { value: 'refurbished', label: 'Refurbished' },
    ],
    row: true,
  },
  {
    name: 'price',
    label: 'Price (USD)',
    type: 'number',
    required: true,
    min: 0,
    step: 0.01,
  },
  {
    name: 'inStock',
    label: 'In Stock',
    type: 'checkbox',
    defaultValue: true,
  },
  {
    name: 'country',
    label: 'Country',
    type: 'dropdown',
    required: true,
    options: [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'ca', label: 'Canada' },
      { value: 'de', label: 'Germany' },
      { value: 'cn', label: 'China' },
    ],
  },
  {
    name: 'description',
    label: 'Description',
    type: 'text',
    multiline: true,
    rows: 3,
  },
];

// Disable all fields for view mode
const disableAllFields = (fields: FieldConfig[]): FieldConfig[] => {
  return fields.map((field) => ({
    ...field,
    disabled: true,
    fields: field.fields ? disableAllFields(field.fields) : undefined,
  }));
};

/**
 * ## Complete Product Search & Management
 *
 * This story demonstrates all DynamicSearch features:
 * - Search form with multiple field types
 * - Data grid with pagination and sorting
 * - Edit dialog for modifying records
 * - View dialog for read-only display
 * - Export to PDF, Excel, and CSV
 * - Saved search functionality
 */
export const CompleteExample: Story = {
  render: () => {
    const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('edit');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [downloadMenuAnchor, setDownloadMenuAnchor] = useState<null | HTMLElement>(
      null
    );

    // Simulate search
    const handleSearch = async (searchParams: Record<string, any>) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      let filtered = [...mockProducts];

      if (searchParams.productName) {
        filtered = filtered.filter((item) =>
          item.productName
            .toLowerCase()
            .includes(searchParams.productName.toLowerCase())
        );
      }

      if (searchParams.category) {
        filtered = filtered.filter((item) => item.category === searchParams.category);
      }

      if (searchParams.condition) {
        filtered = filtered.filter((item) => item.condition === searchParams.condition);
      }

      if (searchParams.inStock) {
        filtered = filtered.filter((item) => item.inStock === true);
      }

      if (searchParams.maxPrice) {
        filtered = filtered.filter((item) => item.price <= Number(searchParams.maxPrice));
      }

      if (searchParams.country && searchParams.country.length > 0) {
        filtered = filtered.filter((item) => searchParams.country.includes(item.country));
      }

      setSearchResults(filtered);
      setHasSearched(true);
      setViewMode('grid');
    };

    // Handle view row
    const handleViewRow = (row: any) => {
      setSelectedRow(row);
      setDialogMode('view');
      setEditDialogOpen(true);
    };

    // Handle edit row
    const handleEditRow = (row: any) => {
      setSelectedRow(row);
      setDialogMode('edit');
      setEditDialogOpen(true);
    };

    // Handle save from dialog
    const handleSaveRow = (formData: Record<string, any>) => {
      console.log('Saving row:', formData);
      // In production, this would call an API to save the data
      setEditDialogOpen(false);
      setSelectedRow(null);
    };

    // Handle report generation
    const handleGenerateReport = async (
      searchParams: Record<string, any>,
      format: ReportFormat
    ) => {
      console.log('Generating report:', { searchParams, format });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(`Report generated in ${format.toUpperCase()} format!`);
    };

    // DataGrid columns
    const columns: GridColDef[] = [
      { field: 'id', headerName: 'ID', width: 70 },
      { field: 'productName', headerName: 'Product Name', width: 200 },
      { field: 'category', headerName: 'Category', width: 130 },
      { field: 'condition', headerName: 'Condition', width: 120 },
      {
        field: 'inStock',
        headerName: 'In Stock',
        width: 100,
        renderCell: (params) => (params.value ? 'Yes' : 'No'),
      },
      {
        field: 'price',
        headerName: 'Price',
        width: 100,
        renderCell: (params) => `$${params.value.toFixed(2)}`,
      },
      { field: 'country', headerName: 'Country', width: 100 },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        sortable: false,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              startIcon={<ViewIcon />}
              onClick={() => handleViewRow(params.row)}
            >
              View
            </Button>
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={() => handleEditRow(params.row)}
            >
              Edit
            </Button>
          </Box>
        ),
      },
    ];

    return (
      <Box>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <DynamicSearch
            fields={searchFields}
            onSearch={handleSearch}
            savedSearches={savedSearches}
            onSaveSearch={(search) => setSavedSearches([...savedSearches, search])}
            onDeleteSearch={(searchName) =>
              setSavedSearches(savedSearches.filter((s) => s.name !== searchName))
            }
            onGenerateReport={handleGenerateReport}
            enableExport={true}
          />
        </Paper>

        {hasSearched && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Alert severity="info" sx={{ flexGrow: 1, mr: 2 }}>
                Found {searchResults.length} result(s)
              </Alert>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={(e) => setDownloadMenuAnchor(e.currentTarget)}
              >
                Export Data
              </Button>
              <Menu
                anchorEl={downloadMenuAnchor}
                open={Boolean(downloadMenuAnchor)}
                onClose={() => setDownloadMenuAnchor(null)}
              >
                <MenuItem
                  onClick={() => {
                    alert('Exporting to PDF...');
                    setDownloadMenuAnchor(null);
                  }}
                >
                  <ListItemIcon>
                    <PdfIcon />
                  </ListItemIcon>
                  <ListItemText>Export to PDF</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    alert('Exporting to Excel...');
                    setDownloadMenuAnchor(null);
                  }}
                >
                  <ListItemIcon>
                    <ExcelIcon />
                  </ListItemIcon>
                  <ListItemText>Export to Excel</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    alert('Exporting to CSV...');
                    setDownloadMenuAnchor(null);
                  }}
                >
                  <ListItemIcon>
                    <CsvIcon />
                  </ListItemIcon>
                  <ListItemText>Export to CSV</ListItemText>
                </MenuItem>
              </Menu>
            </Box>

            <DataGrid
              rows={searchResults}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10, 25]}
              checkboxSelection
              disableRowSelectionOnClick
              autoHeight
            />
          </Paper>
        )}

        {/* Edit/View Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setSelectedRow(null);
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {dialogMode === 'view' ? 'View Product' : 'Edit Product'}
          </DialogTitle>
          <DialogContent>
            {selectedRow && (
              <Box sx={{ mt: 2 }}>
                <DynamicSearch
                  fields={
                    dialogMode === 'view'
                      ? disableAllFields(editFields)
                      : editFields
                  }
                  onSearch={handleSaveRow}
                  initialData={selectedRow}
                  formMode={dialogMode}
                  enableExport={false}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setEditDialogOpen(false);
                setSelectedRow(null);
              }}
            >
              Close
            </Button>
            {dialogMode === 'edit' && (
              <Button
                variant="contained"
                onClick={() => {
                  // Trigger form submission
                  const form = document.querySelector('form');
                  if (form) {
                    form.dispatchEvent(
                      new Event('submit', { bubbles: true, cancelable: true })
                    );
                  }
                }}
              >
                Save Changes
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    );
  },
};

/**
 * ## Search Form Only
 *
 * Just the search interface without the grid.
 */
export const SearchFormOnly: Story = {
  render: () => {
    const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

    const handleSearch = (searchParams: Record<string, any>) => {
      console.log('Search params:', searchParams);
      alert(`Search submitted! Check console for parameters.`);
    };

    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <DynamicSearch
          fields={searchFields}
          onSearch={handleSearch}
          savedSearches={savedSearches}
          onSaveSearch={(search) => setSavedSearches([...savedSearches, search])}
          onDeleteSearch={(searchName) =>
            setSavedSearches(savedSearches.filter((s) => s.name !== searchName))
          }
          enableExport={true}
          onGenerateReport={async (params, format) => {
            console.log('Report:', { params, format });
            alert(`Generating ${format.toUpperCase()} report...`);
          }}
        />
      </Paper>
    );
  },
};

/**
 * ## Edit Form in Dialog
 *
 * Shows how to use DynamicSearch as an edit form in a dialog.
 */
export const EditFormInDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const productData = mockProducts[0];

    const handleSave = (formData: Record<string, any>) => {
      console.log('Saved data:', formData);
      alert('Product updated successfully!');
      setOpen(false);
    };

    return (
      <Box>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Open Edit Dialog
        </Button>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <DynamicSearch
                fields={editFields}
                onSearch={handleSave}
                initialData={productData}
                formMode="edit"
                enableExport={false}
              />
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    );
  },
};
