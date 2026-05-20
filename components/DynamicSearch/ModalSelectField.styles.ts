import { SxProps, Theme } from '@mui/material';

export const styles: Record<string, SxProps<Theme>> = {
  tooltipLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.5,
  },
  tooltipIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    ml: 0.5,
    cursor: 'help',
    color: 'action.active',
  },
  helpIcon: {
    fontSize: '1rem',
  },
  buttonsStack: {
    mt: 0.5,
  },
  inlineButton: {
    whiteSpace: 'nowrap',
    height: '40px',
  },
  inlineWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 1,
  },
  dialogPaper: {
    height: '65vh',
  },
  dialogContent: {
    p: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  filterBox: {
    p: 1.5,
    pb: 1,
    position: 'sticky',
    top: 0,
    bgcolor: 'background.paper',
    zIndex: 1,
  },
  gridContentBox: {
    flex: 1,
    px: 1.5,
    pb: 0,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  loadingBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  gridWrapper: {
    flex: 1,
    minHeight: 0,
  },
  dataGrid: {
    border: 'none',
    height: '100%',
    '& .MuiDataGrid-row': { cursor: 'pointer' },
    '& .MuiDataGrid-row.row-selected': { bgcolor: 'primary.light' },
    '& .MuiDataGrid-row.row-selected:hover': { bgcolor: 'primary.light' },
  },
  actionButtons: {
    px: 0,
    py: 1,
    display: 'flex',
    gap: 1,
    borderTop: '1px solid',
    borderColor: 'divider',
    flexShrink: 0,
  },
  list: {
    pt: 0,
    flex: 1,
    overflow: 'auto',
  },
  listLoadingBox: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    py: 4,
  },
  noOptionsText: {
    textAlign: 'center',
    color: 'text.secondary',
  },
  checkbox: {
    mr: 1,
  },
  dialogActions: {
    flexDirection: 'column',
    gap: 1,
    p: 2,
  },
};
