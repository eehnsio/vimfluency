import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  failed: boolean
}

/**
 * Fångar fel i renderingen och visar ett begripligt meddelande istället för en
 * vit sida. Framsteg ligger i `localStorage`, så en omladdning förlorar inget.
 * React loggar felet själv, så `getDerivedStateFromError` räcker för fallbacken.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div role="alert" className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="text-fg-muted">Your progress is saved. Reload the page to continue.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-panel border border-border px-3 py-1 transition-colors duration-150 hover:bg-border focus-visible:outline-2 focus-visible:outline-accent"
        >
          Reload
        </button>
      </div>
    )
  }
}
