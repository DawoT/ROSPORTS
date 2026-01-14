import { IInventoryRepository } from '@/core/repositories/inventory.repository';
import { StockInsufficientError } from '@/lib/errors';
import { AddToCartDTO } from '@/interface-adapters/dtos/cart.dto';

export class ReserveStockUseCase {
    constructor(private readonly inventoryRepo: IInventoryRepository) { }

    /**
     * Executes the stock reservation logic.
     * @param dto Data transfer object containing SKU and quantity.
     * @param sessionId Session ID for the reservation.
     * @returns Promise<boolean> True if reservation was successful.
     * @throws StockInsufficientError if stock is not available.
     */
    async execute(dto: AddToCartDTO, sessionId: string): Promise<boolean> {
        // In our simplified domain, we assume variantId maps to SKU or we fetch SKU.
        // For this strict implementation, let's assume dto.variantId IS the SKU for now or mapped.
        // To match the requirements strictly, let's treat variantId as the SKU key for simplicity
        // or we would need a VariantRepository to look up SKU from ID.
        // Given the previous steps, let's use variantId as SKU for the inventory repo 
        // to strictly adhere to "ReserveStock(sku...)" signature of repository.

        const sku = dto.variantId;

        // 1. Check availability
        const available = await this.inventoryRepo.getQuantityOnHand(sku);

        if (available < dto.quantity) {
            throw new StockInsufficientError(sku, dto.quantity, available);
        }

        // 2. Reserve
        return this.inventoryRepo.reserveStock(sku, dto.quantity, sessionId);
    }
}
