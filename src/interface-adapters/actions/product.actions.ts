'use server';

import { getCatalogRepository } from '@/lib/di';
import { GetProductDetailsUseCase } from '@/core/use-cases/catalog/get-product-details.use-case';
import { ProductNotFoundError, InvalidOperationError } from '@/lib/errors';
import { Product } from '@/core/domain/types';
import { ProductSearchResult } from '@/core/repositories/catalog.repository';

/**
 * Standardized Action State for product operations.
 */
export interface ProductActionState<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
}

/**
 * Server Action: Get product details by slug.
 */
export async function getProductBySlugAction(slug: string): Promise<ProductActionState<Product>> {
    try {
        const repo = getCatalogRepository();
        const useCase = new GetProductDetailsUseCase(repo);

        const product = await useCase.execute(slug);

        return {
            success: true,
            data: product,
        };
    } catch (error) {
        if (error instanceof ProductNotFoundError) {
            return {
                success: false,
                message: `Product "${slug}" not found.`,
            };
        }

        if (error instanceof InvalidOperationError) {
            return {
                success: false,
                message: error.message,
            };
        }

        console.error('GetProductBySlug Error:', error);

        return {
            success: false,
            message: 'An unexpected error occurred while fetching the product.',
        };
    }
}

/**
 * Server Action: Search/list products with pagination.
 */
export async function getProductsAction(
    page: number = 1,
    query?: string
): Promise<ProductActionState<ProductSearchResult>> {
    try {
        const repo = getCatalogRepository();

        const result = await repo.searchProducts(query, page, 20);

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error('GetProducts Error:', error);

        return {
            success: false,
            message: 'An unexpected error occurred while fetching products.',
        };
    }
}
