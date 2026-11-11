import { useCallback, useEffect, useRef, useState } from 'react'
import { evaluate, onlyNeedsNormalMode, type SessionState } from '../engine/checks'
import { createExerciseSession, startNumbers } from '../engine/exerciseSession'
import { parseKeys } from '../engine/keys'
import { createOvershootTracker, cursorTarget } from '../engine/overshoot'
import type { Session } from '../engine/session'
import { activeContent } from '../exercises/define'
import type { Exercise, NumberOptions } from '../exercises/types'

/** Tempot i "Watch it": en tangent i taget, och en paus på slutet innan övningen börjar om. */
export const DEMO_STEP_MS = 450
export const DEMO_HOLD_MS = 1500

export function useExerciseSession(exercise: Exercise, numbers?: NumberOptions) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sessionRef = useRef<Session | null>(null)
  const [state, setState] = useState<SessionState | null>(null)
  const [completed, setCompleted] = useState(false)
  const [blockedKey, setBlockedKey] = useState<string | null>(null)
  const [overshot, setOvershot] = useState(false)
  // Tangenterna som "Watch it" visat hittills. `null` när ingen demo spelas.
  const [demo, setDemo] = useState<string[] | null>(null)
  const demoRef = useRef(false)
  const demoTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const initialContent = activeContent(exercise)
  // Sessionen byggs inte om när valet ändras (då skulle övningen börja om), se effekten nedan.
  const numbersRef = useRef(numbers)
  useEffect(() => {
    numbersRef.current = numbers
  })

  const clearFeedback = useCallback(() => {
    setCompleted(false)
    setBlockedKey(null)
    setOvershot(false)
  }, [])

  const stopDemo = useCallback(() => {
    clearTimeout(demoTimer.current)
    demoRef.current = false
    setDemo(null)
  }, [])

  const reset = useCallback(() => {
    stopDemo()
    sessionRef.current?.reset()
    clearFeedback()
    sessionRef.current?.view.focus()
  }, [clearFeedback, stopDemo])

  /**
   * Spelar upp referenslösningen tangent för tangent i editorn, håller kvar
   * resultatet en stund och börjar sedan om. Räknas inte som klarad.
   */
  const watch = useCallback(() => {
    const session = sessionRef.current
    if (!session || demoRef.current) return
    const tokens = parseKeys(exercise.solution)
    session.reset()
    clearFeedback()
    demoRef.current = true
    setDemo([])
    let index = 0
    const step = () => {
      if (index < tokens.length) {
        const token = tokens[index++]
        session.sendKeys(token === '<' ? '<lt>' : token)
        setDemo((shown) => [...(shown ?? []), token])
        demoTimer.current = setTimeout(step, DEMO_STEP_MS)
      } else {
        demoTimer.current = setTimeout(() => {
          session.reset()
          stopDemo()
          session.view.focus()
        }, DEMO_HOLD_MS)
      }
    }
    demoTimer.current = setTimeout(step, DEMO_STEP_MS)
  }, [exercise.solution, clearFeedback, stopDemo])

  useEffect(() => {
    const parent = containerRef.current
    if (!parent) return

    const session = createExerciseSession(exercise, {
      parent,
      // `r` är låst som alla andra tangenter som inte hör till övningen, men
      // används som nödutgång så att man aldrig fastnar efter att ha missat målet.
      onBlocked: (key) => (key === 'r' ? reset() : setBlockedKey(key)),
      numberOptions: numbersRef.current,
    })
    sessionRef.current = session

    const trackOvershoot = createOvershootTracker(cursorTarget(exercise.checks), session.getState().cursor)

    const onSessionChange = () => {
      const next = session.getState()
      setState(next)
      // Under en demo är det inte användaren som flyttar sig eller löser något.
      if (demoRef.current) return
      // Varningen står kvar tills man startar om eller landar på målet.
      if (trackOvershoot(next.cursor, next.mode)) setOvershot(true)
      if (evaluate(exercise.checks, next, initialContent).passed) setCompleted(true)
    }
    const unsubscribe = session.subscribe(onSessionChange)
    setState(session.getState())
    clearFeedback()
    session.view.focus()

    return () => {
      stopDemo()
      unsubscribe()
      session.destroy()
      sessionRef.current = null
    }
  }, [exercise, initialContent, reset, clearFeedback, stopDemo])

  // Nytt val i rubriken gäller direkt, utan att övningen börjar om.
  useEffect(() => {
    if (!numbers || exercise.numbers) return
    sessionRef.current?.setNumberOptions(startNumbers(exercise, numbers))
  }, [numbers, exercise])

  // Texten är rätt men man står kvar i insert/visual: be om Esc.
  const needsEsc = !completed && state !== null && onlyNeedsNormalMode(exercise.checks, state, initialContent)

  return { containerRef, state, completed, blockedKey, overshot, needsEsc, reset, watch, demo }
}
