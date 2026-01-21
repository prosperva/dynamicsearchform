/**
 * Standalone Field Components
 *
 * These components can be used independently outside of the DynamicSearch component.
 * Each field type is a self-contained component with its own props and features.
 *
 * @example
 * import { StandaloneTextField, StandaloneDropdownField } from '@/components/DynamicSearch/standalone';
 *
 * function MyForm() {
 *   const [name, setName] = useState('');
 *   const [category, setCategory] = useState('');
 *
 *   return (
 *     <>
 *       <StandaloneTextField
 *         label="Product Name"
 *         value={name}
 *         onChange={setName}
 *       />
 *       <StandaloneDropdownField
 *         label="Category"
 *         value={category}
 *         onChange={setCategory}
 *         options={[
 *           { value: 'electronics', label: 'Electronics' },
 *           { value: 'clothing', label: 'Clothing' }
 *         ]}
 *       />
 *     </>
 *   );
 * }
 */

// Export all standalone field components
export { StandaloneTextField } from './StandaloneTextField';
export type { StandaloneTextFieldProps } from './StandaloneTextField';

export { StandaloneNumberField } from './StandaloneNumberField';
export type { StandaloneNumberFieldProps } from './StandaloneNumberField';

export { StandaloneDropdownField } from './StandaloneDropdownField';
export type { StandaloneDropdownFieldProps, DropdownOption } from './StandaloneDropdownField';

export { StandaloneCheckboxField } from './StandaloneCheckboxField';
export type { StandaloneCheckboxFieldProps } from './StandaloneCheckboxField';

export { StandaloneRadioField } from './StandaloneRadioField';
export type { StandaloneRadioFieldProps, RadioOption } from './StandaloneRadioField';

export { StandaloneDateField } from './StandaloneDateField';
export type { StandaloneDateFieldProps } from './StandaloneDateField';

export { StandaloneMultiselectField } from './StandaloneMultiselectField';
export type { StandaloneMultiselectFieldProps, MultiselectOption } from './StandaloneMultiselectField';

export { StandalonePillField } from './StandalonePillField';
export type { StandalonePillFieldProps } from './StandalonePillField';

// Note: RichTextEditor is already a standalone component
export { RichTextEditor } from './RichTextEditor';
export type { RichTextEditorProps } from './RichTextEditor';

// Note: ModalSelectField is already a standalone component
export { ModalSelectField } from './ModalSelectField';
export type { ModalSelectFieldProps } from './ModalSelectField';
