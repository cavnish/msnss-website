import { z } from "zod";
export const testimonialInput = z.object({
  name: z.string().trim().min(2).max(255),
  role: z.string().max(160).optional().nullable(),
  company: z.string().max(255).optional().nullable(),
  content: z.string().trim().min(5).max(3000),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  accentColor: z.string().max(20).default("#0e7cc4"),
  timeAgo: z.string().max(80).optional().nullable(),
  verified: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
});
