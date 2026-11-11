import { useCallback, useEffect, useState } from 'react'
import { Kbd } from './components/Kbd'
import { CourseDrawer } from './components/Navigation/CourseDrawer'
import { CourseOutline } from './components/Navigation/CourseOutline'
import { LessonHeader } from './components/Navigation/LessonHeader'
import { ShellIntro } from './components/Terminal/ShellIntro'
import { ExerciseDetail } from './components/Sidebar/ExerciseDetail'
import { CompletionBanner, type Milestone } from './components/Terminal/CompletionBanner'
import { StatusLine } from './components/Terminal/StatusLine'
import { TerminalPane } from './components/Terminal/TerminalPane'
import { VimEditor } from './components/Terminal/VimEditor'
import { lessonDisplayKeys, unlockedKeys } from './engine/curriculum'
import { DEFAULT_NUMBERS } from './engine/exerciseSession'
import { isModifierKey } from './engine/lock'
import { isEngineKey } from './engine/vimInput'
import { allExercises, allLessons, categories, categoryOf, getExercise, lessonOf, nextExercise } from './exercises/registry'
import { useExerciseSession } from './hooks/useExerciseSession'
import { useProgress } from './hooks/useProgress'

export default function App() {
  const progress = useProgress()
  const exercise = (progress.lastId && getExercise(progress.lastId)) || allExercises[0]
  // Alla övningar i registret hör till en lektion i en kategori.
  const lesson = lessonOf(exercise)!
  const category = categoryOf(lesson)!
  const { containerRef, state, completed, blockedKey, overshot, needsEsc, reset, watch, demo } = useExerciseSession(
    exercise,
    progress.numbers,
  )

  const { markCompleted, select, setNumbers } = progress
  useEffect(() => {
    if (completed) markCompleted(exercise.id)
  }, [completed, exercise.id, markCompleted])

  // Steget i introt där man slår på radnummer: det man valde gäller sedan överallt.
  useEffect(() => {
    if (completed && exercise.savesNumberChoice && state) setNumbers(state.options)
  }, [completed, exercise.savesNumberChoice, state, setNumbers])

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

  const position = `${category.lessons.indexOf(lesson) + 1}/${category.lessons.length}`
  const step = { index: lesson.exercises.indexOf(exercise), total: lesson.exercises.length }
  const keysInPlay = lessonDisplayKeys(lesson)
  const done = allExercises.filter(({ id }) => progress.completed.has(id)).length
  // Caps Lock ger versaler: `J` är låst men `j` är inte det.
  const capsLock = blockedKey !== null && /^[A-Z]$/.test(blockedKey) && unlockedKeys(exercise).has(blockedKey.toLowerCase())

  // Den här övningen räknas som klar direkt, innan framsteget hunnit sparas.
  const doneIds = new Set(progress.completed)
  if (completed) doneIds.add(exercise.id)
  const allDone = (ids: { id: string }[]) => ids.every(({ id }) => doneIds.has(id))
  const next = nextExercise(exercise.id)
  // Efter sista övningen går Enter till den första som inte är klar.
  const target = next ?? allExercises.find(({ id }) => !doneIds.has(id))
  const nextId = target?.id
  // "Up next" säger vart Enter går, och står inte när Enter stannar i samma lektion eller kategori.
  const targetLesson = target && lessonOf(target)
  const targetCategory = targetLesson && categoryOf(targetLesson)
  const milestone: Milestone = allDone(allExercises)
    ? { kind: 'course', total: allExercises.length }
    : allDone(category.lessons.flatMap((l) => l.exercises))
      ? { kind: 'category', title: category.title, upNext: targetCategory !== category ? targetCategory?.title : undefined }
      : lesson.exercises.length > 1 && allDone(lesson.exercises)
        ? { kind: 'lesson', upNext: targetLesson !== lesson ? targetLesson?.title : undefined }
        : { kind: 'exercise' }

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

  // Medan "Watch it" spelar når inga tangenter editorn, utom `r` som avbryter
  // och börjar om. Tab lämnar editorn som vanligt, och utanför den fungerar
  // tangentbordet (knappar, kurslådan).
  const watching = demo !== null
  useEffect(() => {
    if (!watching) return
    const onKeyDown = (event: KeyboardEvent) => {
      // Demon skickar själv Enter och Esc till prompten.
      if (isEngineKey(event) || event.metaKey || isModifierKey(event)) return
      if (!(event.target instanceof Node) || !containerRef.current?.contains(event.target)) return
      event.stopPropagation()
      if (event.key === 'Tab') return
      event.preventDefault()
      if (event.key === 'r' && !event.ctrlKey && !event.altKey) reset()
    }
    document.addEventListener('keydown', onKeyDown, true)
    return () => document.removeEventListener('keydown', onKeyDown, true)
  }, [watching, containerRef, reset])

  return (
    <>
      <div inert={courseOpen} className="grid h-full grid-cols-[minmax(300px,380px)_minmax(0,1fr)]">
        <aside className="flex min-h-0 flex-col border-r border-border bg-surface-raised">
          <LessonHeader
            category={category.title}
            position={showShell ? undefined : position}
            done={done}
            total={allExercises.length}
            courseOpen={courseOpen}
            onOpenCourse={() => setCourseOpen(true)}
            numbers={showShell || exercise.numbers ? undefined : (progress.numbers ?? DEFAULT_NUMBERS)}
            onNumbersChange={setNumbers}
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
                  Each lesson unlocks the keys it teaches, and you keep everything you have learned. Keys that have not
                  come up yet, the mouse and the arrow keys are locked. If you get stuck, <Kbd>r</Kbd> starts the
                  exercise over.
                </p>
              </article>
            ) : (
              <ExerciseDetail
                lesson={lesson}
                exercise={exercise}
                step={step}
                keys={keysInPlay}
                hasEarlier={allLessons.indexOf(lesson) > 0}
                onReset={reset}
                onSolutionShown={() => progress.markAssisted(exercise.id)}
                onFocusEditor={focusEditor}
                onWatch={step.index === 0 ? watch : undefined}
                watching={watching}
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
                <CompletionBanner
                  milestone={milestone}
                  onReset={reset}
                  onNext={nextId ? () => select(nextId) : undefined}
                  nextLabel={next ? 'Next' : 'First unfinished'}
                />
              )}
              <StatusLine
                state={state}
                filename={exercise.activeFile}
                blockedKey={blockedKey}
                capsLock={capsLock}
                keysInPlay={keysInPlay}
                overshot={overshot && !completed}
                needsEsc={needsEsc}
                unfocused={!editorFocused && !completed && !watching}
                demo={demo}
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
