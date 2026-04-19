import type { Meta, StoryObj } from "@storybook/react-vite";

import { EmptyState } from "./empty-state";

const meta = {
  title: "UI/EmptyState",
  component: EmptyState,
  args: {
    title: "No hay leads para mostrar.",
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    actionLabel: "Crear lead",
    onAction: () => undefined,
  },
};
