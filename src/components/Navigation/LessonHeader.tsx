interface Props {
  category: string
  /** Platsen i kategorin, t.ex. "1/4". Saknas i skalet. */
  position?: string
  done: number
  total: number
  courseOpen: boolean
  onOpenCourse: () => void
}

/** Överst i lektionen: var man är i kursen och hur långt man kommit. Öppnar kurslistan. */
export function LessonHeader({ category, position, done, total, courseOpen, onOpenCourse }: Props) {
  return (
    <header className="flex flex-col gap-3 border-b border-border px-6 pt-5 pb-4">
      <div className="flex items-center gap-3">
        <h1 className="font-mono text-[15px] font-semibold">vimfluency</h1>
        <div className="ml-auto flex items-center gap-2">
          <div
            role="progressbar"
            aria-label="Exercises completed"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={done}
            className="h-1 w-16 overflow-hidden rounded-full bg-border"
          >
            <div
              className="h-full origin-left bg-success transition-transform duration-200 ease-out"
              style={{ transform: `scaleX(${total === 0 ? 0 : done / total})` }}
            />
          </div>
          <span className="font-mono text-xs text-fg-muted">
            {done}/{total}
          </span>
        </div>
      </div>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={courseOpen}
        onClick={onOpenCourse}
        aria-label={`${category}${position ? ` ${position}` : ''}, show all exercises`}
        className="-mx-2 flex items-center gap-2 self-start rounded-panel px-2 py-1 text-sm text-fg-muted transition-colors duration-150 hover:bg-border hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
      >
        <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2.5 4h11M2.5 8h11M2.5 12h11" strokeLinecap="round" />
        </svg>
        <span>{category}</span>
        {position && <span className="font-mono text-xs">{position}</span>}
      </button>
    </header>
  )
}
