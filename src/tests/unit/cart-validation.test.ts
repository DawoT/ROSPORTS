import { describe, it, expect } from 'vitest';
import { addToCartSchema } from '@/interface-adapters/dtos/cart.dto';

describe('Cart Validation DTO', () => {
    it('should validate a correct payload', () => {
        const payload = {
            variantId: 'var_123',
            productId: 'prod_123',
            quantity: 2,
        };

        const result = addToCartSchema.safeParse(payload);
        expect(result.success).toBe(true);
    });

    it('should trim whitespace from IDs', () => {
        const payload = {
            variantId: '  var_123  ',
            productId: '  prod_123  ',
            quantity: 1,
        };
        const result = addToCartSchema.safeParse(payload);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.variantId).toBe('var_123');
            expect(result.data.productId).toBe('prod_123');
        }
    });

    it('should fail when quantity is negative', () => {
        const payload = {
            variantId: 'var_123',
            productId: 'prod_123',
            quantity: -1, // Invalid
        };

        const result = addToCartSchema.safeParse(payload);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Quantity must be greater than 0');
        }
    });

    it('should fail when variantId is missing', () => {
        const payload = {
            productId: 'prod_123',
            quantity: 1,
        };

        const result = addToCartSchema.safeParse(payload);
        expect(result.success).toBe(false);
    });

    it('should fail when quantity is not an integer', () => {
        const payload = {
            variantId: 'var_123',
            productId: 'prod_123',
            quantity: 1.5, // Invalid
        };
        const result = addToCartSchema.safeParse(payload);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Quantity must be an integer');
        }
    });
});
