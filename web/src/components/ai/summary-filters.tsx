import type { SummaryFilters as SummaryFilterValues } from "../../features/ai/application/summary-ports";

/**
 * summary-filters.tsx
 * Renders controlled AI Summary filters and the primary generate action.
 */

type SummaryFiltersProps = {
  filters: SummaryFilterValues;
  sourceOptions: Array<{
    label: string;
    value: SummaryFilterValues["source"];
  }>;
  leadCount: number;
  isLoading: boolean;
  onChange: (next: Partial<SummaryFilterValues>) => void;
  onGenerate: () => void;
};

export function SummaryFilters({
  filters,
  sourceOptions,
  leadCount,
  isLoading,
  onChange,
  onGenerate,
}: SummaryFiltersProps) {
  return (
    <section className="terminal-panel--high space-y-5 p-5 lg:p-6">
      <div className="space-y-2">
        <p className="terminal-eyebrow">Alcance del resumen</p>
        <p className="terminal-copy">
          Filtra subconjunto de leads antes de pedir sintesis ejecutiva.
        </p>
        <p className="terminal-eyebrow">{leadCount} leads disponibles</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2" htmlFor="summary-source">
          <span className="terminal-eyebrow">Fuente</span>
          <select
            id="summary-source"
            name="summary-source"
            aria-label="Fuente"
            value={filters.source}
            onChange={(event) =>
              onChange({
                source: event.target.value as SummaryFilterValues["source"],
              })
            }
            className="bg-[var(--color-surface-highest)] px-3 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--color-primary-container)]"
          >
            {sourceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2" htmlFor="summary-start-date">
          <span className="terminal-eyebrow">Desde</span>
          <input
            id="summary-start-date"
            name="summary-start-date"
            aria-label="Fecha inicial"
            type="date"
            value={filters.startDate}
            onChange={(event) => onChange({ startDate: event.target.value })}
            className="bg-[var(--color-surface-highest)] px-3 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--color-primary-container)]"
          />
        </label>
        <label className="flex flex-col gap-2" htmlFor="summary-end-date">
          <span className="terminal-eyebrow">Hasta</span>
          <input
            id="summary-end-date"
            name="summary-end-date"
            aria-label="Fecha final"
            type="date"
            value={filters.endDate}
            onChange={(event) => onChange({ endDate: event.target.value })}
            className="bg-[var(--color-surface-highest)] px-3 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--color-primary-container)]"
          />
        </label>
      </div>
      <button
        type="button"
        onClick={onGenerate}
        disabled={isLoading || leadCount === 0}
        className="terminal-link terminal-link--primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        [GENERAR RESUMEN]
      </button>
    </section>
  );
}
