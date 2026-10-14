export default function App() {
  return (
    <div className="grid h-full grid-cols-[360px_1fr]">
      <aside className="border-r border-border bg-surface-raised p-4">
        <h1 className="text-lg font-semibold">vimfluency</h1>
      </aside>
      <main className="bg-term-bg p-4 font-mono text-term-fg">
        <p>terminal</p>
      </main>
    </div>
  )
}
