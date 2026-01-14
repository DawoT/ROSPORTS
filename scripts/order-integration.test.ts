// NO node:assert import
import fs from 'fs';
import { getTestDb, cleanupTestDb, closeTestDb } from '../src/tests/integration/db-helper';
import { DrizzleOrderRepository } from '@/infrastructure/adapters/drizzle-order.repository';
import {
    products,
    productVariants,
    inventoryStock,
    locations,
    orders,
} from '@/infrastructure/database/schema';
import { eq } from 'drizzle-orm';

const LOG_FILE = 'order-test-results.txt';
if (fs.existsSync(LOG_FILE)) fs.unlinkSync(LOG_FILE);

function log(msg: unknown): void {
    const text =
        typeof msg === 'string' ? msg : JSON.stringify(msg, Object.getOwnPropertyNames(msg as object));
    fs.appendFileSync(LOG_FILE, text + '\n');
    process.stderr.write(text + '\n');
}

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
    log('🚀 Starting Order Repository Integration Tests');

    try {
        log('Initializing DB connection...');
        const { db } = await getTestDb();
        const repository = new DrizzleOrderRepository(db);

        await cleanupTestDb();

        // Global Seed Data (Locations)
        const [location] = await db
            .insert(locations)
            .values({
                name: 'Order Warehouse',
                code: 'WH-ORD',
            })
            .returning();

        await runTest('createOrder should create order, items and deduct stock', async () => {
            log('Seeding Product and Variant...');
            const [product] = await db
                .insert(products)
                .values({
                    name: 'Order Test Product',
                    slug: 'order-prod',
                    basePrice: '50.00',
                    status: 'ACTIVE',
                })
                .returning();

            const [variant] = await db
                .insert(productVariants)
                .values({
                    productId: product.id,
                    sku: 'ORD-SKU-1',
                    size: 'L',
                    priceOverride: '55.00', // Override price
                })
                .returning();

            // Initial Stock: 10
            await db.insert(inventoryStock).values({
                variantId: variant.id,
                locationId: location.id,
                quantityOnHand: 10,
                quantityReserved: 0,
                version: 1,
            });

            const customerInput = {
                email: 'test@example.com',
                firstName: 'Test',
                lastName: 'User',
                phone: '555-0101',
                address: '123 Test St',
                city: 'Test City',
            };

            const itemsInput = [
                {
                    variantId: 'ORD-SKU-1', // Using SKU as input per repository logic
                    quantity: 2,
                },
            ];

            log('Executing createOrder...');
            const orderId = await repository.createOrder(customerInput, itemsInput, '123 Test St');
            log(`Created Order ID: ${orderId}`);

            // Verify Order
            const [order] = await db
                .select()
                .from(orders)
                .where(eq(orders.id, parseInt(orderId)));
            assertStrictEqual(order.totalAmount, '110.00', 'Total amount should be 2 * 55.00'); // 110.00
            assertStrictEqual(order.status, 'PENDING');

            // Verify Stock (Deducted 2)
            const [stock] = await db
                .select()
                .from(inventoryStock)
                .where(eq(inventoryStock.variantId, variant.id));
            // Expect 8
            assertStrictEqual(stock.quantityOnHand, 8, 'Stock should be deducted by 2');
        });

        await runTest('findById should return order with items', async () => {
            // Reuse the order created above? Or create new.
            // Let's create a simplified one directly in DB to test retrieval strictly?
            // Or better, assume previous test passed and fetch that order.
            // We need the orderId from previous step.
            // But scope is separate.
            // Let's rely on finding by orderNumber if we knew it, or just query last order.
            const [lastOrder] = await db.select().from(orders).orderBy(orders.createdAt); // desc?
            // Assuming DB is not cleared between runTests in main loop (it isn't).

            if (!lastOrder) throw new Error('No order found to test findById');

            log(`Fetching Order ID: ${lastOrder.id}`);
            const fetchedOrder = await repository.findById(String(lastOrder.id));

            if (!fetchedOrder) throw new Error('Order not found via findById');

            assertStrictEqual(fetchedOrder.id, String(lastOrder.id));
            assertStrictEqual(fetchedOrder.items.length, 1, 'Should have 1 item');
            assertStrictEqual(fetchedOrder.items[0].variantSku, 'ORD-SKU-1');
            assertStrictEqual(fetchedOrder.subtotal, 110.0);
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
