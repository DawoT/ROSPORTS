import { IInventoryRepository } from '@/core/repositories/inventory.repository';
import { StockInsufficientError } from '@/lib/errors';
import { AddToCartDTO } from '@/interface-adapters/dtos/cart.dto';

// Ensure the class is exported for Use Case usage
export class ReserveStockUseCase {
    constructor(private readonly inventoryRepo: IInventoryRepository) {}

    /**
     * Executes the stock reservation logic.
     * @param dto Data transfer object containing SKU and quantity.
     * @param sessionId Session ID for the reservation.
     * @returns Promise<boolean> True if reservation was successful.
     * @throws StockInsufficientError if stock is not available.
     */
    async execute(dto: AddToCartDTO, sessionId: string): Promise<boolean> {
        const sku = dto.variantId;

        // 1. Check availability
        const available = await this.inventoryRepo.getQuantityOnHand(sku);

        // Strict check: Available must be >= requested
        if (available < dto.quantity) {
            throw new StockInsufficientError(sku, dto.quantity, available);
        }

        // 2. Reserve
        return this.inventoryRepo.reserveStock(sku, dto.quantity, sessionId);
    }
}
