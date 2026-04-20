/**
 * source-bar-chart.tsx
 * Renders accessible source distribution chart using semantic list markup and
 * proportional bars instead of canvas-based rendering.
 */

type SourceBarChartProps = {
  items: Array<{ label: string; value: number }>;
};

/**
 * Displays per-source lead totals with proportional bars.
 *
 * @param {SourceBarChartProps} props - Source labels and totals to compare.
 * @returns {JSX.Element} Accessible source comparison chart.
 */
export function SourceBarChart({ items }: SourceBarChartProps) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <section
      aria-labelledby="source-bar-chart-title"
      className="terminal-panel p-6 lg:p-8"
    >
      <div className="space-y-2">
        <p className="terminal-eyebrow">Distribucion</p>
        <h2
          id="source-bar-chart-title"
          className="text-2xl font-bold uppercase tracking-[-0.04em]"
        >
          Leads por fuente
        </h2>
      </div>
      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <li key={item.label} className="space-y-2">
            <div className="flex items-center justify-between gap-4 text-sm uppercase tracking-[0.12em]">
              <span>{item.label}</span>
              <span className="font-mono text-[var(--color-primary)]">
                {item.value}
              </span>
            </div>
            <div className="h-3 bg-white/8">
              <div
                className="h-3 bg-[var(--color-primary-container)]"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
