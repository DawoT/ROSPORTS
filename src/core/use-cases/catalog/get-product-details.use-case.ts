import { ICatalogRepository } from '@/core/repositories/catalog.repository';
import { Product } from '@/core/domain/types';
import { ProductNotFoundError, InvalidOperationError } from '@/lib/errors';

export class GetProductDetailsUseCase {
    constructor(private readonly catalogRepo: ICatalogRepository) { }

    /**
     * Retrieves product details and verifies status.
     * @param slug Product slug
     * @returns Promise<Product>
     * @throws ProductNotFoundError if not found
     * @throws InvalidOperationError if product is not active
     */
    async execute(slug: string): Promise<Product> {
        const product = await this.catalogRepo.findBySlug(slug);

        if (!product) {
            throw new ProductNotFoundError(slug);
        }

        if (product.status !== 'ACTIVE') {
            // In a real store, you might want to show drafts to admins,
            // but for the strict public "Shop" scope, we block it.
            throw new InvalidOperationError(`Product ${slug} is not active.`);
        }

        return product;
    }
}
