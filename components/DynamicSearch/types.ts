export type FieldType = 'text' | 'number' | 'dropdown' | 'checkbox' | 'radio' | 'date' | 'multiselect' | 'pill' | 'group' | 'modal-select';

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
  fields?: FieldConfig[]; // For grouped fields (only when type='group')
  allowMultiple?: boolean; // For modal-select: allow selecting multiple values (default: false)
}

export type SearchVisibility = 'user' | 'global';

export type ColumnLayout = 'auto' | 1 | 2 | 3 | 4;

export interface SavedSearch {
  id: string;
  name: string;
  params: Record<string, any>;
  createdAt: string;
  visibility: SearchVisibility;
  createdBy?: string;
  context?: string;
  description?: string;
}

export interface DynamicSearchProps {
  fields: FieldConfig[];
  onSearch: (params: Record<string, any>) => void;
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
}
