import { describe, it, expect, vi } from 'vitest';
import { PlaceOrderUseCase, PlaceOrderInput } from '@/core/use-cases/orders/place-order.use-case';
import { StockInsufficientError } from '@/lib/errors';
import { IOrderRepository } from '@/core/repositories/order.repository';
import { IInventoryRepository } from '@/core/repositories/inventory.repository';

/**
 * This test validates that the PlaceOrderUseCase:
 * 1. Uses SKU (string) to check stock availability
 * 2. Validates stock before creating order
 * 3. Properly calls orderRepo.createOrder with SKU identifiers
 */
describe('PlaceOrderUseCase', () => {
    // Mock implementations
    const createMockOrderRepo = (): IOrderRepository => ({
        createOrder: vi.fn().mockResolvedValue('order-123'),
        findById: vi.fn(),
        findByOrderNumber: vi.fn(),
        updateStatus: vi.fn(),
    });

    const createMockInventoryRepo = (stockBySkU: Record<string, number>): IInventoryRepository => ({
        getQuantityOnHand: vi.fn((sku: string) => Promise.resolve(stockBySkU[sku] ?? 0)),
        reserveStock: vi.fn().mockResolvedValue(true),
        commitReservation: vi.fn().mockResolvedValue(undefined),
        releaseReservation: vi.fn().mockResolvedValue(undefined),
    });

    const baseInput: PlaceOrderInput = {
        customer: {
            email: 'test@example.com',
            firstName: 'Juan',
            lastName: 'Perez',
            address: 'Test Address',
            city: 'Lima',
        },
        items: [{ variantId: 'NIKE-AIR-MAX-270-42', quantity: 1 }],
        shippingAddress: 'Test Address, Lima',
        sessionId: 'session-123',
    };

    it('should create order when stock is available (using SKU)', async () => {
        // Arrange: Stock exists for the SKU
        const orderRepo = createMockOrderRepo();
        const inventoryRepo = createMockInventoryRepo({
            'NIKE-AIR-MAX-270-42': 10,
        });
        const useCase = new PlaceOrderUseCase(orderRepo, inventoryRepo);

        // Act
        const result = await useCase.execute(baseInput);

        // Assert
        expect(result.orderId).toBe('order-123');
        expect(inventoryRepo.getQuantityOnHand).toHaveBeenCalledWith('NIKE-AIR-MAX-270-42');
        expect(orderRepo.createOrder).toHaveBeenCalledWith(
            baseInput.customer,
            baseInput.items,
            baseInput.shippingAddress
        );
    });

    it('should throw StockInsufficientError when SKU has no stock', async () => {
        // Arrange: SKU has zero stock
        const orderRepo = createMockOrderRepo();
        const inventoryRepo = createMockInventoryRepo({
            'NIKE-AIR-MAX-270-42': 0, // No stock
        });
        const useCase = new PlaceOrderUseCase(orderRepo, inventoryRepo);

        // Act & Assert
        await expect(useCase.execute(baseInput)).rejects.toThrow(StockInsufficientError);

        // Order should NOT be created
        expect(orderRepo.createOrder).not.toHaveBeenCalled();
    });

    it('should throw StockInsufficientError when SKU does not exist', async () => {
        // Arrange: Empty stock map (simulating unknown SKU)
        const orderRepo = createMockOrderRepo();
        const inventoryRepo = createMockInventoryRepo({}); // Empty = returns 0 for any SKU
        const useCase = new PlaceOrderUseCase(orderRepo, inventoryRepo);

        // Act & Assert
        await expect(useCase.execute(baseInput)).rejects.toThrow(StockInsufficientError);
    });

    it('should validate all items before creating order', async () => {
        // Arrange: Multiple items, one without stock
        const orderRepo = createMockOrderRepo();
        const inventoryRepo = createMockInventoryRepo({
            'NIKE-AIR-MAX-270-42': 5,
            'ADIDAS-UB-22-42': 0, // This one has no stock
        });
        const useCase = new PlaceOrderUseCase(orderRepo, inventoryRepo);

        const inputWithMultipleItems: PlaceOrderInput = {
            ...baseInput,
            items: [
                { variantId: 'NIKE-AIR-MAX-270-42', quantity: 1 },
                { variantId: 'ADIDAS-UB-22-42', quantity: 2 },
            ],
        };

        // Act & Assert
        await expect(useCase.execute(inputWithMultipleItems)).rejects.toThrow(
            StockInsufficientError
        );

        // Order should NOT be created
        expect(orderRepo.createOrder).not.toHaveBeenCalled();
    });

    it('should fail when requested quantity exceeds available stock', async () => {
        // Arrange
        const orderRepo = createMockOrderRepo();
        const inventoryRepo = createMockInventoryRepo({
            'NIKE-AIR-MAX-270-42': 2, // Only 2 available
        });
        const useCase = new PlaceOrderUseCase(orderRepo, inventoryRepo);

        const inputWithHighQuantity: PlaceOrderInput = {
            ...baseInput,
            items: [
                { variantId: 'NIKE-AIR-MAX-270-42', quantity: 5 }, // Requesting 5
            ],
        };

        // Act & Assert
        await expect(useCase.execute(inputWithHighQuantity)).rejects.toThrow(
            StockInsufficientError
        );

        // Verify the error contains correct metadata
        try {
            await useCase.execute(inputWithHighQuantity);
        } catch (error) {
            expect(error).toBeInstanceOf(StockInsufficientError);
            const stockError = error as StockInsufficientError;
            expect(stockError.available).toBe(2);
            expect(stockError.requested).toBe(5);
        }
    });
});
