import { useForm } from "@tanstack/react-form";

import { leadFormSchema, type LeadFormInput } from "../../features/leads/domain/lead.schema";
import { leadSources, type LeadSource } from "../../features/leads/domain/lead";
import { getLeadSourceLabel } from "../../features/leads/application/lead-source-labels";
import { FormField } from "./lead-form-modal-field";
import {
  DEFAULT_LEAD_FORM_VALUES,
  getErrorMessage,
  validateLeadForm,
} from "./lead-form-modal-model";

type LeadFormModalProps = {
  mode: "create" | "edit";
  isOpen: boolean;
  initialValues?: LeadFormInput;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (values: LeadFormInput) => Promise<void>;
};

function getFieldInputProps(name: keyof LeadFormInput) {
  return {
    id: `lead-${name}`,
    name: `lead-${name}`,
  };
}

/**
 * Renders the create/edit lead dialog with schema-backed submission validation.
 *
 * @param {LeadFormModalProps} props - Modal state, initial values, and actions.
 * @returns {JSX.Element | null} Lead form dialog or null when closed.
 */
export function LeadFormModal(props: LeadFormModalProps) {
  const form = useForm({
    defaultValues: props.initialValues ?? DEFAULT_LEAD_FORM_VALUES,
    validators: {
      onSubmit: ({ value }) => validateLeadForm(value),
    },
    onSubmit: async ({ value }) => {
      await props.onSubmit(leadFormSchema.parse(value));
      props.onClose();
    },
  });

  if (!props.isOpen) {
    return null;
  }

  const title = props.mode === "create" ? "Nuevo lead" : "Editar lead";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-form-modal-title"
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
    >
      <div className="terminal-panel w-full max-w-3xl p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="terminal-eyebrow">Lead operation</p>
            <h2 id="lead-form-modal-title" className="text-2xl font-bold">
              {title}
            </h2>
          </div>
          <button type="button" className="terminal-link" onClick={props.onClose}>
            [CERRAR]
          </button>
        </div>
        {props.errorMessage ? (
          <p className="mt-4 text-sm text-[var(--color-danger)]">
            {props.errorMessage}
          </p>
        ) : null}
        <form
          className="mt-6 grid gap-4 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <form.Field name="name">
            {(field) => (
              <FormField label="Nombre" error={getErrorMessage(field.state.meta.errors[0])}>
                <input
                  {...getFieldInputProps("name")}
                  aria-label="Nombre"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  className="bg-[var(--color-surface-highest)] px-3 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-container)]"
                />
              </FormField>
            )}
          </form.Field>
          <form.Field name="email">
            {(field) => (
              <FormField label="Email" error={getErrorMessage(field.state.meta.errors[0])}>
                <input
                  {...getFieldInputProps("email")}
                  aria-label="Email"
                  type="email"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  className="bg-[var(--color-surface-highest)] px-3 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-container)]"
                />
              </FormField>
            )}
          </form.Field>
          <form.Field name="phone">
            {(field) => (
              <FormField label="Telefono">
                <input
                  {...getFieldInputProps("phone")}
                  aria-label="Telefono"
                  type="tel"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  className="bg-[var(--color-surface-highest)] px-3 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-container)]"
                />
              </FormField>
            )}
          </form.Field>
          <form.Field name="source">
            {(field) => (
              <FormField label="Fuente">
                <select
                  {...getFieldInputProps("source")}
                  aria-label="Fuente"
                  value={field.state.value}
                  onChange={(event) =>
                    field.handleChange(event.target.value as LeadSource)
                  }
                  className="bg-[var(--color-surface-highest)] px-3 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-container)]"
                >
                  {leadSources.map((source) => (
                    <option key={source} value={source}>
                      {getLeadSourceLabel(source)}
                    </option>
                  ))}
                </select>
              </FormField>
            )}
          </form.Field>
          <form.Field name="productInterest">
            {(field) => (
              <FormField label="Producto de interes">
                <input
                  {...getFieldInputProps("productInterest")}
                  aria-label="Producto de interes"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  className="bg-[var(--color-surface-highest)] px-3 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-container)]"
                />
              </FormField>
            )}
          </form.Field>
          <form.Field name="budget">
            {(field) => (
              <FormField
                label="Presupuesto"
                error={getErrorMessage(field.state.meta.errors[0])}
              >
                <input
                  {...getFieldInputProps("budget")}
                  aria-label="Presupuesto"
                  type="number"
                  min="0"
                  value={field.state.value ?? ""}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value === "" ? null : Number(event.target.value),
                    )
                  }
                  className="bg-[var(--color-surface-highest)] px-3 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-container)]"
                />
              </FormField>
            )}
          </form.Field>
          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button
              type="submit"
              disabled={props.isSubmitting}
              className="terminal-link terminal-link--primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              [{props.isSubmitting ? "GUARDANDO..." : "GUARDAR LEAD"}]
            </button>
            <button type="button" className="terminal-link" onClick={props.onClose}>
              [CANCELAR]
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
