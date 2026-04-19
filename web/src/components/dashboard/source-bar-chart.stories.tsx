import type { Meta, StoryObj } from "@storybook/react-vite";

import { SourceBarChart } from "./source-bar-chart";

const meta = {
  title: "Dashboard/SourceBarChart",
  component: SourceBarChart,
  args: {
    items: [
      { label: "Instagram", value: 4 },
      { label: "Facebook", value: 2 },
      { label: "Landing Page", value: 2 },
      { label: "Referido", value: 2 },
    ],
  },
} satisfies Meta<typeof SourceBarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
