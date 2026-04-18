import { Link } from '@tanstack/react-router'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/leads', label: 'Leads Directory' },
  { to: '/ai-summary', label: 'AI Summary' },
] as const

export function AppShell({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[var(--color-background)] text-[var(--color-foreground)]">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--color-surface-highest)] focus:px-3 focus:py-2"
        href="#main-content"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[color:var(--color-surface)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
              Smart Lead AI
            </p>
            <h1 className="text-lg font-semibold">Dashboard Console</h1>
          </div>
          <nav aria-label="Primary" className="flex flex-wrap items-center gap-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-md px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
                activeProps={{
                  className:
                    'rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-7xl px-6 py-10">
        {children}
      </main>
    </div>
  )
}
