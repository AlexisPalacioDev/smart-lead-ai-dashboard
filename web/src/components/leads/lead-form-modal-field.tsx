import type { ReactNode } from "react";

/**
 * Renders a modal form control with optional validation copy.
 */
export function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | null;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="terminal-eyebrow">{label}</span>
      {children}
      {error ? (
        <span className="text-sm text-[var(--color-danger)]">{error}</span>
      ) : null}
    </label>
  );
}
