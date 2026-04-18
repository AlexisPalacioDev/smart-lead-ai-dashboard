import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LeadFormModal } from "./lead-form-modal";

describe("LeadFormModal", () => {
  it("shows inline validation errors and submits valid data once", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    const { findByText, getByLabelText, getByRole } = render(
      <LeadFormModal
        mode="create"
        isOpen
        onClose={() => {}}
        onSubmit={onSubmit}
      />,
    );

    await user.click(getByRole("button", { name: /guardar lead/i }));

    expect(await findByText(/nombre obligatorio/i)).toBeInTheDocument();
    expect(await findByText(/email obligatorio/i)).toBeInTheDocument();

    await user.type(getByLabelText(/nombre/i), "Laura Ramos");
    await user.type(getByLabelText(/email/i), "laura@example.com");
    await user.selectOptions(getByLabelText(/fuente/i), "instagram");
    await user.click(getByRole("button", { name: /guardar lead/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
