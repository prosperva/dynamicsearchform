'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Box, Paper, IconButton, Divider, Tooltip } from '@mui/material';
import {
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatListBulleted as BulletListIcon,
  FormatListNumbered as NumberedListIcon,
  Code as CodeIcon,
  FormatQuote as QuoteIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
} from '@mui/icons-material';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  helperText?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  disabled = false,
  label,
  helperText,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || '',
    editable: !disabled,
    immediatelyRender: false, // Disable SSR to avoid hydration mismatch
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Update editor content when value changes externally
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  // Update editable state when disabled prop changes
  React.useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  if (!editor) {
    return null;
  }

  const MenuButton = ({ onClick, active, title, children }: any) => (
    <Tooltip title={title}>
      <IconButton
        size="small"
        onClick={onClick}
        disabled={disabled}
        sx={{
          backgroundColor: active ? 'action.selected' : 'transparent',
          '&:hover': {
            backgroundColor: active ? 'action.selected' : 'action.hover',
          },
        }}
      >
        {children}
      </IconButton>
    </Tooltip>
  );

  return (
    <Box sx={{ width: '100%' }}>
      {label && (
        <Box sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500, color: 'text.secondary' }}>
          {label}
        </Box>
      )}
      <Paper
        variant="outlined"
        sx={{
          border: disabled ? '1px solid rgba(0, 0, 0, 0.12)' : '1px solid rgba(0, 0, 0, 0.23)',
          borderRadius: 1,
          overflow: 'hidden',
          '&:hover': {
            borderColor: disabled ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.87)',
          },
          '&:focus-within': {
            borderColor: disabled ? 'rgba(0, 0, 0, 0.12)' : 'primary.main',
            borderWidth: disabled ? '1px' : '2px',
          },
        }}
      >
        {!disabled && (
          <>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.5,
                p: 1,
                backgroundColor: 'grey.50',
              }}
            >
              <MenuButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                active={editor.isActive('bold')}
                title="Bold"
              >
                <BoldIcon fontSize="small" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                active={editor.isActive('italic')}
                title="Italic"
              >
                <ItalicIcon fontSize="small" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                active={editor.isActive('code')}
                title="Code"
              >
                <CodeIcon fontSize="small" />
              </MenuButton>

              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

              <MenuButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                active={editor.isActive('bulletList')}
                title="Bullet List"
              >
                <BulletListIcon fontSize="small" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                active={editor.isActive('orderedList')}
                title="Numbered List"
              >
                <NumberedListIcon fontSize="small" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                active={editor.isActive('blockquote')}
                title="Quote"
              >
                <QuoteIcon fontSize="small" />
              </MenuButton>

              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

              <MenuButton
                onClick={() => editor.chain().focus().undo().run()}
                active={false}
                title="Undo"
              >
                <UndoIcon fontSize="small" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().redo().run()}
                active={false}
                title="Redo"
              >
                <RedoIcon fontSize="small" />
              </MenuButton>
            </Box>
            <Divider />
          </>
        )}
        <Box
          sx={{
            p: 2,
            minHeight: 200,
            maxHeight: 400,
            overflowY: 'auto',
            backgroundColor: disabled ? 'action.disabledBackground' : 'background.paper',
            '& .ProseMirror': {
              outline: 'none',
              '& p.is-editor-empty:first-child::before': {
                content: 'attr(data-placeholder)',
                float: 'left',
                color: 'text.disabled',
                pointerEvents: 'none',
                height: 0,
              },
              '& p': {
                marginTop: 0,
                marginBottom: '0.75em',
              },
              '& ul, & ol': {
                paddingLeft: '1.5em',
                marginBottom: '0.75em',
              },
              '& blockquote': {
                borderLeft: '3px solid',
                borderColor: 'divider',
                paddingLeft: '1em',
                marginLeft: 0,
                marginBottom: '0.75em',
                fontStyle: 'italic',
              },
              '& code': {
                backgroundColor: 'action.hover',
                padding: '0.2em 0.4em',
                borderRadius: '3px',
                fontFamily: 'monospace',
                fontSize: '0.9em',
              },
              '& pre': {
                backgroundColor: 'grey.900',
                color: 'common.white',
                padding: '1em',
                borderRadius: '4px',
                overflow: 'auto',
                marginBottom: '0.75em',
                '& code': {
                  backgroundColor: 'transparent',
                  padding: 0,
                  color: 'inherit',
                },
              },
            },
          }}
        >
          <EditorContent editor={editor} />
        </Box>
      </Paper>
      {helperText && (
        <Box sx={{ mt: 0.5, fontSize: '0.75rem', color: 'text.secondary' }}>
          {helperText}
        </Box>
      )}
    </Box>
  );
};
