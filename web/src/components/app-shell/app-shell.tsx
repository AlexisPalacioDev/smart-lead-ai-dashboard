import { Link } from "@tanstack/react-router";

/**
 * app-shell.tsx
 * Defines shared desktop shell for Smart Lead AI routes, including skip link,
 * product identity, and top-level route navigation.
 * Depends on Phosphor Dark theme tokens declared in global styles.
 */

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/leads", label: "Leads Directory" },
  { to: "/ai-summary", label: "AI Summary" },
] as const;

export function AppShell({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[var(--color-background)] text-[var(--color-foreground)]">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--color-primary-container)] focus:px-3 focus:py-2 focus:text-[var(--color-primary-ink)]"
        href="#main-content"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-20 bg-[color:rgba(10,15,19,0.88)]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5 px-6 py-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="terminal-eyebrow text-[var(--color-primary-container)]">
              &gt;_ Sovereign Console
            </p>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold uppercase tracking-[-0.06em] lg:text-4xl">
                Smart Lead AI
              </h1>
              <p className="max-w-2xl text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Digital brutalism for lead command, analytics, and AI synthesis.
              </p>
            </div>
          </div>
          <nav
            aria-label="Primary"
            className="flex flex-wrap items-center gap-3"
          >
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="bg-[var(--color-surface)] px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-muted)] shadow-[inset_0_0_0_1px_rgba(132,150,126,0.16)] transition hover:bg-[var(--color-surface-high)] hover:text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-container)]"
                activeProps={{
                  className:
                    "bg-[var(--color-surface-highest)] px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-primary)] shadow-[-4px_0_0_0_var(--color-primary-container)_inset]",
                }}
              >
                [{link.label}]
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main
        id="main-content"
        className="mx-auto max-w-[1400px] px-6 py-10 lg:py-14"
      >
        {children}
      </main>
    </div>
  );
}
