import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  buildLeadsDirectoryViewModel,
  DEFAULT_LEADS_DIRECTORY_SEARCH,
} from "../../features/leads/application/build-leads-directory-view-model";
import { leadFixtures } from "../../features/leads/infrastructure/lead-fixtures";
import { LeadsTable } from "./leads-table";

const directory = buildLeadsDirectoryViewModel(
  leadFixtures,
  DEFAULT_LEADS_DIRECTORY_SEARCH,
);

const meta = {
  title: "Leads/LeadsTable",
  component: LeadsTable,
  args: {
    rows: directory.rows,
    pagination: directory.pagination,
    onSelectLead: () => undefined,
    onEditLead: () => undefined,
    onDeleteLead: () => undefined,
    onPageChange: () => undefined,
  },
} satisfies Meta<typeof LeadsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    rows: [],
    pagination: {
      ...directory.pagination,
      total: 0,
      totalPages: 1,
      canGoPrevious: false,
      canGoNext: false,
    },
  },
};
