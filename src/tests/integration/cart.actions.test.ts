import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest';
import { addToCartAction } from '@/interface-adapters/actions/cart.actions';
import { getTestDb, cleanupTestDb, closeTestDb, isDbAvailable } from './db-helper';
import { createFormData, setupCookieMock } from './action-test-helper';
import {
    products,
    productVariants,
    inventoryStock,
    locations,
} from '@/infrastructure/database/schema';
import { eq } from 'drizzle-orm';
import { DrizzleInventoryRepository } from '@/infrastructure/adapters/drizzle-inventory.repository';
import { setInventoryRepository, resetRepositories } from '@/lib/di';

// Mock next/headers
vi.mock('next/headers', () => ({
    cookies: vi.fn(),
}));

describe.skipIf(!isDbAvailable)('addToCartAction Integration', (): void => {
    let mockCookieStore: ReturnType<typeof setupCookieMock>;

    beforeEach(async (): Promise<void> => {
        await cleanupTestDb();
        resetRepositories();
        const { db } = await getTestDb();

        // Inject repository with test DB connection
        setInventoryRepository(new DrizzleInventoryRepository(db));

        mockCookieStore = setupCookieMock();
        const { cookies } = await import('next/headers');
        (cookies as Mock).mockReturnValue(Promise.resolve(mockCookieStore));
    });

    afterEach(async (): Promise<void> => {
        await closeTestDb();
    });

    it('should successfully add an item to cart and create a session', async (): Promise<void> => {
        const { db } = await getTestDb();

        // 1. Seed Data
        const [product] = await db
            .insert(products)
            .values({
                name: 'Nike Zoom Integration',
                slug: 'nike-zoom-int',
                basePrice: '150.00',
                status: 'ACTIVE',
            })
            .returning();

        const [variant] = await db
            .insert(productVariants)
            .values({
                productId: product.id,
                sku: 'NIKE-INT-123',
                size: '10',
                color: 'Black',
            })
            .returning();

        const [location] = await db
            .insert(locations)
            .values({
                name: 'Main Store',
                code: 'MAIN',
            })
            .returning();

        await db.insert(inventoryStock).values({
            variantId: variant.id,
            locationId: location.id,
            quantityOnHand: 10,
            quantityReserved: 0,
            version: 1,
        });

        // 2. Prepare Action Call
        const formData = createFormData({
            variantId: variant.id,
            productId: product.id,
            quantity: 2,
        });

        // 3. Execute
        const result = await addToCartAction(null, formData);

        // 4. Verify
        expect(result.success).toBe(true);
        expect(mockCookieStore.set).toHaveBeenCalledWith(
            'cart_session',
            expect.any(String),
            expect.anything()
        );

        // Verify DB update
        const [stock] = await db
            .select()
            .from(inventoryStock)
            .where(eq(inventoryStock.variantId, variant.id));
        expect(stock.quantityReserved).toBe(2);
        expect(stock.version).toBe(2);
    });

    it('should return error if stock is insufficient', async (): Promise<void> => {
        const { db } = await getTestDb();

        // Seed with low stock
        const [product] = await db
            .insert(products)
            .values({
                name: 'Nike Low Stock',
                slug: 'nike-low',
                basePrice: '150.00',
                status: 'ACTIVE',
            })
            .returning();

        const [variant] = await db
            .insert(productVariants)
            .values({
                productId: product.id,
                sku: 'NIKE-LOW-SKU',
            })
            .returning();

        const [location] = await db
            .insert(locations)
            .values({
                name: 'Main Store',
                code: 'MAIN',
            })
            .returning();

        await db.insert(inventoryStock).values({
            variantId: variant.id,
            locationId: location.id,
            quantityOnHand: 1,
            quantityReserved: 0,
            version: 1,
        });

        const formData = createFormData({
            variantId: variant.id,
            productId: product.id,
            quantity: 5,
        });

        const result = await addToCartAction(null, formData);

        expect(result.success).toBe(false);
        expect(result.message).toContain('Insufficient stock');
    });

    it('should return validation error for invalid quantity', async (): Promise<void> => {
        const formData = createFormData({
            variantId: '123',
            productId: '456',
            quantity: -1,
        });

        const result = await addToCartAction(null, formData);

        expect(result.success).toBe(false);
        expect(result.errors?.quantity).toBeDefined();
    });
});
