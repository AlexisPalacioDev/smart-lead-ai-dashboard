import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
      <article className="terminal-panel rise-in space-y-8 p-6 lg:p-10">
        <div className="space-y-4">
          <p className="terminal-eyebrow">Command Deck</p>
          <h2 className="terminal-heading">Dashboard</h2>
          <p className="terminal-copy">
            The command deck stays analytical: high-density funnel telemetry,
            source dominance, and seven-day motion before operators dive into
            the directory or AI brief.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="terminal-link terminal-link--primary" to="/leads">
            [ OPEN DIRECTORY ]
          </Link>
          <Link className="terminal-link" to="/ai-summary">
            [ INSPECT AI ]
          </Link>
        </div>
      </article>
      <aside className="grid gap-4">
        <article className="terminal-metric p-5">
          <p className="terminal-eyebrow">Primary Signal</p>
          <p className="terminal-metric-value">+142</p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Active funnel readings will land here in Task 6.
          </p>
        </article>
        <article className="terminal-panel--high p-5">
          <p className="terminal-eyebrow">System Note</p>
          <p className="mt-3 text-sm leading-7 text-[var(--color-foreground)]">
            Charts, KPI cards, and recent activity will inherit this surface
            model without soft SaaS gradients or rounded cards.
          </p>
        </article>
      </aside>
    </section>
  )
}
