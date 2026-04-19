import type { Meta, StoryObj } from "@storybook/react-vite";

import { LeadFormModal } from "./lead-form-modal";

const meta = {
  title: "Leads/LeadFormModal",
  component: LeadFormModal,
  args: {
    isOpen: true,
    mode: "create",
    onClose: () => undefined,
    onSubmit: async () => undefined,
  },
} satisfies Meta<typeof LeadFormModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Create: Story = {};

export const Edit: Story = {
  args: {
    mode: "edit",
    initialValues: {
      name: "Ana Torres",
      email: "ana@example.com",
      phone: "3001001001",
      source: "instagram",
      productInterest: "CRM Starter",
      budget: 1200,
    },
  },
};

export const ErrorState: Story = {
  args: {
    errorMessage: "No fue posible guardar lead. Intenta nuevamente.",
  },
};
