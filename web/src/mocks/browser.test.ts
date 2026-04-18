import { beforeEach, describe, expect, it, vi } from "vitest";

const browserMocks = vi.hoisted(() => {
  const workerStart = vi.fn();
  const worker = { start: workerStart };

  return {
    setupWorker: vi.fn(() => worker),
    workerStart,
  };
});

vi.mock("msw/browser", () => ({
  setupWorker: browserMocks.setupWorker,
}));

vi.mock("./handlers", () => ({
  handlers: [],
}));

import { startBrowserMocking } from "./browser";

describe("browser MSW setup", () => {
  beforeEach(() => {
    browserMocks.setupWorker.mockClear();
    browserMocks.workerStart.mockClear();
  });

  it("starts the worker with the generated service worker and warns only for app API misses", async () => {
    await startBrowserMocking();

    expect(browserMocks.workerStart).toHaveBeenCalledTimes(1);

    const [options] = browserMocks.workerStart.mock.calls[0] ?? [];
    const print = { warning: vi.fn() };

    expect(options?.serviceWorker).toEqual({
      url: "/mockServiceWorker.js",
    });
    expect(typeof options?.onUnhandledRequest).toBe("function");

    options?.onUnhandledRequest(
      new Request(`${window.location.origin}/api/leads`),
      print,
    );
    options?.onUnhandledRequest(
      new Request(`${window.location.origin}/src/styles.css`),
      print,
    );
    options?.onUnhandledRequest(
      new Request("https://fonts.googleapis.com/css2?family=Space+Grotesk"),
      print,
    );

    expect(print.warning).toHaveBeenCalledTimes(1);
  });
});
