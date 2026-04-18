import { z } from "zod";

import { leadSources } from "./lead";

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

export type LeadFormInput = z.infer<typeof leadFormSchema>;
