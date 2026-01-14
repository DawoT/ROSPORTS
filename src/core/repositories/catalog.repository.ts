import { Product } from "@/core/domain/types";

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
  findById(id: string): Promise<Product | null>;

  /**
   * Search for products based on filters.
   * @param filters - Pagination and filtering criteria
   */
  searchProducts(filters: {
    page: number;
    limit: number;
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    category?: string;
    brand?: string;
  }): Promise<{ items: Product[]; total: number }>;

  /**
   * Get the current stock status for a specific variant.
   * @param sku - The Stock Keeping Unit
   * @returns 'IN_STOCK' | 'OUT_OF_STOCK' | 'LOW_STOCK'
   */
  getStockStatus(
    sku: string,
  ): Promise<"IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK">;
}
