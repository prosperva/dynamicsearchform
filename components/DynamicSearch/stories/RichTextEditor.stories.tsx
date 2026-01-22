import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RichTextEditor } from '../RichTextEditor';

const meta = {
  title: 'Standalone Fields/RichTextEditor',
  component: RichTextEditor,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RichTextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: '700px' }}>
        <RichTextEditor {...args} value={value} onChange={setValue} />
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            background: '#f5f5f5',
            borderRadius: '4px',
          }}
        >
          <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold' }}>
            HTML Output:
          </p>
          <pre
            style={{
              margin: '8px 0 0 0',
              fontSize: '11px',
              overflow: 'auto',
              maxHeight: '150px',
            }}
          >
            {value || '<empty>'}
          </pre>
        </div>
      </div>
    );
  },
  args: {
    placeholder: 'Start typing your content...',
  },
};

export const WithLabel: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: '700px' }}>
        <RichTextEditor {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    label: 'Product Description',
    placeholder: 'Enter a detailed product description...',
    helperText: 'Use the toolbar to format your text',
  },
};

export const WithInitialContent: Story = {
  render: (args) => {
    const initialContent = `
      <h1>Welcome to Rich Text Editor</h1>
      <p>This is a <strong>bold</strong> statement and this is <em>italic</em> text.</p>
      <ul>
        <li>Bullet point one</li>
        <li>Bullet point two</li>
        <li>Bullet point three</li>
      </ul>
      <p>Here's some <code>inline code</code> and a blockquote:</p>
      <blockquote>
        <p>This is a quote from someone important.</p>
      </blockquote>
      <ol>
        <li>First numbered item</li>
        <li>Second numbered item</li>
        <li>Third numbered item</li>
      </ol>
    `;
    const [value, setValue] = useState(initialContent.trim());
    return (
      <div style={{ width: '700px' }}>
        <RichTextEditor {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    label: 'Formatted Content',
    helperText: 'Pre-loaded with formatted content',
  },
};

export const BlogPost: Story = {
  render: (args) => {
    const blogContent = `
      <h2>My First Blog Post</h2>
      <p>Welcome to my blog! This is where I share my thoughts on technology and design.</p>
      <h3>Key Features</h3>
      <ul>
        <li><strong>Rich Formatting</strong> - Bold, italic, and more</li>
        <li><strong>Lists</strong> - Bulleted and numbered</li>
        <li><strong>Code Snippets</strong> - Inline <code>code</code> support</li>
      </ul>
      <blockquote>
        <p>The best way to predict the future is to invent it.</p>
      </blockquote>
      <p>Try out the editor features and see how easy it is to create beautiful content!</p>
    `;
    const [value, setValue] = useState(blogContent.trim());
    return (
      <div style={{ width: '800px' }}>
        <RichTextEditor {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    label: 'Blog Post Content',
    placeholder: 'Write your blog post...',
    helperText: 'Create engaging blog content with rich formatting',
  },
};

export const DocumentationEditor: Story = {
  render: (args) => {
    const docContent = `
      <h1>API Documentation</h1>
      <p>This section describes the main API endpoints available.</p>
      <h2>Authentication</h2>
      <p>All API requests require authentication using an API key:</p>
      <blockquote>
        <p>Include the header: <code>Authorization: Bearer YOUR_API_KEY</code></p>
      </blockquote>
      <h2>Endpoints</h2>
      <ol>
        <li><code>GET /api/users</code> - List all users</li>
        <li><code>POST /api/users</code> - Create a new user</li>
        <li><code>PUT /api/users/:id</code> - Update a user</li>
        <li><code>DELETE /api/users/:id</code> - Delete a user</li>
      </ol>
    `;
    const [value, setValue] = useState(docContent.trim());
    return (
      <div style={{ width: '800px' }}>
        <RichTextEditor {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    label: 'Documentation',
    helperText: 'Write clear and formatted documentation',
  },
};

export const ProductDescription: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: '700px' }}>
        <RichTextEditor {...args} value={value} onChange={setValue} />
        <div
          style={{
            marginTop: '16px',
            padding: '16px',
            background: '#e3f2fd',
            borderRadius: '4px',
          }}
        >
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold' }}>
            Formatting Tips:
          </p>
          <ul style={{ margin: '8px 0 0 20px', fontSize: '12px' }}>
            <li>Use <strong>bold</strong> for product highlights</li>
            <li>Use bullet lists for features</li>
            <li>Use blockquotes for customer testimonials</li>
            <li>Use code blocks for technical specifications</li>
          </ul>
        </div>
      </div>
    );
  },
  args: {
    label: 'Product Description',
    placeholder: 'Describe your product in detail...',
    helperText: 'Rich text description shown to customers',
  },
};

export const EmailTemplate: Story = {
  render: (args) => {
    const emailContent = `
      <p>Dear Customer,</p>
      <p>Thank you for your recent purchase! Here's what you ordered:</p>
      <ul>
        <li><strong>Product:</strong> Premium Widget</li>
        <li><strong>Quantity:</strong> 2</li>
        <li><strong>Price:</strong> $99.99</li>
      </ul>
      <blockquote>
        <p>Your order will be shipped within 2-3 business days.</p>
      </blockquote>
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p><em>Best regards,</em><br /><strong>The Team</strong></p>
    `;
    const [value, setValue] = useState(emailContent.trim());
    return (
      <div style={{ width: '700px' }}>
        <RichTextEditor {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    label: 'Email Template',
    helperText: 'Customize your email template',
  },
};

export const MinimalToolbar: Story = {
  render: (args) => {
    const [value, setValue] = useState('<p>Simple content with basic formatting.</p>');
    return (
      <div style={{ width: '600px' }}>
        <RichTextEditor {...args} value={value} onChange={setValue} />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          All toolbar features are available: bold, italic, code, lists, quotes, and undo/redo
        </p>
      </div>
    );
  },
  args: {
    label: 'Notes',
    placeholder: 'Quick notes...',
  },
};

export const Disabled: Story = {
  render: (args) => {
    const [value] = useState(`
      <h3>Read-Only Content</h3>
      <p>This editor is <strong>disabled</strong> and cannot be edited.</p>
      <ul>
        <li>No toolbar is shown</li>
        <li>Content is displayed but not editable</li>
        <li>Useful for viewing formatted content</li>
      </ul>
    `.trim());
    return (
      <div style={{ width: '700px' }}>
        <RichTextEditor {...args} value={value} onChange={() => {}} />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          This content is locked and cannot be modified
        </p>
      </div>
    );
  },
  args: {
    label: 'Locked Content',
    disabled: true,
    helperText: 'This content is read-only',
  },
};

export const LongContent: Story = {
  render: (args) => {
    const longContent = `
      <h1>Chapter 1: Introduction</h1>
      <p>This is a long document with multiple sections demonstrating scrolling behavior.</p>

      <h2>Section 1.1</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      <ul>
        <li>Point one with some detail</li>
        <li>Point two with more information</li>
        <li>Point three with even more content</li>
      </ul>

      <h2>Section 1.2</h2>
      <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <blockquote>
        <p>Important quote that needs to stand out from the rest of the content.</p>
      </blockquote>

      <h2>Section 1.3</h2>
      <ol>
        <li>First item in ordered list</li>
        <li>Second item with <code>inline code</code></li>
        <li>Third item with <strong>bold text</strong></li>
      </ol>

      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>

      <h1>Chapter 2: Advanced Topics</h1>
      <p>This chapter covers more advanced concepts and features.</p>
      <p>The editor has a maximum height and will scroll when content exceeds that height.</p>
    `;
    const [value, setValue] = useState(longContent.trim());
    return (
      <div style={{ width: '800px' }}>
        <RichTextEditor {...args} value={value} onChange={setValue} />
        <p style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
          Notice the scrollbar when content exceeds the maximum height
        </p>
      </div>
    );
  },
  args: {
    label: 'Long Document',
    helperText: 'Scrollable content area with 400px max height',
  },
};
