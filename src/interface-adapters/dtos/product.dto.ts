import { z } from "zod";

/**
 * Validation schema for searching products.
 */
export const productSearchSchema = z.object({
  query: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  sort: z.enum(["price_asc", "price_desc", "newest", "relevance"]).optional(),
});

export type ProductSearchDTO = z.infer<typeof productSearchSchema>;

/**
 * Schema for fetching a single product params (e.g. by slug).
 */
export const productParamSchema = z.object({
  slug: z.string().min(1),
});
