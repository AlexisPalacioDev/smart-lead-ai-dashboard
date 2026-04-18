/**
 * error-state.tsx
 * Renders shared recoverable error surface for route and section failures.
 * Assumes caller provides any retry or recovery action node when needed.
 */

interface ErrorStateProps {
  title: string; // Error title
  action?: React.ReactNode; // Optional recovery action
}

/**
 * Displays prominent failure messaging without breaking surrounding layout.
 */
export function ErrorState({ title, action }: ErrorStateProps) {
  return (
    <div role="alert" className="terminal-panel space-y-4 p-6 lg:p-8">
      <p className="terminal-eyebrow text-[var(--color-danger)]">
        System Fault
      </p>
      <h2 className="text-2xl font-bold uppercase tracking-[-0.04em] text-[var(--color-danger)]">
        {title}
      </h2>
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
