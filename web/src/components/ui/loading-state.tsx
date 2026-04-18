/**
 * loading-state.tsx
 * Renders shared async placeholder used by routes and reusable sections while
 * data is loading. Assumes global Phosphor Dark utility classes are present.
 */

interface LoadingStateProps {
  label: string; // Copy shown under skeleton bars.
}

/**
 * Displays non-blocking loading feedback with neutral copy.
 */
export function LoadingState({ label }: LoadingStateProps) {
  return (
    <div
      aria-live="polite"
      className="terminal-panel--high space-y-4 p-6 lg:p-8"
    >
      <div className="space-y-3">
        <div className="h-3 w-24 animate-pulse bg-white/10" />
        <div className="h-8 w-56 animate-pulse bg-white/8" />
      </div>
      <p className="text-sm uppercase tracking-[0.16em] text-[var(--color-muted)]">
        {label}
      </p>
    </div>
  );
}
