/**
 * lead.schema.ts
 * Defines Zod validation rules for lead create and edit payloads.
 * Depends on domain source constants so UI and validation share one vocabulary.
 */
import { z } from "zod";

import { leadSources } from "./lead";

/**
 * Validates user-submitted lead form input and coerces budget values.
 *
 * Empty-string budget values intentionally become `null` so the UI can treat
 * unknown budget as distinct from numeric zero.
 */
export const leadFormSchema = z.object({
  name: z.string().trim().min(2, "Name must contain at least 2 characters"),
  email: z
    .email({ message: "Email must be valid" })
    .transform((email) => email.trim()),
  phone: z.string().trim(),
  source: z.enum(leadSources),
  productInterest: z.string().trim(),
  budget: z.preprocess(
    (value) => (value === "" || value == null ? null : Number(value)),
    z.number().min(0, "Budget must be greater than or equal to 0").nullable(),
  ),
});

/**
 * Shape of validated lead form input after schema parsing.
 */
export type LeadFormInput = z.infer<typeof leadFormSchema>;
