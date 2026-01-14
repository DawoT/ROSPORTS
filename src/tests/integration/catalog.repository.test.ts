import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getTestDb, cleanupTestDb, closeTestDb } from './db-helper';
import { DrizzleCatalogRepository } from '@/infrastructure/adapters/drizzle-catalog.repository';
import {
    products,
    productVariants,
    inventoryStock,
    locations,
} from '@/infrastructure/database/schema';

describe('Catalog Repository Integration', () => {
    let repository: DrizzleCatalogRepository;

    beforeEach(async () => {
        const { db } = await getTestDb();
        repository = new DrizzleCatalogRepository(db);
        await cleanupTestDb();
    });

    afterEach(async () => {
        await closeTestDb();
    });

    it('should find a product by slug with variants', async () => {
        const { db } = await getTestDb();

        // 1. Seed Data
        const [insertedProduct] = await db
            .insert(products)
            .values({
                name: 'Test Product',
                slug: 'test-product',
                basePrice: '100.00',
                status: 'ACTIVE',
            })
            .returning();

        if (!insertedProduct) throw new Error('Failed to seed product');

        await db.insert(productVariants).values([
            {
                productId: insertedProduct.id,
                sku: 'TEST-SKU-1',
                size: 'M',
                color: 'Red',
                priceOverride: '110.00',
            },
            {
                productId: insertedProduct.id,
                sku: 'TEST-SKU-2',
                size: 'L',
                color: 'Blue',
            },
        ]);

        // 2. Execute
        const product = await repository.findBySlug('test-product');

        // 3. Verify
        expect(product).toBeDefined();
        if (!product) throw new Error('Product not found');
        if (!product.variants) throw new Error('Variants not loaded');

        expect(product.id).toBe(String(insertedProduct.id));
        expect(product.name).toBe('Test Product');
        expect(product.variants).toHaveLength(2);

        const firstVariant = product.variants[0];
        if (!firstVariant) throw new Error('Variant not found');
        expect(firstVariant.sku).toBe('TEST-SKU-1');
    });

    it('should return null for non-existent slug', async () => {
        const product = await repository.findBySlug('non-existent');
        expect(product).toBeNull();
    });

    it('should calculate stock status correctly', async () => {
        const { db } = await getTestDb();

        // 1. Seed Data
        const [insertedProduct] = await db
            .insert(products)
            .values({
                name: 'Stock Product',
                slug: 'stock-product',
                basePrice: '50.00',
                status: 'ACTIVE',
            })
            .returning();

        const [variant] = await db
            .insert(productVariants)
            .values({
                productId: insertedProduct.id,
                sku: 'STOCK-SKU',
            })
            .returning();

        const [location] = await db
            .insert(locations)
            .values({
                name: 'Main Warehouse',
                code: 'WH-MAIN',
            })
            .returning();

        // Insert stock: 10 on hand, 2 reserved = 8 available
        await db.insert(inventoryStock).values({
            variantId: variant.id,
            locationId: location.id,
            quantityOnHand: 10,
            quantityReserved: 3,
            version: 1,
        });

        // 2. Execute
        const status = await repository.getStockStatus(String(variant.id));

        // 3. Verify
        expect(status.quantityAvailable).toBe(7); // 10 - 3
        expect(status.isInStock).toBe(true);
    });
});
