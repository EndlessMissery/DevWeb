import { forwardRef, useImperativeHandle } from 'react'
import { useEditor, useEditorState, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import './RichTextEditor.css'

const EXTENSIONS = [
  StarterKit.configure({
    blockquote: false,
    code: false,
    codeBlock: false,
    heading: false,
    horizontalRule: false,
    strike: false,
    link: false,
    underline: false,
  }),
]

function ToolbarButton({ onClick, active, disabled, label, children }) {
  return (
    <button
      type="button"
      className={`rich-text-editor__btn ${active ? 'rich-text-editor__btn--active' : ''}`}
      onMouseDown={(e) => {
        e.preventDefault()
        onClick()
      }}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
    >
      {children}
    </button>
  )
}

const RichTextEditor = forwardRef(function RichTextEditor({ placeholder, labels = {}, className = '' }, ref) {
  const editor = useEditor(
    {
      extensions: [...EXTENSIONS, Placeholder.configure({ placeholder: placeholder || '' })],
      editorProps: { attributes: { class: 'rich-text-editor__content' } },
    },
    []
  )

  const state = useEditorState({
    editor,
    selector: (ctx) =>
      ctx.editor
        ? {
            bold: ctx.editor.isActive('bold'),
            italic: ctx.editor.isActive('italic'),
            bulletList: ctx.editor.isActive('bulletList'),
            orderedList: ctx.editor.isActive('orderedList'),
            canUndo: ctx.editor.can().undo(),
            canRedo: ctx.editor.can().redo(),
          }
        : null,
  })

  useImperativeHandle(
    ref,
    () => ({
      getHTML: () => editor?.getHTML() || '',
      isEmpty: () => editor?.isEmpty ?? true,
      clear: () => editor?.commands.clearContent(),
    }),
    [editor]
  )

  if (!editor || !state) return null

  return (
    <div className={`rich-text-editor ${className}`}>
      <div className="rich-text-editor__toolbar">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={state.bold} label={labels.bold || 'Bold'}>
          <b>B</b>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={state.italic} label={labels.italic || 'Italic'}>
          <i>I</i>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={state.bulletList} label={labels.bulletList || 'Bullet list'}>
          •—
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={state.orderedList} label={labels.orderedList || 'Numbered list'}>
          1.
        </ToolbarButton>
        <span className="rich-text-editor__sep" />
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!state.canUndo} label={labels.undo || 'Undo'}>
          ↶
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!state.canRedo} label={labels.redo || 'Redo'}>
          ↷
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
})

export default RichTextEditor
