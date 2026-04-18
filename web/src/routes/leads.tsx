import { Link, createFileRoute } from "@tanstack/react-router";

/**
 * leads.tsx
 * Registers the Leads Directory placeholder route before the operational table
 * and modal CRUD flows are implemented. Depends on shared shell styling.
 */

export const Route = createFileRoute("/leads")({
  component: LeadsPage,
});

function LeadsPage() {
  return (
    <section className="space-y-6">
      <article className="terminal-panel rise-in space-y-6 p-6 lg:p-10">
        <div className="space-y-4">
          <p className="terminal-eyebrow">Operations Grid</p>
          <h2 className="terminal-heading">Leads Directory</h2>
          <p className="terminal-copy">
            This route becomes the operational grid: dense records, fast source
            filtering, newest-first ordering, and modal CRUD built from the
            register-lead reference.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="terminal-link terminal-link--primary" to="/leads">
            [ NEW LEAD ]
          </Link>
          <Link className="terminal-link" to="/ai-summary">
            [ REVIEW AI ]
          </Link>
        </div>
      </article>
      <div className="grid gap-4 lg:grid-cols-3">
        <article className="terminal-metric p-5 lg:col-span-2">
          <p className="terminal-eyebrow">Table Surface</p>
          <p className="mt-3 text-sm leading-7 text-[var(--color-foreground)]">
            Task 7 replaces this placeholder with the high-density leads table,
            tonal row separation, and modal triggers.
          </p>
        </article>
        <article className="terminal-panel--high p-5">
          <p className="terminal-eyebrow">Filters</p>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            Search, source, and date-range controls will live in a dedicated
            block above the grid.
          </p>
        </article>
      </div>
    </section>
  );
}
