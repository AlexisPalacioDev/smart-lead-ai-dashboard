import type {
  LeadsDirectoryFilterChange,
  LeadsDirectoryFiltersViewModel,
} from "../../features/leads/types/leads-directory-view-model";

/**
 * leads-filters.tsx
 * Renders controlled filter inputs for the Leads Directory. Behavior stays in
 * the route ViewModel hook; this component only emits user intent.
 */

type LeadsFiltersProps = {
  filters: LeadsDirectoryFiltersViewModel;
  onChange: (next: LeadsDirectoryFilterChange) => void;
};

/**
 * Renders search, source, and date-range filters.
 *
 * @param {LeadsFiltersProps} props - Current filter values and change handler.
 * @returns {JSX.Element} Controlled filter toolbar.
 */
export function LeadsFilters({ filters, onChange }: LeadsFiltersProps) {
  return (
    <section className="terminal-panel--high grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
      <label className="flex flex-col gap-2">
        <span className="terminal-eyebrow">Buscar lead</span>
        <input
          id="leads-filter-query"
          name="leads-filter-query"
          aria-label="Buscar lead"
          type="search"
          value={filters.query}
          onChange={(event) => onChange({ query: event.target.value })}
          className="bg-[var(--color-surface-highest)] px-3 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--color-primary-container)]"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="terminal-eyebrow">Fuente</span>
        <select
          id="leads-filter-source"
          name="leads-filter-source"
          aria-label="Fuente"
          value={filters.source}
          onChange={(event) =>
            onChange({
              source: event.target.value as LeadsDirectoryFiltersViewModel["source"],
            })
          }
          className="bg-[var(--color-surface-highest)] px-3 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--color-primary-container)]"
        >
          {filters.sourceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2">
        <span className="terminal-eyebrow">Desde</span>
        <input
          id="leads-filter-start-date"
          name="leads-filter-start-date"
          aria-label="Fecha inicial"
          type="date"
          value={filters.startDate}
          onChange={(event) => onChange({ startDate: event.target.value })}
          className="bg-[var(--color-surface-highest)] px-3 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--color-primary-container)]"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="terminal-eyebrow">Hasta</span>
        <input
          id="leads-filter-end-date"
          name="leads-filter-end-date"
          aria-label="Fecha final"
          type="date"
          value={filters.endDate}
          onChange={(event) => onChange({ endDate: event.target.value })}
          className="bg-[var(--color-surface-highest)] px-3 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--color-primary-container)]"
        />
      </label>
    </section>
  );
}
