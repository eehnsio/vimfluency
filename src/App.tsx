import { useEffect } from 'react'
import { ShellIntro } from './components/Terminal/ShellIntro'
import { ExerciseDetail } from './components/Sidebar/ExerciseDetail'
import { ExerciseList } from './components/Sidebar/ExerciseList'
import { CompletionBanner } from './components/Terminal/CompletionBanner'
import { StatusLine } from './components/Terminal/StatusLine'
import { TerminalPane } from './components/Terminal/TerminalPane'
import { VimEditor } from './components/Terminal/VimEditor'
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

  useEffect(() => {
    if (showShell) return
    containerRef.current?.querySelector<HTMLElement>('.cm-content')?.focus()
  }, [showShell, containerRef])

  // När övningen är klar tar bannern över tangenterna: Enter går vidare, r
  // börjar om och allt annat är låst.
  useEffect(() => {
    if (!completed) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.target instanceof Element && event.target.closest('button, a, summary')) return
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(event.key)) return
      event.preventDefault()
      event.stopPropagation()
      if (event.key === 'Enter' && nextId) select(nextId)
      else if (event.key === 'r') reset()
    }
    document.addEventListener('keydown', onKeyDown, true)
    return () => document.removeEventListener('keydown', onKeyDown, true)
  }, [completed, nextId, select, reset])

  return (
    <div className="grid h-full grid-cols-[360px_1fr]">
      <aside className="flex min-h-0 flex-col overflow-y-auto border-r border-border bg-surface-raised">
        <h1 className="px-4 pt-4 text-xl font-semibold">vimfluency</h1>
        <ExerciseDetail
          exercise={exercise}
          onReset={reset}
          onSolutionShown={() => progress.markAssisted(exercise.id)}
        />
        <ExerciseList
          categories={categories}
          selectedId={exercise.id}
          completedIds={progress.completed}
          assistedIds={progress.assisted}
          onSelect={select}
        />
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
              overshot={overshot && !completed}
              needsEsc={needsEsc}
            />
          </div>
        </TerminalPane>
      </main>
    </div>
  )
}
