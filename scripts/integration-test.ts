import assert from 'node:assert';
import { getTestDb, cleanupTestDb, closeTestDb } from '../src/tests/integration/db-helper';
import { DrizzleCatalogRepository } from '@/infrastructure/adapters/drizzle-catalog.repository';
import {
    products,
    productVariants,
    inventoryStock,
    locations,
} from '@/infrastructure/database/schema';

// Simple Test Runner Helpers
async function runTest(name: string, fn: () => Promise<void>): Promise<void> {
    process.stdout.write(`⏳ Testing: ${name} ... `);
    try {
        await fn();
        console.log('✅ PASS');
    } catch (err: unknown) {
        console.log('❌ FAIL');
        console.error(err);
        process.exit(1);
    }
}

async function main(): Promise<void> {
    console.log('🚀 Starting Catalog Repository Integration Tests');

    // Setup
    const { db } = await getTestDb();
    const repository = new DrizzleCatalogRepository(db);

    try {
        await runTest('Setup: Cleanup DB', async () => {
            await cleanupTestDb();
        });

        await runTest('should find a product by slug with variants', async () => {
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
            assert.ok(product, 'Product should be defined');
            assert.strictEqual(product.id, String(insertedProduct.id));
            assert.strictEqual(product.name, 'Test Product');
            assert.strictEqual(product?.variants?.length, 2);
            assert.strictEqual(product?.variants?.[0].sku, 'TEST-SKU-1');
        });

        await runTest('should return null for non-existent slug', async () => {
            const product = await repository.findBySlug('non-existent');
            assert.strictEqual(product, null);
        });

        await runTest('should calculate stock status correctly', async () => {
            // Cleanup specific to this test? No, strict sequence.
            // But we should cleanup or ensure unique data.
            // Let's rely on unique slugs/skus for this run.

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
            });

            // 2. Execute
            const status = await repository.getStockStatus(String(variant.id));

            // 3. Verify
            assert.strictEqual(status.quantityAvailable, 7); // 10 - 3
            assert.strictEqual(status.isInStock, true);
        });
    } finally {
        // Teardown
        await closeTestDb();
    }
}

// execute
main().catch(console.error);
