import { Product } from '@/core/domain/types';

/**
 * Search result structure for paginated product lists.
 */
export interface ProductSearchResult {
  items: Product[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Stock availability status for a variant.
 */
export interface StockStatus {
  quantityAvailable: number;
  isInStock: boolean;
}

/**
 * Interface for Catalog Data Access (Port).
 */
export interface ICatalogRepository {
  /**
   * Find a product by its unique slug.
   * @param slug The URL-friendly identifier.
   * @returns The Product or null if not found.
   */
  findBySlug(slug: string): Promise<Product | null>;

  /**
   * Find a product by its internal ID.
   * @param id The product ID.
   */
  findById?(id: string): Promise<Product | null>;

  /**
   * Search for products based on filters.
   * @param query - Search query string (optional)
   * @param page - Page number (1-indexed)
   * @param limit - Items per page
   */
  searchProducts(
    query?: string,
    page?: number,
    limit?: number
  ): Promise<ProductSearchResult>;

  /**
   * Get the current stock status for a specific variant.
   * @param variantId - The variant ID
   */
  getStockStatus(variantId: string): Promise<StockStatus>;
}
