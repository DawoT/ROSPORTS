import { z } from "zod";

/**
 * Validation schema for adding items to cart.
 */
export const addToCartSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  productId: z.string().min(1, "Product ID is required"),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .positive("Quantity must be greater than 0"),
});

export type AddToCartDTO = z.infer<typeof addToCartSchema>;

/**
 * Validation for updating cart item quantity.
 */
export const updateCartItemSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().nonnegative("Quantity cannot be negative"),
});

export type UpdateCartItemDTO = z.infer<typeof updateCartItemSchema>;
