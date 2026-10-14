import { javascript } from '@codemirror/lang-javascript'
import { useCallback, useEffect, useRef, useState } from 'react'
import { evaluate, onlyNeedsNormalMode, type EditorState } from '../engine/checks'
import { editorTheme } from '../engine/editorTheme'
import { deriveAllowedKeys } from '../engine/lock'
import { cursorTarget, overshotTarget } from '../engine/overshoot'
import { createSession, type Session } from '../engine/session'
import { activeContent } from '../exercises/define'
import type { Exercise } from '../exercises/types'

export function useExerciseSession(exercise: Exercise) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sessionRef = useRef<Session | null>(null)
  const [state, setState] = useState<EditorState | null>(null)
  const [completed, setCompleted] = useState(false)
  const [blockedKey, setBlockedKey] = useState<string | null>(null)
  const [overshot, setOvershot] = useState(false)

  const initialContent = activeContent(exercise)

  const clearFeedback = useCallback(() => {
    setCompleted(false)
    setBlockedKey(null)
    setOvershot(false)
  }, [])

  const reset = useCallback(() => {
    sessionRef.current?.reset()
    clearFeedback()
    sessionRef.current?.view.focus()
  }, [clearFeedback])

  useEffect(() => {
    const parent = containerRef.current
    if (!parent) return

    const session = createSession({
      parent,
      content: initialContent,
      start: exercise.start,
      extensions: [javascript({ jsx: true, typescript: true }), editorTheme],
      lineNumbers: true,
      allowedKeys: deriveAllowedKeys(exercise.solution, exercise.allowedKeys),
      // `r` är låst som alla andra tangenter som inte hör till övningen, men
      // används som nödutgång så att man aldrig fastnar efter att ha missat målet.
      onBlocked: (key) => (key === 'r' ? reset() : setBlockedKey(key)),
    })
    sessionRef.current = session

    const target = cursorTarget(exercise.checks)
    let previous = session.getState().cursor

    const sync = () => {
      const next = session.getState()
      setState(next)
      if (target && next.mode === 'normal') {
        const moved = next.cursor.line !== previous.line || next.cursor.col !== previous.col
        // Står kvar tills man startar om eller landar på målet.
        if (moved && overshotTarget(previous, next.cursor, target)) setOvershot(true)
        previous = next.cursor
      }
      if (evaluate(exercise.checks, next, initialContent).passed) setCompleted(true)
    }
    const unsubscribe = session.subscribe(sync)
    setState(session.getState())
    clearFeedback()
    session.view.focus()

    return () => {
      unsubscribe()
      session.destroy()
      sessionRef.current = null
    }
  }, [exercise, initialContent, reset, clearFeedback])

  // Texten är rätt men man står kvar i insert/visual: be om Esc.
  const needsEsc = !completed && state !== null && onlyNeedsNormalMode(exercise.checks, state, initialContent)

  return { containerRef, state, completed, blockedKey, overshot, needsEsc, reset }
}
