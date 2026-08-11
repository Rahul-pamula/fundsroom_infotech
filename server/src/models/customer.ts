import { z } from 'zod';
import { customerStatuses, customerTypes } from './enums.js';

export const customerQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  status: z.enum(customerStatuses).optional(),
});

export const customerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  mobile: z.string().trim().min(7).max(20),
  email: z.string().email(),
  businessName: z.string().trim().min(2).max(150),
  gstNumber: z.string().trim().max(15).optional().or(z.literal('')),
  customerType: z.enum(customerTypes),
  address: z.string().trim().min(5),
  status: z.enum(customerStatuses).default('LEAD'),
  followUpDate: z.string().date().optional().nullable(),
  notes: z.string().trim().optional().nullable(),
});

export const updateCustomerSchema = customerSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one field must be provided'
);

export const createFollowupSchema = z.object({
  note: z.string().trim().min(2),
  followUpDate: z.string().date().optional().nullable(),
  status: z.enum(customerStatuses).optional(),
});

export type CustomerQuery = z.infer<typeof customerQuerySchema>;
export type CreateCustomerInput = z.infer<typeof customerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type CreateFollowupInput = z.infer<typeof createFollowupSchema>;

