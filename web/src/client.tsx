import { StartClient } from "@tanstack/react-start/client";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

/**
 * client.tsx
 * Customizes the TanStack Start browser entry so development API mocks are
 * active before React Query starts route-level fetches.
 */

/**
 * Starts development-only browser mocks before hydrating the app.
 *
 * @returns {Promise<void>} Promise resolving after startup and hydration queueing.
 *
 * Boots the browser application with MSW ready in development.
 */
async function bootstrapClient() {
  if (import.meta.env.DEV) {
    const { startBrowserMocking } = await import("./mocks/browser");

    await startBrowserMocking();
  }

  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <StartClient />
      </StrictMode>,
    );
  });
}

void bootstrapClient();
