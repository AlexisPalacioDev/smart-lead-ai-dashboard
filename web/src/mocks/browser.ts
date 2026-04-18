import { setupWorker } from "msw/browser";

import { handlers } from "./handlers";

/**
 * browser.ts
 * Exposes the MSW service worker used for browser-side API mocking.
 * Assumes browser startup awaits mocking before route data requests run.
 */

let workerStartPromise: Promise<unknown> | null = null;

/**
 * Shared browser worker configured with the application's mock handlers.
 */
export const worker = setupWorker(...handlers);

/**
 * Starts the browser Service Worker used by MSW during local development.
 *
 * @returns {Promise<unknown>} Promise resolving once MSW is ready to intercept.
 *
 * Starts MSW before the app issues browser API requests.
 */
export function startBrowserMocking() {
  if (!workerStartPromise) {
    workerStartPromise = worker.start({
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
      onUnhandledRequest(request, print) {
        const requestUrl = new URL(request.url);
        const isSameOrigin = requestUrl.origin === window.location.origin;
        const isAppApiRequest = requestUrl.pathname.startsWith("/api/");

        if (isSameOrigin && isAppApiRequest) {
          print.warning();
        }
      },
    });
  }

  return workerStartPromise;
}
