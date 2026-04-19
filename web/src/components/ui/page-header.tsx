/**
 * page-header.tsx
 * Defines shared page-level title block used by route screens for consistent
 * hierarchy, spacing, and action placement across dashboard modules.
 */

interface PageHeaderProps {
  title: string;
  description: string;
  actions?: React.ReactNode;
  headingId?: string;
}

/**
 * Displays route title, supporting copy, and optional action slot.
 */
export function PageHeader({
  title,
  description,
  actions,
  headingId,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <p className="terminal-eyebrow">Route Header</p>
        <div className="space-y-2">
          <h1
            id={headingId}
            className="text-4xl font-bold uppercase tracking-[-0.06em] lg:text-5xl"
          >
            {title}
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            {description}
          </p>
        </div>
      </div>
      {actions ? <div className="flex shrink-0 gap-3">{actions}</div> : null}
    </div>
  );
}
