import { z } from 'zod';
import { challanStatuses } from './enums.js';

export const challanQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  status: z.enum(challanStatuses).optional(),
  customerId: z.string().uuid().optional(),
});

const challanItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().int().positive(),
});

export const challanSchema = z.object({
  customerId: z.string().uuid(),
  items: z.array(challanItemSchema).min(1),
});

export const updateDraftChallanSchema = challanSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one field must be provided'
);

export type ChallanQuery = z.infer<typeof challanQuerySchema>;
export type CreateChallanInput = z.infer<typeof challanSchema>;
export type UpdateDraftChallanInput = z.infer<typeof updateDraftChallanSchema>;

