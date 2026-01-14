# Modal Positioning Feature

The DynamicSearch component now supports configurable modal positioning for all dialogs (Save Search, Rename, Delete, Preview).

## Usage

Add the `modalPosition` prop to the `DynamicSearch` component:

```tsx
import { DynamicSearch } from '@/components/DynamicSearch';

<DynamicSearch
  fields={fields}
  onSearch={handleSearch}
  modalPosition="top-right" // Position all dialogs in the top-right corner
  // ... other props
/>
```

## Available Positions

- `center` (default) - Modal appears in the center of the screen
- `top` - Modal appears at the top center
- `bottom` - Modal appears at the bottom center
- `left` - Modal appears on the left center
- `right` - Modal appears on the right center
- `top-left` - Modal appears in the top-left corner
- `top-right` - Modal appears in the top-right corner
- `bottom-left` - Modal appears in the bottom-left corner
- `bottom-right` - Modal appears in the bottom-right corner

## Example

```tsx
const [position, setPosition] = useState<ModalPosition>('center');

// Allow users to change position
<select value={position} onChange={(e) => setPosition(e.target.value)}>
  <option value="center">Center</option>
  <option value="top">Top</option>
  <option value="bottom">Bottom</option>
  <option value="left">Left</option>
  <option value="right">Right</option>
  <option value="top-left">Top-Left</option>
  <option value="top-right">Top-Right</option>
  <option value="bottom-left">Bottom-Left</option>
  <option value="bottom-right">Bottom-Right</option>
</select>

<DynamicSearch
  fields={searchFields}
  onSearch={handleSearch}
  modalPosition={position}
/>
```

## Benefits

- **Flexibility**: Position modals where they make sense for your UI
- **User Preference**: Allow users to choose their preferred modal position
- **Consistency**: All dialogs in the DynamicSearch component use the same position
- **Responsive**: Works seamlessly across different screen sizes

## Implementation Details

The modal positioning is achieved using MUI's `sx` prop on the `Dialog` component. The positioning styles control the flexbox alignment of the dialog container:

- `alignItems` controls vertical positioning (flex-start, center, flex-end)
- `justifyContent` controls horizontal positioning (flex-start, center, flex-end)
- Padding is added to prevent modals from touching screen edges

## TypeScript Support

The `ModalPosition` type is exported from the types file:

```tsx
import { ModalPosition } from '@/components/DynamicSearch/types';

const position: ModalPosition = 'top-right';
```

## Demo

Check out the live demo in the main application where you can toggle between different modal positions and see them in action when opening Save Search, Rename, Delete, or Preview dialogs!
