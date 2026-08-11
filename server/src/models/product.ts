import { z } from 'zod';
import { movementTypes } from './enums.js';

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  lowStockOnly: z.coerce.boolean().default(false),
});

export const productSchema = z.object({
  name: z.string().trim().min(2).max(150),
  sku: z.string().trim().min(2).max(50),
  category: z.string().trim().min(2).max(50),
  unitPrice: z.coerce.number().min(0),
  currentStock: z.coerce.number().int().min(0),
  minStockAlert: z.coerce.number().int().min(0).default(10),
  location: z.string().trim().min(1).max(100),
});

export const updateProductSchema = productSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one field must be provided'
);

export const adjustStockSchema = z.object({
  quantity: z.coerce.number().int().positive(),
  movementType: z.enum(movementTypes),
  reason: z.string().trim().min(2).max(100),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;
export type CreateProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type AdjustStockInput = z.infer<typeof adjustStockSchema>;

