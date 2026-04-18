import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

import { server } from "./msw-server";

/**
 * setup.ts
 * Configures the shared Vitest browser-like environment for component and route
 * tests. Assumes MSW owns API mocking and devtools are irrelevant in tests.
 */

vi.mock("@tanstack/react-devtools", () => ({
  TanStackDevtools: () => null,
}));

vi.mock("@tanstack/react-router-devtools", () => ({
  TanStackRouterDevtoolsPanel: () => null,
}));

beforeAll(() => {
  // Starting the server once keeps network mocking deterministic while avoiding
  // repeated setup cost for every individual test file.
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
});

afterAll(() => {
  server.close();
});

vi.stubGlobal("scrollTo", vi.fn());
