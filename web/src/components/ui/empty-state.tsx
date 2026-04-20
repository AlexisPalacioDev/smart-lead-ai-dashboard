/**
 * empty-state.tsx
 * Renders shared empty-state surface for routes and modules with no records or
 * no generated output. Assumes optional CTA should stay explicit and sparse.
 */

interface EmptyStateProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Displays empty-state copy and optional primary action.
 */
export function EmptyState({ title, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="terminal-panel--high space-y-5 p-6 lg:p-8">
      <p className="terminal-eyebrow">Sin señal</p>
      <h2 className="text-2xl font-bold uppercase tracking-[-0.04em]">
        {title}
      </h2>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="terminal-link terminal-link--primary"
        >
          [{actionLabel}]
        </button>
      ) : null}
    </div>
  );
}
