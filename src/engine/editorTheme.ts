import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import type { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { tags as t } from '@lezer/highlight'

// Temat bygger på samma CSS-variabler (tokens) som resten av sidan.
const theme = EditorView.theme(
  {
    '&': {
      height: '100%',
      color: 'var(--color-term-fg)',
      backgroundColor: 'var(--color-term-bg)',
      fontFamily: 'var(--font-mono)',
      fontSize: '15px',
    },
    '.cm-scroller': { fontFamily: 'var(--font-mono)', lineHeight: '1.6' },
    '.cm-content': { caretColor: 'var(--color-accent)', padding: '1rem 0' },
    '.cm-gutters': {
      backgroundColor: 'var(--color-term-bg)',
      color: 'var(--color-fg-muted)',
      border: 'none',
    },
    '.cm-lineNumbers .cm-gutterElement': { padding: '0 0.75rem 0 1rem' },
    '.cm-activeLine': { backgroundColor: 'var(--color-surface-raised)' },
    '.cm-activeLineGutter': {
      backgroundColor: 'var(--color-surface-raised)',
      color: 'var(--color-accent)',
    },
    '&.cm-focused': { outline: 'none' },
    '.cm-fat-cursor': {
      backgroundColor: 'var(--color-accent) !important',
      color: 'var(--color-term-bg) !important',
    },
    '&:not(.cm-focused) .cm-fat-cursor': {
      background: 'none !important',
      outline: '1px solid var(--color-accent)',
      color: 'inherit !important',
    },
    '.cm-panels': {
      backgroundColor: 'var(--color-surface-raised)',
      color: 'var(--color-fg)',
      borderTop: '1px solid var(--color-border)',
    },
    '.cm-panels input': {
      backgroundColor: 'transparent',
      color: 'var(--color-fg)',
      fontFamily: 'var(--font-mono)',
      outline: 'none',
      border: 'none',
    },
    '.cm-selectionBackground': { backgroundColor: 'var(--color-border) !important' },
  },
  { dark: true },
)

const highlight = HighlightStyle.define([
  { tag: [t.keyword, t.modifier], color: 'var(--color-accent)' },
  { tag: [t.string, t.special(t.string)], color: 'var(--color-success)' },
  { tag: [t.number, t.bool, t.null], color: 'var(--color-fg)' },
  { tag: [t.comment], color: 'var(--color-fg-muted)', fontStyle: 'italic' },
  { tag: [t.definition(t.variableName), t.function(t.variableName)], color: 'var(--color-fg)' },
  { tag: [t.tagName, t.typeName], color: 'var(--color-accent)' },
])

export const editorTheme: Extension = [theme, syntaxHighlighting(highlight)]
