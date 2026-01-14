import { z } from 'zod';

/**
 * Schema for checkout form validation
 */
export const checkoutSchema = z.object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().optional(),
    email: z.string().email('Email inválido'),
    phone: z.string().optional(),
    address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
    city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
    notes: z.string().optional(),
});

export type CheckoutDTO = z.infer<typeof checkoutSchema>;

/**
 * Cart item structure for checkout
 */
export interface CheckoutCartItem {
    variantId: string;
    productId: string;
    quantity: number;
}
