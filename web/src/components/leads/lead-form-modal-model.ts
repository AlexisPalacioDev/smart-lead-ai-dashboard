import {
  leadFormSchema,
  type LeadFormInput,
} from "../../features/leads/domain/lead.schema";

export const DEFAULT_LEAD_FORM_VALUES: LeadFormInput = {
  name: "",
  email: "",
  phone: "",
  source: "instagram",
  productInterest: "",
  budget: null,
};

/**
 * Adapts Zod validation into TanStack Form's field-error shape.
 */
export function validateLeadForm(value: LeadFormInput) {
  const result = leadFormSchema.safeParse(value);

  if (result.success) {
    return undefined;
  }

  const fieldErrors = result.error.flatten().fieldErrors;

  return {
    fields: {
      name: fieldErrors.name?.[0],
      email: fieldErrors.email?.[0],
      phone: fieldErrors.phone?.[0],
      source: fieldErrors.source?.[0],
      productInterest: fieldErrors.productInterest?.[0],
      budget: fieldErrors.budget?.[0],
    },
  };
}

/**
 * Extracts a renderable validation message from TanStack Form meta errors.
 */
export function getErrorMessage(error: unknown): string | null {
  if (!error) {
    return null;
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return String(error);
}
