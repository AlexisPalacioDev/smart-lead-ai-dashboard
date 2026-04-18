/**
 * kpi-grid.tsx
 * Renders dashboard KPI cards for high-signal business metrics.
 * Assumes caller already transformed raw data into display-ready strings.
 */

export type KpiCard = {
  label: string;
  value: string;
  description: string;
};

type KpiGridProps = {
  items: KpiCard[];
};

/**
 * Displays KPI cards in responsive dashboard grid.
 *
 * @param {KpiGridProps} props - Display-ready KPI card models.
 * @returns {JSX.Element} Responsive grid of metric cards.
 */
export function KpiGrid({ items }: KpiGridProps) {
  return (
    <section
      aria-label="Resumen ejecutivo"
      className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4"
    >
      {items.map((item) => (
        <article
          key={item.label}
          className="terminal-metric space-y-3 p-5 lg:p-6"
        >
          <p className="terminal-eyebrow">{item.label}</p>
          <p className="terminal-metric-value">{item.value}</p>
          <p className="text-sm leading-7 text-[var(--color-muted)]">
            {item.description}
          </p>
        </article>
      ))}
    </section>
  );
}
