import { describe, it, expect } from 'vitest';
import { productSearchSchema, productParamSchema } from '@/interface-adapters/dtos/product.dto';

describe('productSearchSchema', () => {
    describe('Valid Inputs', () => {
        it('should accept valid search with page and limit', () => {
            const result = productSearchSchema.safeParse({
                query: 'nike',
                page: '2',
                limit: '20',
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.query).toBe('nike');
                expect(result.data.page).toBe(2);
                expect(result.data.limit).toBe(20);
            }
        });

        it('should accept empty object and apply defaults', () => {
            const result = productSearchSchema.safeParse({});
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.query).toBeUndefined();
                expect(result.data.page).toBe(1);
                expect(result.data.limit).toBe(20);
            }
        });

        it('should default page to 1 when not provided', () => {
            const result = productSearchSchema.safeParse({ query: 'shoes' });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.page).toBe(1);
            }
        });

        it('should default limit to 20 when not provided', () => {
            const result = productSearchSchema.safeParse({ query: 'shoes' });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.limit).toBe(20);
            }
        });
    });

    describe('Pagination Limits', () => {
        it('should reject limit greater than 100', () => {
            const result = productSearchSchema.safeParse({
                query: 'test',
                limit: '500',
            });
            expect(result.success).toBe(false);
        });

        it('should reject page of 0 or negative', () => {
            const result = productSearchSchema.safeParse({
                query: 'test',
                page: '0',
            });
            expect(result.success).toBe(false);
        });

        it('should handle numeric strings for page and limit', () => {
            const result = productSearchSchema.safeParse({
                page: '5',
                limit: '25',
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(typeof result.data.page).toBe('number');
                expect(typeof result.data.limit).toBe('number');
            }
        });
    });

    describe('Query Sanitization', () => {
        it('should trim whitespace from query', () => {
            const result = productSearchSchema.safeParse({
                query: '  nike air max  ',
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.query).toBe('nike air max');
            }
        });
    });

    describe('Optional Filters', () => {
        it('should accept minPrice and maxPrice', () => {
            const result = productSearchSchema.safeParse({
                minPrice: '100',
                maxPrice: '500',
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.minPrice).toBe(100);
                expect(result.data.maxPrice).toBe(500);
            }
        });

        it('should accept category and brand filters', () => {
            const result = productSearchSchema.safeParse({
                category: 'running',
                brand: 'nike',
            });
            expect(result.success).toBe(true);
        });

        it('should accept valid sort options', () => {
            const validSorts = ['price_asc', 'price_desc', 'newest', 'relevance'];
            for (const sort of validSorts) {
                const result = productSearchSchema.safeParse({ sort });
                expect(result.success).toBe(true);
            }
        });

        it('should reject invalid sort option', () => {
            const result = productSearchSchema.safeParse({ sort: 'invalid' });
            expect(result.success).toBe(false);
        });
    });
});

describe('productParamSchema', () => {
    describe('Valid Inputs', () => {
        it('should accept valid slug', () => {
            const result = productParamSchema.safeParse({
                slug: 'nike-air-max-270',
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.slug).toBe('nike-air-max-270');
            }
        });

        it('should accept slug with numbers', () => {
            const result = productParamSchema.safeParse({
                slug: 'product-123-abc',
            });
            expect(result.success).toBe(true);
        });
    });

    describe('Required Validation', () => {
        it('should reject empty slug', () => {
            const result = productParamSchema.safeParse({
                slug: '',
            });
            expect(result.success).toBe(false);
        });

        it('should reject missing slug', () => {
            const result = productParamSchema.safeParse({});
            expect(result.success).toBe(false);
        });
    });

    describe('Slug Normalization', () => {
        it('should convert slug to lowercase', () => {
            const result = productParamSchema.safeParse({
                slug: 'Nike-Air-Max',
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.slug).toBe('nike-air-max');
            }
        });

        it('should trim whitespace from slug', () => {
            const result = productParamSchema.safeParse({
                slug: '  nike-air-max  ',
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.slug).toBe('nike-air-max');
            }
        });
    });
});
