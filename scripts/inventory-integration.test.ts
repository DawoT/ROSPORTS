// NO node:assert import
import fs from 'fs';
import { getTestDb, cleanupTestDb, closeTestDb } from '../src/tests/integration/db-helper';
import { DrizzleInventoryRepository } from '@/infrastructure/adapters/drizzle-inventory.repository';
import {
    products,
    productVariants,
    inventoryStock,
    locations,
} from '@/infrastructure/database/schema';
import { eq } from 'drizzle-orm';

const LOG_FILE = 'test-results.txt';
if (fs.existsSync(LOG_FILE)) fs.unlinkSync(LOG_FILE);

function log(msg: unknown): void {
    const text =
        typeof msg === 'string'
            ? msg
            : JSON.stringify(msg, Object.getOwnPropertyNames(msg as object));
    fs.appendFileSync(LOG_FILE, text + '\n');
    process.stderr.write(text + '\n');
}

// Simple Assertion Helper
function assertStrictEqual(actual: unknown, expected: unknown, message?: string): void {
    if (actual !== expected)
        throw new Error(`${message || 'Assertion failed'}: Expected ${expected}, got ${actual}`);
}

async function runTest(name: string, fn: () => Promise<void>): Promise<void> {
    log(`⏳ Testing: ${name} ... `);
    try {
        await fn();
        log('✅ PASS');
    } catch (err: unknown) {
        log('❌ FAIL');
        log('--- ERROR DETAILS ---');
        log(err);
        log('---------------------');
        process.exit(1);
    }
}

async function main(): Promise<void> {
    log('🚀 Starting Inventory Repository Integration Tests');

    try {
        log('Initializing DB connection...');
        // Setup
        const { db } = await getTestDb();
        log('DB Connected. Instantiating Repository...');
        const repository = new DrizzleInventoryRepository(db);

        // Initial Cleanup
        await cleanupTestDb();

        await runTest('getQuantityOnHand should return 0 for unknown SKU', async () => {
            log('Calling UNKNOWN-SKU');
            const qty = await repository.getQuantityOnHand('UNKNOWN-SKU');
            log(`Got qty: ${qty}`);
            assertStrictEqual(qty, 0, 'Should return 0 for unknown SKU');
        });

        await runTest('getQuantityOnHand should return correct available quantity', async () => {
            log('--- Seeding Data ---');
            // 1. Seed Data
            const [insertedProduct] = await db
                .insert(products)
                .values({
                    name: 'Inventory Valid Product',
                    slug: 'inv-product',
                    basePrice: '100.00',
                    status: 'ACTIVE',
                })
                .returning();
            log(`Seeded Product: ${insertedProduct.id}`);

            const [variant] = await db
                .insert(productVariants)
                .values({
                    productId: insertedProduct.id,
                    sku: 'INV-SKU-1',
                    size: 'M',
                })
                .returning();
            log(`Seeded Variant: ${variant.id}`);

            const [location] = await db
                .insert(locations)
                .values({
                    name: 'Inventory Warehouse',
                    code: 'WH-INV',
                })
                .returning();
            log(`Seeded Location: ${location.id}`);

            // Insert stock: 20 on hand, 5 reserved = 15 available
            await db.insert(inventoryStock).values({
                variantId: variant.id,
                locationId: location.id,
                quantityOnHand: 20,
                quantityReserved: 5,
                version: 1,
            });
            log('Seeded Stock');

            // 2. Execute
            const qty = await repository.getQuantityOnHand('INV-SKU-1');

            // 3. Verify
            assertStrictEqual(qty, 15);
        });

        await runTest('reserveStock should successfully reserve available stock', async () => {
            // 1. Seed Data
            const [variant] = await db
                .insert(productVariants)
                .values({
                    sku: 'INV-RESERVE-SKU',
                })
                .returning();

            const [prod] = await db
                .insert(products)
                .values({
                    name: 'Reserve Product',
                    slug: 'reserve-prod',
                    basePrice: '10.00',
                })
                .returning();

            await db
                .update(productVariants)
                .set({ productId: prod.id })
                .where(eq(productVariants.id, variant.id)); // Link

            const [location] = await db.select().from(locations).limit(1); // reuse location

            // Stock: 10 on hand, 0 reserved
            await db.insert(inventoryStock).values({
                variantId: variant.id,
                locationId: location.id,
                quantityOnHand: 10,
                quantityReserved: 0,
                version: 1,
            });

            // 2. Execute
            const success = await repository.reserveStock('INV-RESERVE-SKU', 3, 'session-123');

            // 3. Verify
            assertStrictEqual(success, true, 'Reserve should succeed');

            const [updatedStock] = await db
                .select()
                .from(inventoryStock)
                .where(eq(inventoryStock.variantId, variant.id));
            assertStrictEqual(
                updatedStock.quantityReserved,
                3,
                'Reserved quantity should increase'
            );
            assertStrictEqual(updatedStock.version, 2, 'Version should increment');
        });

        await runTest('reserveStock should fail if insufficient stock', async () => {
            // using same setup as above, remaining available is 7 (10 - 3)
            // try to reserve 8
            const success = await repository.reserveStock('INV-RESERVE-SKU', 8, 'session-123');
            assertStrictEqual(success, false, 'Should fail due to insufficient stock');
        });
    } catch (e) {
        log(e);
        process.exit(1);
    } finally {
        await closeTestDb();
        log('Done');
    }
}

main().catch((err) => log(err));
