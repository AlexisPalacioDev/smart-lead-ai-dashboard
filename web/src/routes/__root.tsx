/**
 * __root.tsx
 * Declares the TanStack root route, document frame, shared providers, and
 * shell composition for all pages. Depends on TanStack Router, TanStack Query,
 * and global CSS loaded through the route head.
 */
import { QueryClientProvider } from "@tanstack/react-query";
import { TanStackDevtools } from "@tanstack/react-devtools";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

// Components
import { AppShell } from "../components/app-shell/app-shell";
import { createQueryClient } from "../lib/query-client";

// Styles
import appCss from "../styles.css?url";

const isTestEnvironment = import.meta.env.MODE === "test";
const queryClient = createQueryClient();

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Smart Lead AI Dashboard",
      },
    ],
    links: appCss
      ? [
          {
            rel: "stylesheet",
            href: appCss,
          },
        ]
      : [],
  }),
  component: RootComponent,
});

/**
 * Composes the root document wrapper, query provider, and shared shell.
 */
function RootComponent() {
  return (
    <RootDocument>
      <QueryClientProvider client={queryClient}>
        <AppShell>
          <main
            id="main-content"
            className="mx-auto max-w-[1400px] px-6 py-10 lg:py-14"
          >
            <Outlet />
          </main>
        </AppShell>
      </QueryClientProvider>
    </RootDocument>
  );
}

/**
 * Selects a full document wrapper in runtime environments and a fragment in tests.
 *
 * @param {{ children: React.ReactNode }} props - Root route content.
 * @returns {JSX.Element} Fragment in tests or full document frame elsewhere.
 */
function RootDocument({ children }: { children: React.ReactNode }) {
  if (isTestEnvironment) {
    // Tests render into a div container; returning `<html>` there causes React
    // nesting warnings unrelated to actual runtime behavior.
    return <>{children}</>;
  }

  return <DocumentFrame>{children}</DocumentFrame>;
}

/**
 * Renders the outer HTML document used by TanStack Start at runtime.
 *
 */
export function DocumentFrame({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
