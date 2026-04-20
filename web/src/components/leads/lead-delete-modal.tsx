type LeadDeleteModalProps = {
  isOpen: boolean;
  leadName: string;
  isDeleting?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

/**
 * Renders destructive confirmation for lead removal.
 *
 * @param {LeadDeleteModalProps} props - Dialog state and delete action.
 * @returns {JSX.Element | null} Delete confirmation dialog or null when closed.
 */
export function LeadDeleteModal({
  isOpen,
  leadName,
  isDeleting,
  errorMessage,
  onClose,
  onConfirm,
}: LeadDeleteModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-delete-modal-title"
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
    >
      <div className="terminal-panel w-full max-w-md p-6 shadow-2xl">
        <p className="terminal-eyebrow text-[var(--color-danger)]">
          Accion destructiva
        </p>
        <h2 id="lead-delete-modal-title" className="mt-2 text-2xl font-bold">
          Eliminar lead
        </h2>
        <p className="mt-4 text-sm text-[var(--color-muted)]">
          Vas a eliminar a {leadName}. Esta accion no se puede deshacer.
        </p>
        {errorMessage ? (
          <p className="mt-4 text-sm text-[var(--color-danger)]">
            {errorMessage}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button type="button" className="terminal-link" onClick={onClose}>
            [CANCELAR]
          </button>
          <button
            type="button"
            disabled={isDeleting}
            className="terminal-link text-[var(--color-danger)] disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => void onConfirm()}
          >
            [{isDeleting ? "ELIMINANDO..." : "ELIMINAR"}]
          </button>
        </div>
      </div>
    </div>
  );
}
