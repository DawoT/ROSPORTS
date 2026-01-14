import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest';
import { placeOrderAction } from '@/interface-adapters/actions/checkout.actions';
import { getTestDb, cleanupTestDb, closeTestDb } from './db-helper';
import { createFormData, setupCookieMock } from './action-test-helper';
import {
    products,
    productVariants,
    inventoryStock,
    locations,
    orders,
    customers,
} from '@/infrastructure/database/schema';
import { eq } from 'drizzle-orm';
import { DrizzleInventoryRepository } from '@/infrastructure/adapters/drizzle-inventory.repository';
import { DrizzleOrderRepository } from '@/infrastructure/adapters/drizzle-order.repository';
import { setInventoryRepository, setOrderRepository, resetRepositories } from '@/lib/di';

// Mock next/headers
vi.mock('next/headers', () => ({
    cookies: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
    redirect: vi.fn((url: string): never => {
        const error = new Error('NEXT_REDIRECT') as Error & { digest?: string };
        error.digest = `NEXT_REDIRECT;${url};303;`;
        throw error;
    }),
}));

describe('placeOrderAction Integration', (): void => {
    let mockCookieStore: ReturnType<typeof setupCookieMock>;

    beforeEach(async (): Promise<void> => {
        await cleanupTestDb();
        resetRepositories();
        const { db } = await getTestDb();

        // Inject repositories with test DB connection
        setInventoryRepository(new DrizzleInventoryRepository(db));
        setOrderRepository(new DrizzleOrderRepository(db));

        mockCookieStore = setupCookieMock({ cart_session: 'test-session-id' });
        const { cookies } = await import('next/headers');
        (cookies as Mock).mockReturnValue(Promise.resolve(mockCookieStore));
    });

    afterEach(async (): Promise<void> => {
        await closeTestDb();
    });

    it('should successfully place an order and redirect', async (): Promise<void> => {
        const { db } = await getTestDb();

        // 1. Seed Data
        const [product] = await db
            .insert(products)
            .values({
                name: 'Adidas Runner Integration',
                slug: 'adidas-runner-int',
                basePrice: '120.00',
                status: 'ACTIVE',
            })
            .returning();

        const [variant] = await db
            .insert(productVariants)
            .values({
                productId: product.id,
                sku: 'ADI-RUN-123',
                size: '9',
                color: 'Blue',
            })
            .returning();

        const [location] = await db
            .insert(locations)
            .values({
                name: 'Warehouse A',
                code: 'WARA',
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
        const cartItems = [
            { variantId: variant.id, quantity: 1, productName: 'Adidas Runner', price: 120 },
        ];

        const formData = createFormData({
            firstName: 'Integration',
            lastName: 'Tester',
            email: 'tester@example.com',
            phone: '987654321',
            address: 'Avenida 123',
            city: 'Lima',
            cartItems: cartItems,
        });

        // 3. Execute & Expect Success Object with Order ID
        const result = await placeOrderAction(null, formData);

        expect(result.success).toBe(true);
        expect(result.orderId).toBeDefined();

        // 4. Verify DB State
        const [order] = await db
            .select()
            .from(orders)
            .where(eq(orders.id, Number(result.orderId!)));
        expect(order).toBeDefined();

        // Ensure the order in DB aligns with implementation details
        expect(String(order.id)).toBe(result.orderId);

        // Verify customer via join or separate query
        const [customer] = await db
            .select()
            .from(customers)
            .where(eq(customers.id, order.customerId!));
        expect(customer.email).toBe('tester@example.com');

        const [stock] = await db
            .select()
            .from(inventoryStock)
            .where(eq(inventoryStock.variantId, variant.id));
        expect(stock.quantityOnHand).toBe(9);
        expect(stock.quantityReserved).toBe(0);
    });

    it('should return validation error for missing fields', async (): Promise<void> => {
        const formData = createFormData({
            firstName: '', // Invalid
            email: 'not-an-email', // Invalid
            cartItems: [], // Empty
        });

        const result = await placeOrderAction(null, formData);

        expect(result.success).toBe(false);
        expect(result.errors?.firstName).toBeDefined();
        expect(result.errors?.email).toBeDefined();
    });

    it('should return error for empty cart', async (): Promise<void> => {
        const formData = createFormData({
            firstName: 'Integration',
            lastName: 'Tester',
            email: 'tester@example.com',
            phone: '987654321',
            address: 'Avenida 123',
            city: 'Lima',
            cartItems: [], // Empty
        });

        const result = await placeOrderAction(null, formData);

        expect(result.success).toBe(false);
        expect(result.message).toContain('carrito est');
    });
});
