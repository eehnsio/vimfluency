import { useCallback, useEffect, useState } from 'react'
import { CourseDrawer } from './components/Navigation/CourseDrawer'
import { CourseOutline } from './components/Navigation/CourseOutline'
import { LessonHeader } from './components/Navigation/LessonHeader'
import { ShellIntro } from './components/Terminal/ShellIntro'
import { ExerciseDetail } from './components/Sidebar/ExerciseDetail'
import { CompletionBanner } from './components/Terminal/CompletionBanner'
import { StatusLine } from './components/Terminal/StatusLine'
import { TerminalPane } from './components/Terminal/TerminalPane'
import { VimEditor } from './components/Terminal/VimEditor'
import { displayKeys, isModifierKey } from './engine/lock'
import { allExercises, categories, getExercise, nextExercise } from './exercises/registry'
import { useExerciseSession } from './hooks/useExerciseSession'
import { useProgress } from './hooks/useProgress'

export default function App() {
  const progress = useProgress()
  const exercise = (progress.lastId && getExercise(progress.lastId)) || allExercises[0]
  const { containerRef, state, completed, blockedKey, overshot, needsEsc, reset } = useExerciseSession(exercise)

  const { markCompleted, select } = progress
  useEffect(() => {
    if (completed) markCompleted(exercise.id)
  }, [completed, exercise.id, markCompleted])

  const next = nextExercise(exercise.id)
  const nextId = next?.id

  // Första övningen börjar i ett skal där man måste skriva `nvim`.
  const showShell = exercise.id === allExercises[0].id && !progress.openedNvim
  const { openNvim } = progress

  const focusEditor = useCallback(() => {
    containerRef.current?.querySelector<HTMLElement>('.cm-content')?.focus()
  }, [containerRef])

  useEffect(() => {
    if (!showShell) focusEditor()
  }, [showShell, focusEditor])

  // Utan fokus i editorn händer ingenting när man skriver. Säg det, och låt Esc ta en tillbaka.
  const [editorFocused, setEditorFocused] = useState(true)
  useEffect(() => {
    const inEditor = (target: EventTarget | null) =>
      target instanceof Node && containerRef.current?.contains(target) === true
    const onFocusIn = (event: FocusEvent) => setEditorFocused(inEditor(event.target))
    const onFocusOut = (event: FocusEvent) => setEditorFocused(inEditor(event.relatedTarget))
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
    return () => {
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
    }
  }, [containerRef])

  const [courseOpen, setCourseOpen] = useState(false)

  useEffect(() => {
    if (showShell || courseOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || containerRef.current?.contains(event.target as Node)) return
      event.preventDefault()
      focusEditor()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [showShell, courseOpen, containerRef, focusEditor])
  const closeCourse = () => {
    setCourseOpen(false)
    if (!showShell) focusEditor()
  }
  // Samma övning igen skapar ingen ny session, så fokus måste tillbaka till editorn.
  const pick = (id: string) => {
    select(id)
    closeCourse()
  }

  const category = categories.find((c) => c.exercises.includes(exercise))
  const position = category && `${category.exercises.indexOf(exercise) + 1}/${category.exercises.length}`
  const done = allExercises.filter(({ id }) => progress.completed.has(id)).length

  // När övningen är klar tar bannern över tangenterna: Enter går vidare, r
  // börjar om och allt annat är låst.
  useEffect(() => {
    if (!completed) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.target instanceof Element && event.target.closest('button, a, summary')) return
      if (isModifierKey(event)) return
      event.preventDefault()
      event.stopPropagation()
      if (event.key === 'Enter' && nextId) select(nextId)
      else if (event.key === 'r') reset()
    }
    document.addEventListener('keydown', onKeyDown, true)
    return () => document.removeEventListener('keydown', onKeyDown, true)
  }, [completed, nextId, select, reset])

  return (
    <>
      <div inert={courseOpen} className="grid h-full grid-cols-[380px_minmax(0,1fr)]">
        <aside className="flex min-h-0 flex-col border-r border-border bg-surface-raised">
          <LessonHeader
            category={category?.title ?? ''}
            position={showShell ? undefined : position}
            done={done}
            total={allExercises.length}
            courseOpen={courseOpen}
            onOpenCourse={() => setCourseOpen(true)}
          />
          <div className="min-h-0 flex-1 overflow-y-auto">
            {showShell ? (
              <article className="flex flex-col gap-3 p-6">
                <h2 className="text-xl font-semibold">Open the editor</h2>
                <p className="text-[15px] leading-relaxed text-fg-muted">
                  Every exercise runs in a real Vim editor. Start it from the terminal on the right, the same way you
                  would on your own machine.
                </p>
                <p className="text-[15px] leading-relaxed text-fg-muted">
                  Each exercise unlocks only the keys it teaches. Everything else, including the mouse, is locked. If
                  you get stuck, <kbd className="rounded bg-term-bg px-1 font-mono text-term-fg">r</kbd> starts the
                  exercise over.
                </p>
              </article>
            ) : (
              <ExerciseDetail
                exercise={exercise}
                onReset={reset}
                onSolutionShown={() => progress.markAssisted(exercise.id)}
                onFocusEditor={focusEditor}
              />
            )}
          </div>
        </aside>
        <main className="min-w-0">
          <TerminalPane filename={showShell ? undefined : exercise.activeFile}>
            {showShell && <ShellIntro onOpenEditor={openNvim} />}
            {/* Editorn är monterad hela tiden så att sessionen finns när skalet stängs. */}
            <div className={showShell ? 'hidden' : 'flex min-h-0 flex-1 flex-col'}>
              <VimEditor containerRef={containerRef} />
              {completed && (
                <CompletionBanner onReset={reset} onNext={nextId ? () => select(nextId) : undefined} />
              )}
              <StatusLine
                state={state}
                filename={exercise.activeFile}
                blockedKey={blockedKey}
                keysInPlay={displayKeys(exercise.solution, exercise.allowedKeys)}
                overshot={overshot && !completed}
                needsEsc={needsEsc}
                unfocused={!editorFocused && !completed}
              />
            </div>
          </TerminalPane>
        </main>
      </div>
      {courseOpen && (
        <CourseDrawer onClose={closeCourse}>
          <CourseOutline
            categories={categories}
            selectedId={exercise.id}
            completedIds={progress.completed}
            assistedIds={progress.assisted}
            onSelect={pick}
          />
        </CourseDrawer>
      )}
    </>
  )
}
