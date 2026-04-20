import type { Lead } from "../../features/leads/domain/lead";
import { getLeadSourceLabel } from "../../features/leads/application/lead-source-labels";

type LeadDetailModalProps = {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onEdit: (leadId: string) => void;
  onDelete: (leadId: string) => void;
};

/**
 * Renders read-only lead details with edit and delete actions.
 *
 * @param {LeadDetailModalProps} props - Dialog state, selected lead, and actions.
 * @returns {JSX.Element | null} Detail dialog or null when closed.
 */
export function LeadDetailModal({
  isOpen,
  lead,
  onClose,
  onEdit,
  onDelete,
}: LeadDetailModalProps) {
  if (!isOpen || !lead) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-detail-modal-title"
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
    >
      <div className="terminal-panel w-full max-w-2xl p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="terminal-eyebrow">Perfil de lead</p>
            <h2 id="lead-detail-modal-title" className="text-2xl font-bold">
              {lead.name}
            </h2>
          </div>
          <button type="button" className="terminal-link" onClick={onClose}>
            [CERRAR]
          </button>
        </div>
        <dl className="mt-6 grid gap-4 md:grid-cols-2">
          <DetailItem label="Email" value={lead.email} />
          <DetailItem label="Telefono" value={lead.phone || "Sin telefono"} />
          <DetailItem label="Fuente" value={getLeadSourceLabel(lead.source)} />
          <DetailItem
            label="Producto"
            value={lead.productInterest || "Sin producto"}
          />
          <DetailItem
            label="Presupuesto"
            value={
              lead.budget === null
                ? "Sin presupuesto"
                : `$${new Intl.NumberFormat("es-CO").format(lead.budget)}`
            }
          />
          <DetailItem
            label="Fecha"
            value={new Intl.DateTimeFormat("es-CO").format(
              new Date(lead.createdAt),
            )}
          />
        </dl>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="terminal-link terminal-link--primary"
            onClick={() => onEdit(lead.id)}
          >
            [EDITAR]
          </button>
          <button
            type="button"
            className="terminal-link text-[var(--color-danger)]"
            onClick={() => onDelete(lead.id)}
          >
            [ELIMINAR]
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Renders one labeled value in the detail dialog.
 */
function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="terminal-metric p-4">
      <dt className="terminal-eyebrow">{label}</dt>
      <dd className="mt-2 break-words text-sm">{value}</dd>
    </div>
  );
}
