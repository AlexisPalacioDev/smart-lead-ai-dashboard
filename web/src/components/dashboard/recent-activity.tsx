/**
 * recent-activity.tsx
 * Renders compact list of most recent lead records for operator orientation.
 * Assumes input items are already sorted from newest to oldest.
 */

type RecentActivityProps = {
  items: Array<{
    id: string;
    name: string;
    source: string;
    product: string;
    createdAt: string;
  }>;
};

/**
 * Displays newest leads in dense operational feed.
 *
 * @param {RecentActivityProps} props - Ordered list of recent lead summaries.
 * @returns {JSX.Element} Recent activity panel.
 */
export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <section
      aria-labelledby="recent-activity-title"
      className="terminal-panel--high p-6 lg:p-8"
    >
      <div className="space-y-2">
        <p className="terminal-eyebrow">Flujo reciente</p>
        <h2
          id="recent-activity-title"
          className="text-2xl font-bold uppercase tracking-[-0.04em]"
        >
          Actividad reciente
        </h2>
      </div>
      <ul className="mt-6 grid gap-4 lg:grid-cols-2">
        {items.map((item) => (
          <li key={item.id} className="terminal-metric space-y-2 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-base font-bold uppercase tracking-[0.04em]">
                  {item.name}
                </p>
                <p className="text-sm text-[var(--color-muted)]">
                  {item.source} / {item.product}
                </p>
              </div>
              <time
                className="text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]"
                dateTime={item.createdAt}
              >
                {item.createdAt.slice(5, 10)}
              </time>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
