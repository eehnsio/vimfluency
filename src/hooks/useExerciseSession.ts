import { javascript } from '@codemirror/lang-javascript'
import { useCallback, useEffect, useRef, useState } from 'react'
import { evaluate, type EditorState } from '../engine/checks'
import { editorTheme } from '../engine/editorTheme'
import { createSession, type Session } from '../engine/session'
import type { Exercise } from '../exercises/types'

export function useExerciseSession(exercise: Exercise) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sessionRef = useRef<Session | null>(null)
  const [state, setState] = useState<EditorState | null>(null)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    const parent = containerRef.current
    if (!parent) return
    const file = exercise.files.find((f) => f.path === exercise.activeFile)!

    const session = createSession({
      parent,
      content: file.content,
      start: exercise.start,
      extensions: [javascript({ jsx: true, typescript: true }), editorTheme],
    })
    sessionRef.current = session

    const sync = () => {
      const next = session.getState()
      setState(next)
      if (evaluate(exercise.checks, next, file.content).passed) setCompleted(true)
    }
    const unsubscribe = session.subscribe(sync)
    setState(session.getState())
    setCompleted(false)
    session.view.focus()

    return () => {
      unsubscribe()
      session.destroy()
      sessionRef.current = null
    }
  }, [exercise])

  const reset = useCallback(() => {
    sessionRef.current?.reset()
    setCompleted(false)
    sessionRef.current?.view.focus()
  }, [])

  return { containerRef, state, completed, reset }
}
