/**
 * leads-trend-chart.tsx
 * Renders recent lead velocity as accessible SVG line chart.
 * Uses a local ViewModel hook to keep chart math separate from JSX
 * presentation. Assumes input values are already ordered from oldest to newest
 * day.
 */

const CHART_HEIGHT = 128;
const CHART_WIDTH = 288;
const CHART_PADDING = 12;

/**
 * Canonical daily point consumed by trend-chart behavior and rendering.
 */
export type LeadsTrendPoint = {
  date: string;
  total: number;
};

type LeadsTrendChartProps = {
  values: LeadsTrendPoint[];
};

type LeadsTrendChartViewModel = {
  labels: string[];
  points: string;
};

/**
 * Builds chart rendering data outside the presentational component so SVG math
 * stays isolated from markup concerns.
 *
 * @param {LeadsTrendPoint[]} values - Ordered daily totals used by trend chart.
 * @returns {LeadsTrendChartViewModel} Precomputed polyline points and axis labels.
 */
function useLeadsTrendChart(
  values: LeadsTrendPoint[],
): LeadsTrendChartViewModel {
  const maxTotal = Math.max(...values.map((value) => value.total), 1);
  const stepX =
    values.length > 1
      ? (CHART_WIDTH - CHART_PADDING * 2) / (values.length - 1)
      : 0;

  return {
    labels: values.map((value) => value.date.slice(5)),
    points: values
      .map((value, index) => {
        // Padding keeps endpoints inside viewBox so thick strokes do not clip.
        const x = CHART_PADDING + index * stepX;
        const y =
          CHART_HEIGHT -
          CHART_PADDING -
          (value.total / maxTotal) * (CHART_HEIGHT - CHART_PADDING * 2);

        return `${x},${y}`;
      })
      .join(" "),
  };
}

/**
 * Displays recent lead trend with stable scaling across low-volume datasets.
 *
 * @param {LeadsTrendChartProps} props - Ordered daily totals for chart line.
 * @returns {JSX.Element} Accessible trend chart section.
 */
export function LeadsTrendChart({ values }: LeadsTrendChartProps) {
  const viewModel = useLeadsTrendChart(values);

  return (
    <section
      aria-labelledby="trend-chart-title"
      className="terminal-panel p-6 lg:p-8"
    >
      <div className="space-y-2">
        <p className="terminal-eyebrow">Velocity</p>
        <h2
          id="trend-chart-title"
          className="text-2xl font-bold uppercase tracking-[-0.04em]"
        >
          Tendencia reciente
        </h2>
      </div>
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="mt-6 w-full"
        role="img"
        aria-label="Linea de leads durante los ultimos siete dias"
      >
        <polyline
          fill="none"
          stroke="var(--color-primary-container)"
          strokeWidth="4"
          points={viewModel.points}
        />
      </svg>
      <ol className="mt-4 grid grid-cols-7 gap-2 text-[10px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
        {viewModel.labels.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ol>
    </section>
  );
}
