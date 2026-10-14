import { useCallback, useEffect, useRef, useState } from 'react'
import { evaluate, onlyNeedsNormalMode, type SessionState } from '../engine/checks'
import { createExerciseSession } from '../engine/exerciseSession'
import { createOvershootTracker, cursorTarget } from '../engine/overshoot'
import type { Session } from '../engine/session'
import { activeContent } from '../exercises/define'
import type { Exercise } from '../exercises/types'

export function useExerciseSession(exercise: Exercise) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sessionRef = useRef<Session | null>(null)
  const [state, setState] = useState<SessionState | null>(null)
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

    const session = createExerciseSession(exercise, {
      parent,
      // `r` är låst som alla andra tangenter som inte hör till övningen, men
      // används som nödutgång så att man aldrig fastnar efter att ha missat målet.
      onBlocked: (key) => (key === 'r' ? reset() : setBlockedKey(key)),
    })
    sessionRef.current = session

    const trackOvershoot = createOvershootTracker(cursorTarget(exercise.checks), session.getState().cursor)

    const onSessionChange = () => {
      const next = session.getState()
      setState(next)
      // Varningen står kvar tills man startar om eller landar på målet.
      if (trackOvershoot(next.cursor, next.mode)) setOvershot(true)
      if (evaluate(exercise.checks, next, initialContent).passed) setCompleted(true)
    }
    const unsubscribe = session.subscribe(onSessionChange)
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
