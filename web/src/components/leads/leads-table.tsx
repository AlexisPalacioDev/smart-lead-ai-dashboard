import type {
  LeadsDirectoryPaginationViewModel,
  LeadsDirectoryRowViewModel,
} from "../../features/leads/types/leads-directory-view-model";

/**
 * leads-table.tsx
 * Presents formatted lead rows and pagination controls. It receives display
 * ViewModels only, so filtering and pagination rules stay outside the component.
 */

type LeadsTableProps = {
  rows: LeadsDirectoryRowViewModel[];
  pagination: LeadsDirectoryPaginationViewModel;
  onSelectLead: (leadId: string) => void;
  onPageChange: (page: number) => void;
};

/**
 * Renders the high-density leads table with newest-first sort semantics.
 *
 * @param {LeadsTableProps} props - Table rows, pagination state, and UI actions.
 * @returns {JSX.Element} Accessible leads table and pager controls.
 */
export function LeadsTable({
  rows,
  pagination,
  onSelectLead,
  onPageChange,
}: LeadsTableProps) {
  return (
    <section className="terminal-panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <p className="terminal-eyebrow">{pagination.total} records</p>
        <p className="text-sm text-[var(--color-muted)]">
          Page {pagination.page} / {pagination.totalPages}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] table-fixed text-left" aria-label="Tabla de leads">
          <thead className="bg-[var(--color-surface-lowest)] text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
            <tr>
              <th className="px-5 py-4 font-bold">Nombre</th>
              <th className="px-5 py-4 font-bold">Email</th>
              <th className="px-5 py-4 font-bold">Telefono</th>
              <th className="px-5 py-4 font-bold">Fuente</th>
              <th className="px-5 py-4 font-bold">Producto</th>
              <th className="px-5 py-4 font-bold">Presupuesto</th>
              <th className="px-5 py-4 font-bold" aria-sort="descending">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:rgba(224,226,233,0.06)]">
            {rows.length === 0 ? (
              <tr>
                <td className="px-5 py-8 text-sm text-[var(--color-muted)]" colSpan={7}>
                  No hay leads para los filtros actuales.
                </td>
              </tr>
            ) : (
              rows.map((lead) => (
                <tr
                  key={lead.id}
                  className="bg-[var(--color-surface)] transition hover:bg-[var(--color-surface-high)]"
                >
                  <td className="px-5 py-4 font-bold">{lead.name}</td>
                  <td className="truncate px-5 py-4 text-sm text-[var(--color-muted)]">
                    {lead.email}
                  </td>
                  <td className="px-5 py-4 text-sm text-[var(--color-muted)]">
                    {lead.phone}
                  </td>
                  <td className="px-5 py-4 text-sm">{lead.sourceLabel}</td>
                  <td className="px-5 py-4 text-sm text-[var(--color-muted)]">
                    {lead.productInterest}
                  </td>
                  <td className="px-5 py-4 font-mono text-sm tabular-nums text-[var(--color-primary-container)]">
                    {lead.budgetLabel}
                  </td>
                  <td className="px-5 py-4 text-sm text-[var(--color-muted)]">
                    <button
                      type="button"
                      onClick={() => onSelectLead(lead.id)}
                      className="terminal-link px-2 py-1"
                    >
                      [{lead.createdAtLabel}]
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-3 p-5">
        <button
          type="button"
          disabled={!pagination.canGoPrevious}
          onClick={() => onPageChange(pagination.page - 1)}
          className="terminal-link disabled:cursor-not-allowed disabled:opacity-40"
        >
          [PREV]
        </button>
        <button
          type="button"
          disabled={!pagination.canGoNext}
          onClick={() => onPageChange(pagination.page + 1)}
          className="terminal-link disabled:cursor-not-allowed disabled:opacity-40"
        >
          [NEXT]
        </button>
      </div>
    </section>
  );
}
