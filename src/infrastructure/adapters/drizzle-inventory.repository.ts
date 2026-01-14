import { db } from '../database/connection';
import { inventoryStock, productVariants } from '../database/schema';
import { eq, sql, and } from 'drizzle-orm';
import { IInventoryRepository } from '@/core/repositories/inventory.repository';

export class DrizzleInventoryRepository implements IInventoryRepository {

    async getQuantityOnHand(sku: string): Promise<number> {
        // Join inventory with variants to filter by SKU
        // Assuming SUM across all locations for simplicity, or we pick a default location.
        // Spec implied "availability", let's sum available (onHand - reserved).

        // First, find the variant ID
        const variant = await db.select({ id: productVariants.id })
            .from(productVariants)
            .where(eq(productVariants.sku, sku))
            .limit(1);

        if (variant.length === 0) return 0;

        const result = await db.select({
            total: sql<number>`sum(${inventoryStock.quantityOnHand} - ${inventoryStock.quantityReserved})`
        })
            .from(inventoryStock)
            .where(eq(inventoryStock.variantId, variant[0].id));

        return result[0]?.total || 0;
    }

    async reserveStock(sku: string, quantity: number, sessionId: string): Promise<boolean> {
        return await db.transaction(async (tx) => {
            // 1. Get Variant ID
            const variants = await tx.select().from(productVariants).where(eq(productVariants.sku, sku)).limit(1);
            if (variants.length === 0) return false;
            const variantId = variants[0].id;

            // 2. Find suitable inventory record (e.g., first location with enough stock)
            // This is a naive "first fit" strategy.
            // Logic: quantity_on_hand - quantity_reserved >= requested
            const stockRecords = await tx.select()
                .from(inventoryStock)
                .where(eq(inventoryStock.variantId, variantId));

            const targetRecord = stockRecords.find(r => (r.quantityOnHand - r.quantityReserved) >= quantity);

            if (!targetRecord) {
                return false; // Not enough stock in any single location
            }

            // 3. Update with Optimistic Locking
            // Update inventory_stock SET reserved = reserved + qty, version = version + 1 WHERE id = ID AND version = oldVersion
            const updateResult = await tx.update(inventoryStock)
                .set({
                    quantityReserved: targetRecord.quantityReserved + quantity,
                    version: sql`${inventoryStock.version} + 1`
                })
                .where(and(
                    eq(inventoryStock.id, targetRecord.id),
                    eq(inventoryStock.version, targetRecord.version)
                ))
                .returning();

            if (updateResult.length === 0) {
                // Concurrency conflict occurred (version changed)
                // In a retry loop, we would restart. For now, fail.
                return false;
            }

            // TODO: Create a "reservation" record in a separate table (inventory_reservations) 
            // as per ERD, passing sessionId. For this scope, the Interface just returns boolean.
            // We will assume the inventory update is sufficient for the "ReserveStock" core logic contract for now.

            return true;
        });
    }

    async commitReservation(sku: string, quantity: number, sessionId: string): Promise<void> {
        // Implementation placeholder for Phase 6
        // Logic: Decrease quantityOnHand by quantity, Decrease quantityReserved by quantity.
    }

    async releaseReservation(sku: string, quantity: number, sessionId: string): Promise<void> {
        // Implementation placeholder for Phase 6
        // Logic: Decrease quantityReserved by quantity.
    }
}
