import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/leads')({
  component: LeadsPage,
})

function LeadsPage() {
  return (
    <section className="space-y-3">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
        Operations
      </p>
      <h2 className="text-3xl font-semibold">Leads Directory</h2>
    </section>
  )
}
