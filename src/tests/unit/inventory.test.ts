import { describe, it, expect, vi, beforeEach } from "vitest";
import { IInventoryRepository } from "@/core/repositories/inventory.repository";
import { StockInsufficientError } from "@/lib/errors";

// 1. Mock Implementations
const mockInventoryRepo = {
  getQuantityOnHand: vi.fn(),
  reserveStock: vi.fn(),
  commitReservation: vi.fn(),
  releaseReservation: vi.fn(),
} as unknown as IInventoryRepository;

// 2. Hypothetical Use Case (Inline for TDD, normally in src/core/use-cases)
class ReserveStockUseCase {
  constructor(private repo: IInventoryRepository) {}

  async execute(
    sku: string,
    quantity: number,
    sessionId: string,
  ): Promise<boolean> {
    const available = await this.repo.getQuantityOnHand(sku);
    if (available < quantity) {
      throw new StockInsufficientError(sku, quantity, available);
    }
    return this.repo.reserveStock(sku, quantity, sessionId);
  }
}

// 3. Test Suite
describe("ReserveStockUseCase (TDD)", () => {
  let useCase: ReserveStockUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new ReserveStockUseCase(mockInventoryRepo);
  });

  it("should reserve stock successfull when inventory is sufficient", async () => {
    // Arrange
    vi.mocked(mockInventoryRepo.getQuantityOnHand).mockResolvedValue(10);
    vi.mocked(mockInventoryRepo.reserveStock).mockResolvedValue(true);

    // Act
    const result = await useCase.execute("SKU-123", 2, "session-abc");

    // Assert
    expect(result).toBe(true);
    expect(mockInventoryRepo.getQuantityOnHand).toHaveBeenCalledWith("SKU-123");
    expect(mockInventoryRepo.reserveStock).toHaveBeenCalledWith(
      "SKU-123",
      2,
      "session-abc",
    );
  });

  it("should throw StockInsufficientError when inventory is low", async () => {
    // Arrange
    vi.mocked(mockInventoryRepo.getQuantityOnHand).mockResolvedValue(1); // Only 1 available

    // Act & Assert
    await expect(useCase.execute("SKU-123", 5, "session-abc")).rejects.toThrow(
      StockInsufficientError,
    );

    expect(mockInventoryRepo.reserveStock).not.toHaveBeenCalled();
  });
});
