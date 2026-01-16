export type FieldType = 'text' | 'number' | 'dropdown' | 'checkbox' | 'radio' | 'date' | 'multiselect' | 'pill' | 'group' | 'modal-select' | 'accordion';

export interface DropdownOption {
  label: string;
  value: string | number;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  defaultValue?: any;
  options?: DropdownOption[];
  apiUrl?: string;
  apiLabelField?: string; // Field name for label in API response (default: 'label')
  apiValueField?: string; // Field name for value in API response (default: 'value')
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  pillType?: 'number' | 'text';
  allowRanges?: boolean;
  tooltip?: string;
  fields?: FieldConfig[]; // For grouped fields (only when type='group' or 'accordion')
  allowMultiple?: boolean; // For modal-select: allow selecting multiple values (default: false)
  defaultExpanded?: boolean; // For accordion: whether section starts expanded (default: false)
  copyFromField?: string; // Field name to copy value from (creates a "Copy from X" button)
  copyButtonText?: string; // Custom text for copy button (default: "Copy from {fieldLabel}")
}

export type SearchVisibility = 'user' | 'global';

export type ColumnLayout = 'auto' | 1 | 2 | 3 | 4;

export type ModalPosition = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type ViewMode = 'grid' | 'report';
export type ReportFormat = 'pdf' | 'excel' | 'csv';


export interface SavedSearch {
  id: string;
  name: string;
  params: Record<string, any>;
  createdAt: string;
  visibility: SearchVisibility;
  createdBy?: string;
  context?: string;
  description?: string;
  viewMode?: ViewMode; // Preferred view mode for this saved search
}

export interface DynamicSearchProps {
  fields: FieldConfig[];
  onSearch: (params: Record<string, any>, viewMode?: ViewMode) => void;
  onSave?: (search: SavedSearch) => void;
  onLoad?: (searchId: string) => void;
  onDelete?: (searchId: string) => void;
  onRename?: (searchId: string, newName: string) => void;
  onChangeVisibility?: (searchId: string, visibility: SearchVisibility) => void;
  savedSearches?: SavedSearch[];
  enableSaveSearch?: boolean;
  searchButtonText?: string;
  resetButtonText?: string;
  currentUser?: string;
  searchContext?: string;
  allowCrossContext?: boolean;
  isAdmin?: boolean;
  columnLayout?: ColumnLayout;
  initialValues?: Record<string, any>;
  modalPosition?: ModalPosition; // Position of all dialogs (default: 'center')
  enableViewMode?: boolean; // Enable view mode selector (default: false)
  defaultViewMode?: ViewMode; // Default view mode (default: 'grid')
  availableViewModes?: ViewMode[]; // Available view modes (default: all)
  onViewModeChange?: (viewMode: ViewMode) => void; // Callback when view mode changes
}
