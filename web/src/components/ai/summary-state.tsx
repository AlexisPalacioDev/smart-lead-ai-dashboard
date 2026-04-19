import { EmptyState } from "../ui/empty-state";
import { ErrorState } from "../ui/error-state";
import { LoadingState } from "../ui/loading-state";

/**
 * summary-state.tsx
 * Renders the non-success AI Summary surfaces used by the route.
 */

type SummaryStateProps = {
  status: "idle" | "loading" | "error" | "empty";
  errorMessage?: string;
  onRetry?: () => void;
};

export function SummaryState({
  status,
  errorMessage,
  onRetry,
}: SummaryStateProps) {
  if (status === "loading") {
    return <LoadingState label="Generando resumen ejecutivo." />;
  }

  if (status === "error") {
    return (
      <ErrorState
        title={errorMessage || "No fue posible generar el resumen."}
        action={
          onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="terminal-link terminal-link--primary"
            >
              [REINTENTAR]
            </button>
          ) : undefined
        }
      />
    );
  }

  if (status === "empty") {
    return (
      <EmptyState title="No hay leads para resumir con los filtros actuales." />
    );
  }

  return <EmptyState title="Genera un resumen ejecutivo para comenzar." />;
}
