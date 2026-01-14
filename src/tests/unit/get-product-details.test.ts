import { describe, it, expect, vi } from 'vitest';
import { GetProductDetailsUseCase } from '@/core/use-cases/catalog/get-product-details.use-case';
import { ProductNotFoundError } from '@/lib/errors';
import { ICatalogRepository } from '@/core/repositories/catalog.repository';
import { Product } from '@/core/domain/types';

describe('GetProductDetailsUseCase', () => {
    const mockProduct: Product = {
        id: '1',
        name: 'Nike Air Max 270',
        slug: 'nike-air-max-270',
        descriptionShort: 'Premium running shoes',
        basePrice: 459.9,
        status: 'ACTIVE',
        variants: [
            {
                id: '1',
                productId: '1',
                sku: 'NIKE-AIR-MAX-270-42',
                size: '42',
                color: 'Black',
                isActive: true,
            },
            {
                id: '2',
                productId: '1',
                sku: 'NIKE-AIR-MAX-270-43',
                size: '43',
                color: 'Black',
                isActive: true,
            },
        ],
    };

    const createMockRepo = (product: Product | null): ICatalogRepository => ({
        findBySlug: vi.fn().mockResolvedValue(product),
        searchProducts: vi.fn(),
        getStockStatus: vi.fn().mockResolvedValue({ sku: '', available: 10, reserved: 0 }),
    });

    describe('Successful Retrieval', () => {
        it('should return product with all variants by slug', async () => {
            const repo = createMockRepo(mockProduct);
            const useCase = new GetProductDetailsUseCase(repo);

            const result = await useCase.execute('nike-air-max-270');

            expect(result).toBeDefined();
            expect(result.name).toBe('Nike Air Max 270');
            expect(result.variants).toHaveLength(2);
            expect(repo.findBySlug).toHaveBeenCalledWith('nike-air-max-270');
        });

        it('should include all variant details', async () => {
            const repo = createMockRepo(mockProduct);
            const useCase = new GetProductDetailsUseCase(repo);

            const result = await useCase.execute('nike-air-max-270');

            expect(result.variants?.[0].sku).toBe('NIKE-AIR-MAX-270-42');
            expect(result.variants?.[0].size).toBe('42');
            expect(result.variants?.[0].color).toBe('Black');
        });

        it('should return product with status', async () => {
            const repo = createMockRepo(mockProduct);
            const useCase = new GetProductDetailsUseCase(repo);

            const result = await useCase.execute('nike-air-max-270');

            expect(result.status).toBe('ACTIVE');
        });
    });

    describe('Product Not Found', () => {
        it('should throw ProductNotFoundError for unknown slug', async () => {
            const repo = createMockRepo(null);
            const useCase = new GetProductDetailsUseCase(repo);

            await expect(useCase.execute('unknown-product')).rejects.toThrow(ProductNotFoundError);
        });

        it('should include slug in error message', async () => {
            const repo = createMockRepo(null);
            const useCase = new GetProductDetailsUseCase(repo);

            try {
                await useCase.execute('some-unknown-slug');
            } catch (error) {
                expect(error).toBeInstanceOf(ProductNotFoundError);
                expect((error as ProductNotFoundError).message).toContain('some-unknown-slug');
            }
        });
    });

    describe('Edge Cases', () => {
        it('should handle product with no variants', async () => {
            const productNoVariants: Product = {
                ...mockProduct,
                variants: [],
            };
            const repo = createMockRepo(productNoVariants);
            const useCase = new GetProductDetailsUseCase(repo);

            const result = await useCase.execute('nike-air-max-270');

            expect(result.variants).toHaveLength(0);
        });

        it('should handle product with undefined variants', async () => {
            const productUndefinedVariants: Product = {
                ...mockProduct,
                variants: undefined,
            };
            const repo = createMockRepo(productUndefinedVariants);
            const useCase = new GetProductDetailsUseCase(repo);

            const result = await useCase.execute('nike-air-max-270');

            expect(result.variants).toBeUndefined();
        });
    });

    describe('Product Status Validation', () => {
        it('should throw InvalidOperationError for ARCHIVED product', async () => {
            const archivedProduct: Product = {
                ...mockProduct,
                status: 'ARCHIVED',
            };
            const repo = createMockRepo(archivedProduct);
            const useCase = new GetProductDetailsUseCase(repo);

            await expect(useCase.execute('nike-air-max-270')).rejects.toThrow('not active');
        });

        it('should throw InvalidOperationError for DRAFT product', async () => {
            const draftProduct: Product = {
                ...mockProduct,
                status: 'DRAFT',
            };
            const repo = createMockRepo(draftProduct);
            const useCase = new GetProductDetailsUseCase(repo);

            await expect(useCase.execute('nike-air-max-270')).rejects.toThrow('not active');
        });

        it('should succeed for ACTIVE product', async () => {
            const activeProduct: Product = {
                ...mockProduct,
                status: 'ACTIVE',
            };
            const repo = createMockRepo(activeProduct);
            const useCase = new GetProductDetailsUseCase(repo);

            const result = await useCase.execute('nike-air-max-270');
            expect(result.status).toBe('ACTIVE');
        });
    });
});
