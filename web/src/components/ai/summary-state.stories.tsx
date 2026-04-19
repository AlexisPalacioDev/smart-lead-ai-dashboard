import type { Meta, StoryObj } from "@storybook/react-vite";

import { SummaryState } from "./summary-state";

const meta = {
  title: "AI/SummaryState",
  component: SummaryState,
  args: {
    status: "idle",
  },
} satisfies Meta<typeof SummaryState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initial: Story = {};

export const Loading: Story = {
  args: {
    status: "loading",
  },
};

export const Empty: Story = {
  args: {
    status: "empty",
  },
};

export const Error: Story = {
  args: {
    status: "error",
    errorMessage: "No fue posible generar resumen.",
    onRetry: () => undefined,
  },
};
