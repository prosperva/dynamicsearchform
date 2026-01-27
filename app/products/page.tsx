'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Alert,
  Button,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Description as CsvIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { LockService } from '@/lib/lockService';
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel, GridRowSelectionModel } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { DynamicSearch, FieldConfig, SavedSearch, ViewMode, ReportFormat } from '@/components/DynamicSearch';
import { useGridManagement } from '@/hooks/useGridManagement';
import { useProducts, useAllProducts, usePrefetchProduct, type ProductsQueryParams } from '@/hooks/useProducts';

// Search field configurations - similar to app/page.tsx
const searchFields: FieldConfig[] = [
  {
    name: 'search',
    label: 'Product Name',
    type: 'text',
    placeholder: 'Enter product name...',
    helperText: 'Search by product name or description',
    tooltip: 'Enter the name or partial name of the product you are looking for',
  },
  {
    name: 'category',
    label: 'Category',
    type: 'dropdown',
    options: [
      { label: 'Electronics', value: 'electronics' },
      { label: 'Clothing', value: 'clothing' },
      { label: 'Home & Garden', value: 'home' },
      { label: 'Sports', value: 'sports' },
    ],
    helperText: 'Select a category',
  },
  {
    name: 'status',
    label: 'Status',
    type: 'dropdown',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Discontinued', value: 'discontinued' },
    ],
    helperText: 'Product status',
  },
  {
    name: 'priceRange',
    label: 'Price Range',
    type: 'dropdown',
    options: [
      { label: '$0 - $50', value: '0-50' },
      { label: '$50 - $100', value: '50-100' },
      { label: '$100 - $500', value: '100-500' },
      { label: '$500+', value: '500-1000' },
    ],
    helperText: 'Filter by price range',
  },
  {
    name: 'dateFrom',
    label: 'Created From',
    type: 'date',
    helperText: 'Products created after this date',
  },
  {
    name: 'dateTo',
    label: 'Created To',
    type: 'date',
    helperText: 'Products created before this date',
  },
  {
    name: 'stockRange',
    label: 'Stock Levels',
    type: 'pill',
    pillType: 'number',
    allowRanges: true,
    placeholder: 'Enter stock levels (e.g., 0-50, 100-200)',
    helperText: 'Filter by stock ranges',
    defaultValue: [],
  },
];

export default function ProductsPage() {
  // ========================================
  // CONFIGURATION OPTIONS
  // ========================================
  const enableExport = true;
  const enableEditView = true;
  const currentUser = 'demo_user@example.com'; // In production, get from auth context

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Grid management for state persistence
  const {
    state,
    updateState,
    navigateTo,
    setPage,
    setPageSize,
    setSortModel,
    setColumnVisibility,
    setSelectedRows,
  } = useGridManagement({
    gridId: 'products-grid',
    scrollContainerRef,
  });

  // Local UI state
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  // Use hasSearched from persisted grid state
  const hasSearched = state.hasSearched;
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [downloadMenuAnchor, setDownloadMenuAnchor] = useState<null | HTMLElement>(null);
  const [columnSelectorOpen, setColumnSelectorOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Track locked rows: { rowId: { lockedBy: string, lockedAt: Date } }
  const [lockedRows, setLockedRows] = useState<Record<number, { lockedBy: string; lockedAt: Date }>>({});

  // Build query params from grid state
  const queryParams: ProductsQueryParams = useMemo(() => ({
    page: state.page,
    pageSize: state.pageSize,
    sortField: state.sortModel[0]?.field,
    sortOrder: state.sortModel[0]?.sort,
    search: state.filters.search,
    category: state.filters.category,
    status: state.filters.status,
    priceRange: state.filters.priceRange,
    dateFrom: state.filters.dateFrom,
    dateTo: state.filters.dateTo,
  }), [state.page, state.pageSize, state.sortModel, state.filters]);

  // Build filter-only params for report view (no pagination)
  const reportQueryParams = useMemo(() => ({
    sortField: state.sortModel[0]?.field,
    sortOrder: state.sortModel[0]?.sort,
    search: state.filters.search,
    category: state.filters.category,
    status: state.filters.status,
    priceRange: state.filters.priceRange,
    dateFrom: state.filters.dateFrom,
    dateTo: state.filters.dateTo,
  }), [state.sortModel, state.filters]);

  // Fetch products using React Query (paginated for grid view)
  const { data, isLoading, isError, error, refetch, isFetching } = useProducts(queryParams);

  // Fetch ALL products for report view (only enabled when in report mode and has searched)
  const {
    data: reportData,
    isLoading: isReportLoading,
    isFetching: isReportFetching,
  } = useAllProducts(reportQueryParams, {
    enabled: viewMode === 'report' && hasSearched,
  });

  // Prefetch hook for hover
  const prefetchProduct = usePrefetchProduct();

  // Sync locks from database on mount and periodically
  useEffect(() => {
    const syncLocks = async () => {
      const locks = await LockService.getTableLocks('products');
      const lockMap: Record<number, { lockedBy: string; lockedAt: Date }> = {};

      locks.forEach(lock => {
        lockMap[Number(lock.rowId)] = {
          lockedBy: lock.lockedBy,
          lockedAt: new Date(lock.lockedAt)
        };
      });

      setLockedRows(lockMap);
    };

    // Initial sync
    syncLocks();

    // Sync every 10 seconds
    const interval = setInterval(syncLocks, 10000);

    return () => clearInterval(interval);
  }, []);

  // Grid columns definition
  const baseColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Product Name', width: 200, flex: 1 },
    { field: 'category', headerName: 'Category', width: 130 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={
            params.value === 'active'
              ? 'success'
              : params.value === 'inactive'
              ? 'warning'
              : 'error'
          }
        />
      ),
    },
    {
      field: 'price',
      headerName: 'Price ($)',
      width: 100,
      type: 'number',
      valueFormatter: (value: number) => `$${value?.toFixed(2) || '0.00'}`,
    },
    { field: 'stock', headerName: 'Stock', width: 100, type: 'number' },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 120,
      valueFormatter: (value: string) => dayjs(value).format('MM/DD/YYYY'),
    },
  ];

  // Handle edit with lock acquisition
  const handleEditClick = async (row: any) => {
    // Check if row is locked by another user
    const lock = lockedRows[row.id];
    if (lock && lock.lockedBy !== currentUser) {
      alert(`This record is currently being edited by ${lock.lockedBy}.\nPlease try again later.`);
      return;
    }

    // Try to acquire lock from database
    const lockResult = await LockService.acquireLock('products', row.id.toString(), currentUser);

    if (!lockResult.success) {
      alert(`This record is currently being edited by ${lockResult.lockedBy}.\nPlease try again later.`);
      return;
    }

    // Update local lock state
    setLockedRows(prev => ({
      ...prev,
      [row.id]: { lockedBy: currentUser, lockedAt: new Date() }
    }));

    // Navigate to edit page
    navigateTo(`/products/edit/${row.id}`);
  };

  // Add actions column if enabled
  const columns: GridColDef[] = enableEditView
    ? [
        ...baseColumns,
        {
          field: 'actions',
          headerName: 'Actions',
          width: 250,
          sortable: false,
          filterable: false,
          renderCell: (params) => {
            const lock = lockedRows[params.row.id];
            const isLockedByOther = lock && lock.lockedBy !== currentUser;
            const isLockedByMe = lock && lock.lockedBy === currentUser;

            return (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
                {isLockedByOther && (
                  <Chip
                    icon={<LockIcon />}
                    label={`Locked by ${lock.lockedBy.split('@')[0]}`}
                    size="small"
                    color="warning"
                  />
                )}
                {isLockedByMe && (
                  <Chip
                    icon={<LockIcon />}
                    label="Editing"
                    size="small"
                    color="info"
                  />
                )}
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<ViewIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProduct(params.row);
                  }}
                >
                  View
                </Button>
                <Tooltip title={isLockedByOther ? `Locked by ${lock.lockedBy}` : 'Edit product'}>
                  <span>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(params.row);
                      }}
                      onMouseEnter={() => prefetchProduct(params.row.id)}
                      disabled={isLockedByOther}
                    >
                      Edit
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            );
          },
        },
      ]
    : baseColumns;

  // Column config for report view
  const availableColumns = useMemo(
    () =>
      baseColumns
        .filter((col) => col.field !== 'id' && col.field !== 'actions')
        .map((col) => ({
          id: col.field,
          label: col.headerName || col.field,
          selected: true,
        })),
    []
  );

  const [selectedColumns, setSelectedColumns] = useState(availableColumns);

  // Handlers
  const handleSearch = (params: Record<string, any>, selectedViewMode?: ViewMode) => {
    console.log('Search Parameters:', params);
    console.log('Selected View Mode:', selectedViewMode);

    // Update filters in grid state, reset to page 0, and mark as searched
    updateState({
      filters: params,
      page: 0,
      hasSearched: true,
    });
  };

  const handleReset = () => {
    // Clear filters and reset hasSearched flag
    updateState({
      filters: {},
      page: 0,
      hasSearched: false,
    });
  };

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setViewDialogOpen(true);
  };

  // Saved search handlers
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

  // Column selection handlers
  const handleToggleColumn = (columnId: string) => {
    setSelectedColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, selected: !col.selected } : col
      )
    );
  };

  const handleSelectAllColumns = () => {
    setSelectedColumns((prev) => prev.map((col) => ({ ...col, selected: true })));
  };

  const handleDeselectAllColumns = () => {
    setSelectedColumns((prev) => prev.map((col) => ({ ...col, selected: false })));
  };

  // Download handlers
  const handleDownloadReport = async (format: ReportFormat) => {
    setDownloadMenuAnchor(null);

    // Use report data (all rows) for exports
    const searchResults = reportData?.data || [];
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `product-report-${timestamp}`;

    const activeColumns = selectedColumns.filter((col) => col.selected);

    if (activeColumns.length === 0) {
      alert('Please select at least one column to export');
      return;
    }

    try {
      switch (format) {
        case 'pdf': {
          const jsPDFModule = await import('jspdf');
          const jsPDF = jsPDFModule.default;
          const autoTable = (await import('jspdf-autotable')).default;

          const doc = new jsPDF();
          doc.setFontSize(18);
          doc.text('Product Report', 14, 20);
          doc.setFontSize(10);
          doc.setTextColor(100);
          doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
          doc.text(`Total Results: ${searchResults.length}`, 14, 34);
          doc.setTextColor(0);

          const headers = activeColumns.map((col) => col.label);
          const body = searchResults.map((product: any) =>
            activeColumns.map((col) => {
              const value = product[col.id];
              if (col.id === 'price') return `$${value?.toFixed(2) || '0.00'}`;
              if (col.id === 'createdAt') return dayjs(value).format('MM/DD/YYYY');
              return value;
            })
          );

          autoTable(doc, {
            startY: 42,
            head: [headers],
            body: body,
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [63, 81, 181], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { top: 42 },
          });

          doc.save(`${fileName}.pdf`);
          break;
        }

        case 'excel': {
          const XLSX = await import('xlsx');
          const worksheet = XLSX.utils.json_to_sheet(
            searchResults.map((product: any) => {
              const row: any = {};
              activeColumns.forEach((col) => {
                const value = product[col.id];
                let formattedValue = value;
                if (col.id === 'price') formattedValue = value;
                else if (col.id === 'createdAt') formattedValue = dayjs(value).format('MM/DD/YYYY');
                row[col.label] = formattedValue;
              });
              return row;
            })
          );

          const columnWidths = activeColumns.map(() => ({ wch: 20 }));
          worksheet['!cols'] = columnWidths;

          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
          workbook.Props = {
            Title: 'Product Report',
            Subject: 'Search Results',
            Author: 'Dynamic Search Component',
            CreatedDate: new Date(),
          };

          XLSX.writeFile(workbook, `${fileName}.xlsx`);
          break;
        }

        case 'csv': {
          const headers = activeColumns.map((col) => col.label);
          const csvRows = [
            headers.join(','),
            ...searchResults.map((product: any) =>
              activeColumns
                .map((col) => {
                  const value = product[col.id];
                  let formattedValue = value;
                  if (col.id === 'price') formattedValue = value;
                  else if (col.id === 'name') formattedValue = `"${value}"`;
                  else if (col.id === 'createdAt') formattedValue = dayjs(value).format('MM/DD/YYYY');
                  return formattedValue;
                })
                .join(',')
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

  // Pagination handlers
  const handlePaginationChange = (model: GridPaginationModel) => {
    setPage(model.page);
    setPageSize(model.pageSize);
  };

  const handleSortChange = (model: GridSortModel) => {
    setSortModel(model as Array<{ field: string; sort: 'asc' | 'desc' }>);
  };

  const handleRowSelectionChange = (model: GridRowSelectionModel) => {
    console.log('Selection model:', model);
    // MUI DataGrid v8 format: { type: 'include' | 'exclude', ids: Set }
    if (model && typeof model === 'object' && 'ids' in model) {
      const ids = Array.from(model.ids) as (string | number)[];
      console.log('Selected IDs:', ids);
      setSelectedRows(ids);
    }
  };

  // Render grid view
  const renderGridView = () => (
    <Paper elevation={1} sx={{ height: 500, width: '100%' }} ref={scrollContainerRef}>
      <DataGrid
        rows={data?.data || []}
        columns={columns}
        rowCount={data?.total || 0}
        loading={isLoading || isFetching}
        getRowId={(row) => row.id}
        pageSizeOptions={[10, 25, 50, 100]}
        paginationModel={{ page: state.page, pageSize: state.pageSize }}
        onPaginationModelChange={handlePaginationChange}
        paginationMode="server"
        sortModel={state.sortModel}
        onSortModelChange={handleSortChange}
        sortingMode="server"
        checkboxSelection
        onRowSelectionModelChange={handleRowSelectionChange}
        columnVisibilityModel={state.columnVisibility}
        onColumnVisibilityModelChange={setColumnVisibility}
        slots={{
          loadingOverlay: () => (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ),
        }}
      />
    </Paper>
  );

  // Render report view
  const renderReportView = () => {
    const activeColumns = selectedColumns.filter((col) => col.selected);
    // Use report data (all rows) for report view
    const searchResults = reportData?.data || [];

    // Show loading state for report data
    if (isReportLoading || isReportFetching) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading all data for report...</Typography>
        </Box>
      );
    }

    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Product Report ({reportData?.total || searchResults.length} results - all rows)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" onClick={() => setColumnSelectorOpen(true)}>
              Select Columns
            </Button>
            {enableExport && (
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={(e) => setDownloadMenuAnchor(e.currentTarget)}
              >
                Download Report
              </Button>
            )}
          </Box>
          {enableExport && (
            <Menu
              anchorEl={downloadMenuAnchor}
              open={Boolean(downloadMenuAnchor)}
              onClose={() => setDownloadMenuAnchor(null)}
            >
              <MenuItem onClick={() => handleDownloadReport('pdf')}>
                <ListItemIcon><PdfIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Download as PDF</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleDownloadReport('excel')}>
                <ListItemIcon><ExcelIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Download as Excel</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => handleDownloadReport('csv')}>
                <ListItemIcon><CsvIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Download as CSV</ListItemText>
              </MenuItem>
            </Menu>
          )}
        </Box>
        <TableContainer component={Paper} variant="outlined">
          <Table sx={{ minWidth: 650 }} aria-label="product report table">
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                {activeColumns.map((col) => (
                  <TableCell
                    key={col.id}
                    sx={{ color: 'white', fontWeight: 'bold' }}
                    align={col.id === 'price' || col.id === 'stock' ? 'right' : 'left'}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {searchResults.map((product: any) => (
                <TableRow
                  key={product.id}
                  sx={{
                    '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                    '&:hover': { bgcolor: 'action.selected' },
                  }}
                >
                  {activeColumns.map((col) => {
                    const value = product[col.id];
                    return (
                      <TableCell
                        key={col.id}
                        align={col.id === 'price' || col.id === 'stock' ? 'right' : 'left'}
                      >
                        {col.id === 'category' ? (
                          <Chip label={value} size="small" color="primary" variant="outlined" />
                        ) : col.id === 'status' ? (
                          <Chip
                            label={value}
                            size="small"
                            color={value === 'active' ? 'success' : value === 'inactive' ? 'warning' : 'error'}
                          />
                        ) : col.id === 'price' ? (
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ${value?.toFixed(2) || '0.00'}
                          </Typography>
                        ) : col.id === 'createdAt' ? (
                          dayjs(value).format('MM/DD/YYYY')
                        ) : (
                          value
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  // Render results based on view mode
  const renderResults = () => {
    if (!hasSearched) {
      return (
        <Alert severity="info">
          Fill out the search form above and click "Search" to see results.
        </Alert>
      );
    }

    if (isError) {
      return (
        <Alert severity="error">
          Failed to load products: {(error as Error)?.message || 'Unknown error'}
        </Alert>
      );
    }

    // For report view, check reportData; for grid view, check data
    const currentData = viewMode === 'report' ? reportData : data;
    if (currentData?.data.length === 0) {
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
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Products
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" paragraph>
            Search and manage your product inventory with filters, export options, and saved searches.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh data">
            <IconButton onClick={() => refetch()} disabled={isFetching}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigateTo('/products/new')}
          >
            Add Product
          </Button>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 2 }}>
        <strong>Features:</strong> Grid or Report view, export to PDF/Excel/CSV, saved searches, and filter persistence when editing.
      </Alert>

      {/* DynamicSearch Component */}
      <DynamicSearch
        key={JSON.stringify(state.filters)}
        fields={searchFields}
        onSearch={handleSearch}
        onReset={handleReset}
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
        columnLayout={3}
        enableViewMode={true}
        defaultViewMode={viewMode}
        onViewModeChange={setViewMode}
        initialValues={state.filters}
      />

      {/* Search Results */}
      <Box mt={4}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">
              Search Results
              {hasSearched && (viewMode === 'report' ? reportData : data) && (
                <Chip
                  label={`${(viewMode === 'report' ? reportData?.total : data?.total) || 0} ${((viewMode === 'report' ? reportData?.total : data?.total) || 0) === 1 ? 'result' : 'results'}`}
                  size="small"
                  color="primary"
                  sx={{ ml: 2 }}
                />
              )}
            </Typography>
            {hasSearched && (viewMode === 'report' ? reportData : data) && ((viewMode === 'report' ? reportData?.data : data?.data)?.length ?? 0) > 0 && (
              <Chip
                label={`View: ${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}`}
                color="secondary"
                variant="outlined"
              />
            )}
          </Box>

          {/* Selection Info */}
          {state.selectedRowIds.length > 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {state.selectedRowIds.length} row(s) selected
            </Alert>
          )}

          {renderResults()}

          {/* Stats */}
          {hasSearched && data && data.data.length > 0 && viewMode === 'grid' && (
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Page {data.page + 1} of {data.totalPages}
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* View Product Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>View Product - {selectedProduct?.name}</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Box sx={{ pt: 2 }}>
              <DynamicSearch
                fields={searchFields.map((f) => ({ ...f, disabled: true }))}
                onSearch={() => {}}
                initialValues={selectedProduct}
                searchButtonText="Edit"
                resetButtonText="Close"
                enableSaveSearch={false}
                columnLayout={2}
                onReset={() => setViewDialogOpen(false)}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Column Selector Dialog */}
      <Dialog open={columnSelectorOpen} onClose={() => setColumnSelectorOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Select Columns for Report</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormGroup>
              {selectedColumns.map((col) => (
                <FormControlLabel
                  key={col.id}
                  control={<Checkbox checked={col.selected} onChange={() => handleToggleColumn(col.id)} />}
                  label={col.label}
                />
              ))}
            </FormGroup>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeselectAllColumns}>Deselect All</Button>
          <Button onClick={handleSelectAllColumns}>Select All</Button>
          <Button onClick={() => setColumnSelectorOpen(false)} variant="contained">Done</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
