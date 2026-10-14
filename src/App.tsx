import { useEffect } from 'react'
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
  const { containerRef, state, completed, reset } = useExerciseSession(exercise)

  const { markCompleted } = progress
  useEffect(() => {
    if (completed) markCompleted(exercise.id)
  }, [completed, exercise.id, markCompleted])

  const next = nextExercise(exercise.id)

  return (
    <div className="grid h-full grid-cols-[360px_1fr]">
      <aside className="flex min-h-0 flex-col overflow-y-auto border-r border-border bg-surface-raised">
        <h1 className="px-4 pt-4 text-xl font-semibold">vimfluency</h1>
        <ExerciseList
          categories={categories}
          selectedId={exercise.id}
          completedIds={progress.completed}
          onSelect={progress.select}
        />
        <ExerciseDetail exercise={exercise} onReset={reset} />
      </aside>
      <main className="min-w-0">
        <TerminalPane filename={exercise.activeFile}>
          <VimEditor containerRef={containerRef} />
          {completed && state && (
            <CompletionBanner
              onReset={reset}
              onNext={next ? () => progress.select(next.id) : undefined}
            />
          )}
          <StatusLine state={state} />
        </TerminalPane>
      </main>
    </div>
  )
}
