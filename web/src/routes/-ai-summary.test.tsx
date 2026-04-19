/**
 * -ai-summary.test.tsx
 * Verifies AI Summary route moves from initial state to loading and then
 * renders structured executive output.
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AISummaryPage } from "./ai-summary";

describe("AISummaryRoute", () => {
  it("renders initial state, enters loading, and shows structured results", async () => {
    const user = userEvent.setup();
    type SummaryValue = {
      analysis: string;
      mainSource: string;
      recommendations: string[];
    };
    let resolveSummary!: (value: SummaryValue) => void;
    const summaryPromise = new Promise<SummaryValue>((resolve) => {
      resolveSummary = resolve;
    });
    const createSummary = vi.fn().mockReturnValue(summaryPromise);

    render(<AISummaryPage createSummary={createSummary} />);

    expect(
      screen.getByRole("heading", {
        name: /genera un resumen ejecutivo para comenzar/i,
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /generar resumen/i }),
    );

    expect(createSummary).toHaveBeenCalledTimes(1);
    expect(await screen.findByText(/generando resumen/i)).toBeInTheDocument();
    resolveSummary({
      analysis: "Los leads muestran mayor traccion en Instagram.",
      mainSource: "Instagram",
      recommendations: [
        "Aumentar inversion en Instagram",
        "Optimizar landing page",
      ],
    });
    expect(await screen.findByText(/instagram/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/optimizar landing page/i),
    ).toBeInTheDocument();
  });
});
