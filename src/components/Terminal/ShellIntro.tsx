import { useEffect, useState } from 'react'

interface Props {
  onOpenEditor: () => void
}

const EDITORS = ['nvim', 'vim']

/**
 * Första mötet: ett fejkat terminalskal där man måste skriva `nvim` för att
 * öppna editorn. Bara tecken, Backspace och Enter gör något här.
 */
export function ShellIntro({ onOpenEditor }: Props) {
  const [typed, setTyped] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Capture-fasen och stopPropagation så att den dolda editorn aldrig ser tangenterna.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      event.stopPropagation()
      if (event.key === 'Tab' || event.key === ' ') event.preventDefault()

      if (event.key === 'Enter') {
        event.preventDefault()
        const command = typed.trim()
        if (EDITORS.includes(command)) {
          onOpenEditor()
        } else if (command !== '') {
          setError(`zsh: command not found: ${command}`)
          setTyped('')
        }
      } else if (event.key === 'Backspace') {
        event.preventDefault()
        setError(null)
        setTyped((value) => value.slice(0, -1))
      } else if (event.key.length === 1) {
        event.preventDefault()
        setError(null)
        setTyped((value) => value + event.key)
      }
    }
    document.addEventListener('keydown', onKeyDown, true)
    return () => document.removeEventListener('keydown', onKeyDown, true)
  }, [typed, onOpenEditor])

  return (
    <div className="flex-1 overflow-y-auto p-6 font-mono text-[15px] leading-relaxed">
      <p className="text-success">Welcome to vimfluency.</p>
      <p className="mt-4">
        This is a terminal. <strong>Don&apos;t be scared, you&apos;ll like it here!</strong>
      </p>
      <p className="mt-2 text-fg-muted">
        Developers have used editors like this for decades because everything happens from the
        keyboard. You&apos;ll learn it one small step at a time, and you can always start an exercise
        over.
      </p>
      <p className="mt-4">
        First, let&apos;s open the editor. Type{' '}
        <code className="rounded bg-surface-raised px-1.5 text-accent">nvim</code> and press{' '}
        <kbd className="rounded bg-surface-raised px-1.5">Enter</kbd>.
      </p>
      <p className="mt-6" data-testid="prompt">
        <span className="text-accent">~/vimfluency</span> <span className="text-success">$</span> {typed}
        <span aria-hidden className="ml-px inline-block h-[1.1em] w-[0.6em] translate-y-[0.2em] bg-term-fg" />
      </p>
      {error && (
        <p role="alert" className="mt-1 text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
