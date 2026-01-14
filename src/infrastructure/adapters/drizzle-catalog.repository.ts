import { db } from '../database/connection';
import { products, productVariants, inventoryStock } from '../database/schema';
import { eq, like, and, sql } from 'drizzle-orm';
import { ICatalogRepository, ProductSearchResult, StockStatus } from '@/core/repositories/catalog.repository';
import { Product, Variant } from '@/core/domain/types';

export class DrizzleCatalogRepository implements ICatalogRepository {

    async findBySlug(slug: string): Promise<Product | null> {
        const result = await db.select()
            .from(products)
            .where(eq(products.slug, slug))
            .limit(1);

        if (result.length === 0) return null;

        const row = result[0];

        // Get variants for this product
        const variantRows = await db.select()
            .from(productVariants)
            .where(eq(productVariants.productId, row.id));

        const variants: Variant[] = variantRows.map(v => ({
            id: String(v.id),
            productId: String(v.productId),
            sku: v.sku,
            size: v.size ?? '',
            color: v.color ?? '',
            priceOverride: v.priceOverride ? parseFloat(v.priceOverride) : undefined,
            isActive: v.isActive ?? true,
        }));

        return {
            id: String(row.id),
            name: row.name,
            slug: row.slug,
            descriptionShort: row.descriptionShort ?? undefined,
            descriptionLong: row.descriptionLong ?? undefined,
            basePrice: parseFloat(row.basePrice),
            status: row.status as 'ACTIVE' | 'DRAFT' | 'ARCHIVED',
            variants,
        };
    }

    async searchProducts(query?: string, page?: number, limit?: number): Promise<ProductSearchResult> {
        const pageNum = page || 1;
        const limitNum = limit || 20;
        const offset = (pageNum - 1) * limitNum;

        // Build query conditions
        const conditions = [eq(products.status, 'ACTIVE')];
        if (query) {
            conditions.push(like(products.name, `%${query}%`));
        }

        // Get total count
        const countResult = await db.select({ count: sql<number>`count(*)` })
            .from(products)
            .where(and(...conditions));

        const total = countResult[0]?.count || 0;

        // Get paginated results
        const rows = await db.select()
            .from(products)
            .where(and(...conditions))
            .limit(limitNum)
            .offset(offset);

        // Fetch variants for each product
        const items: Product[] = [];
        for (const row of rows) {
            const variantRows = await db.select()
                .from(productVariants)
                .where(eq(productVariants.productId, row.id))
                .limit(1); // Just get first variant for SKU display

            const variant = variantRows[0];

            items.push({
                id: String(row.id),
                name: row.name,
                slug: row.slug,
                descriptionShort: row.descriptionShort ?? undefined,
                basePrice: parseFloat(row.basePrice),
                status: row.status as 'ACTIVE' | 'DRAFT' | 'ARCHIVED',
                variants: variant ? [{
                    id: String(variant.id),
                    productId: String(variant.productId),
                    sku: variant.sku,
                    size: variant.size ?? '',
                    color: variant.color ?? '',
                    isActive: variant.isActive ?? true,
                }] : [],
            });
        }

        return {
            items,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
        };
    }

    async getStockStatus(variantId: string): Promise<StockStatus> {
        const result = await db.select({
            onHand: sql<number>`sum(${inventoryStock.quantityOnHand})`,
            reserved: sql<number>`sum(${inventoryStock.quantityReserved})`,
        })
            .from(inventoryStock)
            .where(eq(inventoryStock.variantId, parseInt(variantId)));

        const onHand = result[0]?.onHand || 0;
        const reserved = result[0]?.reserved || 0;
        const available = onHand - reserved;

        return {
            quantityAvailable: available,
            isInStock: available > 0,
        };
    }
}
