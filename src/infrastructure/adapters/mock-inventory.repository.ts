import { IInventoryRepository } from '@/core/repositories/inventory.repository';

export class MockInventoryRepository implements IInventoryRepository {
    private stockMap = new Map<string, number>();
    private reservations = new Map<string, number>(); // Key: sku-sessionId

    constructor(initialStock: Record<string, number> = {}) {
        Object.entries(initialStock).forEach(([sku, qty]) => {
            this.stockMap.set(sku, qty);
        });
    }

    async getQuantityOnHand(sku: string): Promise<number> {
        return this.stockMap.get(sku) || 0;
    }

    async reserveStock(sku: string, quantity: number, sessionId: string): Promise<boolean> {
        const current = this.stockMap.get(sku) || 0;
        if (current < quantity) {
            return false;
        }

        // Naive implementation: deduct directly for 'reserved' state in this mock
        // In real DB, we would have a separate 'reserved' column or table.
        // For this mock, we will just track it.

        // We treat 'getQuantityOnHand' as 'Available to Promise' (ATP) for this simple mock.
        this.stockMap.set(sku, current - quantity);

        const key = `${sku}-${sessionId}`;
        this.reservations.set(key, (this.reservations.get(key) || 0) + quantity);

        return true;
    }

    async commitReservation(sku: string, quantity: number, sessionId: string): Promise<void> {
        const key = `${sku}-${sessionId}`;
        const reserved = this.reservations.get(key) || 0;

        // If we have reservations, we just clear them as "sold".
        // Since we already deducted from stockMap in reserveStock, we just cleanup the map.
        if (reserved >= quantity) {
            this.reservations.set(key, reserved - quantity);
        }
    }

    async releaseReservation(sku: string, quantity: number, sessionId: string): Promise<void> {
        const key = `${sku}-${sessionId}`;
        const reserved = this.reservations.get(key) || 0;

        if (reserved >= quantity) {
            this.reservations.set(key, reserved - quantity);
            // Add back to stock
            const current = this.stockMap.get(sku) || 0;
            this.stockMap.set(sku, current + quantity);
        }
    }

    // Helper for testing setup
    _setStock(sku: string, qty: number): void {
        this.stockMap.set(sku, qty);
    }
}
