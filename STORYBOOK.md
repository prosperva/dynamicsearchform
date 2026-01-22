# Storybook - Interactive Component Documentation

This project includes **Storybook** for interactive documentation and testing of all standalone field components.

---

## 🚀 Running Storybook

To start the Storybook development server:

```bash
npm run storybook
```

This will start Storybook at [http://localhost:6006](http://localhost:6006)

---

## 📚 What's Included

### Complete Component Library

All standalone field components are documented with:

- **Interactive Controls** - Modify props in real-time
- **Multiple Examples** - Different use cases for each component
- **API Documentation** - Auto-generated from TypeScript types
- **Accessibility Tests** - Built-in a11y checks

### Story Categories

1. **Overview** - Complete form example with all components
2. **TextField** - Text input examples
3. **NumberField** - Numeric input examples
4. **DropdownField** - Select dropdown examples
5. **CheckboxField** - Checkbox examples
6. **RadioField** - Radio button group examples
7. **DateField** - Date picker examples
8. **MultiselectField** - Multi-select with API mapping
9. **PillField** - Multi-value chip input examples
10. **RichTextEditor** - WYSIWYG editor examples

---

## 🎯 Story Examples

### Overview Story

The `Complete Form` story shows all components working together:

- Live form state preview
- All field types in one place
- Real-time updates
- Interactive controls

### Individual Component Stories

Each component has its own stories showing:

- **Default** - Basic usage
- **With Tooltip** - Tooltip functionality
- **Required** - Required field validation
- **With Error** - Error state handling
- **Disabled** - Disabled state
- **API Integration** - Loading from API
- **Custom Mapping** - API field mapping

---

## 🔧 Storybook Features

### Interactive Controls

Use the **Controls** panel to:
- Change props on the fly
- Test different configurations
- Explore all component features

### Accessibility Testing

The **a11y** addon automatically checks for:
- WCAG compliance
- Keyboard navigation
- Screen reader compatibility
- Color contrast

### Documentation

The **Docs** tab provides:
- Component API reference
- TypeScript type definitions
- Usage examples
- Best practices

---

## 📝 Adding New Stories

To add a story for a new component:

1. Create a file in `components/DynamicSearch/stories/`:
   ```tsx
   // MyComponent.stories.tsx
   import type { Meta, StoryObj } from '@storybook/react';
   import { MyComponent } from '../MyComponent';

   const meta = {
     title: 'Standalone Fields/MyComponent',
     component: MyComponent,
     tags: ['autodocs'],
   } satisfies Meta<typeof MyComponent>;

   export default meta;
   type Story = StoryObj<typeof meta>;

   export const Default: Story = {
     render: (args) => {
       const [value, setValue] = useState('');
       return <MyComponent {...args} value={value} onChange={setValue} />;
     },
     args: {
       label: 'My Field',
     },
   };
   ```

2. Storybook will automatically pick up the new story

---

## 🎨 Storybook Addons

This project uses the following addons:

- **@storybook/addon-docs** - Documentation generation
- **@storybook/addon-a11y** - Accessibility testing
- **@chromatic-com/storybook** - Visual testing
- **@storybook/addon-vitest** - Test integration
- **@storybook/addon-onboarding** - Getting started guide

---

## 🧪 Testing with Storybook

### Visual Testing

Run visual tests with:
```bash
npm run test-storybook
```

### Accessibility Testing

The a11y addon automatically runs accessibility checks on all stories.

View results in the **Accessibility** panel.

---

## 📦 Building Storybook

To build a static version of Storybook for deployment:

```bash
npm run build-storybook
```

This creates a static site in `storybook-static/` that can be deployed to any static hosting service.

---

## 🔗 Links

- [Storybook Documentation](https://storybook.js.org/)
- [Storybook for React](https://storybook.js.org/docs/react/get-started/introduction)
- [Storybook Addons](https://storybook.js.org/addons)

---

## 💡 Tips

### Hot Reload

Storybook supports hot reload - changes to components and stories are reflected immediately.

### Viewport Testing

Use the **Viewport** toolbar to test components at different screen sizes:
- Mobile
- Tablet
- Desktop
- Custom sizes

### Dark Mode

Toggle between light and dark themes using the theme switcher in the toolbar.

### Keyboard Shortcuts

- **S** - Show/hide sidebar
- **A** - Show/hide addons panel
- **F** - Toggle fullscreen
- **/** - Focus search

---

## 🎉 Example Usage

Visit the Storybook UI and navigate to:

1. **Standalone Fields / Overview** - See all components together
2. **Standalone Fields / MultiselectField** - See API mapping in action
3. **Standalone Fields / TextField** - See validation examples

Play with the controls, view the code, and copy examples directly into your application!
