import type { Meta, StoryObj } from "@storybook/react-vite";

import { ErrorState } from "./error-state";

const meta = {
  title: "UI/ErrorState",
  component: ErrorState,
  args: {
    title: "No fue posible cargar la informacion.",
  },
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithRetryAction: Story = {
  args: {
    action: (
      <button type="button" className="terminal-link">
        [REINTENTAR]
      </button>
    ),
  },
};
