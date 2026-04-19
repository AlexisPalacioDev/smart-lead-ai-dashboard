import type { Meta, StoryObj } from "@storybook/react-vite";

import { PageHeader } from "./page-header";

const meta = {
  title: "UI/PageHeader",
  component: PageHeader,
  args: {
    title: "Leads Directory",
    description: "Gestion operativa de leads con filtros y acciones rapidas.",
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActions: Story = {
  args: {
    actions: (
      <button type="button" className="terminal-link terminal-link--primary">
        [NUEVO LEAD]
      </button>
    ),
  },
};
