import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReserveStockUseCase } from '@/core/use-cases/inventory/reserve-stock.use-case';
import { StockInsufficientError } from '@/lib/errors';
import { MockInventoryRepository } from '@/infrastructure/adapters/mock-inventory.repository';

// 3. Test Suite (Refactored for Phase 4)
describe('ReserveStockUseCase (Integration with Mock Repo)', () => {
  let useCase: ReserveStockUseCase;
  let mockRepo: MockInventoryRepository;

  beforeEach(() => {
    // Setup Mock Repo with initial state
    mockRepo = new MockInventoryRepository({
      'SKU-123': 10,
      'SKU-LOW': 1
    });
    useCase = new ReserveStockUseCase(mockRepo);
  });

  it('should reserve stock successfully when inventory is sufficient', async () => {
    // Act
    const result = await useCase.execute({
      variantId: 'SKU-123',
      quantity: 2,
      productId: 'prod_1'
    }, 'session-abc');

    // Assert
    expect(result).toBe(true);

    // Check internal state of mock repo
    const remaining = await mockRepo.getQuantityOnHand('SKU-123');
    expect(remaining).toBe(8); // 10 - 2
  });

  it('should throw StockInsufficientError when inventory is low', async () => {
    // Act & Assert
    await expect(useCase.execute({
      variantId: 'SKU-LOW',
      quantity: 5,
      productId: 'prod_2'
    }, 'session-abc'))
      .rejects
      .toThrow(StockInsufficientError);

    // Verify stock did not change
    const remaining = await mockRepo.getQuantityOnHand('SKU-LOW');
    expect(remaining).toBe(1);
  });
});
