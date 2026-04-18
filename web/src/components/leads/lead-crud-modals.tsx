import type { Lead } from "../../features/leads/domain/lead";
import type { LeadFormInput } from "../../features/leads/domain/lead.schema";
import { LeadDeleteModal } from "./lead-delete-modal";
import { LeadDetailModal } from "./lead-detail-modal";
import { LeadFormModal } from "./lead-form-modal";

export type LeadModalState =
  | { type: "closed" }
  | { type: "create" }
  | { type: "detail"; leadId: string }
  | { type: "edit"; leadId: string }
  | { type: "delete"; leadId: string };

type LeadCrudModalsProps = {
  modalState: LeadModalState;
  leads: Lead[];
  isMutating: boolean;
  mutationError: string | null;
  onClose: () => void;
  onEditLead: (leadId: string) => void;
  onDeleteLead: (leadId: string) => void;
  onCreateLead: (values: LeadFormInput) => Promise<void>;
  onUpdateLead: (leadId: string, values: LeadFormInput) => Promise<void>;
  onConfirmDelete: (leadId: string) => Promise<void>;
};

/**
 * Renders all lead CRUD modals from route-level selected state.
 *
 * @param {LeadCrudModalsProps} props - Modal state, selected data, and actions.
 * @returns {JSX.Element} Modal collection for create, read, update, and delete.
 */
export function LeadCrudModals({
  modalState,
  leads,
  isMutating,
  mutationError,
  onClose,
  onEditLead,
  onDeleteLead,
  onCreateLead,
  onUpdateLead,
  onConfirmDelete,
}: LeadCrudModalsProps) {
  const selectedLead =
    modalState.type === "closed" || modalState.type === "create"
      ? null
      : getLeadById(leads, modalState.leadId);

  return (
    <>
      <LeadFormModal
        mode="create"
        isOpen={modalState.type === "create"}
        isSubmitting={isMutating}
        errorMessage={mutationError}
        onClose={onClose}
        onSubmit={onCreateLead}
      />
      <LeadFormModal
        mode="edit"
        isOpen={modalState.type === "edit" && Boolean(selectedLead)}
        initialValues={selectedLead ? toLeadFormInput(selectedLead) : undefined}
        isSubmitting={isMutating}
        errorMessage={mutationError}
        onClose={onClose}
        onSubmit={async (values) => {
          if (selectedLead) {
            await onUpdateLead(selectedLead.id, values);
          }
        }}
      />
      <LeadDetailModal
        isOpen={modalState.type === "detail"}
        lead={selectedLead}
        onClose={onClose}
        onEdit={onEditLead}
        onDelete={onDeleteLead}
      />
      <LeadDeleteModal
        isOpen={modalState.type === "delete" && Boolean(selectedLead)}
        leadName={selectedLead?.name ?? "este lead"}
        isDeleting={isMutating}
        errorMessage={mutationError}
        onClose={onClose}
        onConfirm={async () => {
          if (selectedLead) {
            await onConfirmDelete(selectedLead.id);
            onClose();
          }
        }}
      />
    </>
  );
}

/**
 * Finds a lead by id without leaking lookup logic into modal components.
 */
function getLeadById(leads: Lead[], leadId: string) {
  return leads.find((lead) => lead.id === leadId) ?? null;
}

/**
 * Converts a persisted lead into edit form defaults.
 */
function toLeadFormInput(lead: Lead): LeadFormInput {
  return {
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    source: lead.source,
    productInterest: lead.productInterest,
    budget: lead.budget,
  };
}
