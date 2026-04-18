import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ai-summary')({
  component: AISummaryPage,
})

function AISummaryPage() {
  return (
    <section className="space-y-3">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
        Intelligence
      </p>
      <h2 className="text-3xl font-semibold">AI Summary</h2>
    </section>
  )
}
