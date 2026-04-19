import type { Meta, StoryObj } from "@storybook/react-vite";

import { LoadingState } from "./loading-state";

const meta = {
  title: "UI/LoadingState",
  component: LoadingState,
  args: {
    label: "Cargando dashboard ejecutivo.",
  },
} satisfies Meta<typeof LoadingState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
