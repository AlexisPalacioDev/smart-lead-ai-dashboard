import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <section className="space-y-3">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
        Executive Overview
      </p>
      <h2 className="text-3xl font-semibold">Dashboard</h2>
    </section>
  )
}
