import { db } from '../database/connection';
import { inventoryStock, productVariants } from '../database/schema';
import { eq, sql, and } from 'drizzle-orm';
import { IInventoryRepository } from '@/core/repositories/inventory.repository';

import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';

export class DrizzleInventoryRepository implements IInventoryRepository {
    constructor(private readonly database: NodePgDatabase<typeof schema> = db) {}

    async getQuantityOnHand(variantId: string): Promise<number> {
        // First, find the numeric ID if it's a SKU
        let actualId: number;
        if (isNaN(Number(variantId))) {
            const variant = await this.database
                .select({ id: productVariants.id })
                .from(productVariants)
                .where(eq(productVariants.sku, variantId))
                .limit(1);

            if (variant.length === 0) return 0;
            actualId = variant[0].id;
        } else {
            actualId = Number(variantId);
        }

        const result = await this.database
            .select({
                total: sql<number>`sum(${inventoryStock.quantityOnHand} - ${inventoryStock.quantityReserved})`,
            })
            .from(inventoryStock)
            .where(eq(inventoryStock.variantId, actualId));

        return Number(result[0]?.total) || 0;
    }

    async reserveStock(variantId: string, quantity: number, _sessionId: string): Promise<boolean> {
        return await this.database.transaction(async (tx) => {
            // 1. Resolve numeric ID if it's a SKU
            let actualId: number;
            if (isNaN(Number(variantId))) {
                const variants = await tx
                    .select({ id: productVariants.id })
                    .from(productVariants)
                    .where(eq(productVariants.sku, variantId))
                    .limit(1);
                if (variants.length === 0) return false;
                actualId = variants[0].id;
            } else {
                actualId = Number(variantId);
            }

            // 2. Find suitable inventory record (e.g., first location with enough stock)
            // This is a naive "first fit" strategy.
            // Logic: quantity_on_hand - quantity_reserved >= requested
            const stockRecords = await tx
                .select()
                .from(inventoryStock)
                .where(eq(inventoryStock.variantId, actualId));

            const targetRecord = stockRecords.find(
                (r) => r.quantityOnHand - r.quantityReserved >= quantity
            );

            if (!targetRecord) {
                return false; // Not enough stock in any single location
            }

            // 3. Update with Optimistic Locking
            // Update inventory_stock SET reserved = reserved + qty, version = version + 1 WHERE id = ID AND version = oldVersion
            const updateResult = await tx
                .update(inventoryStock)
                .set({
                    quantityReserved: targetRecord.quantityReserved + quantity,
                    version: sql`${inventoryStock.version} + 1`,
                })
                .where(
                    and(
                        eq(inventoryStock.id, targetRecord.id),
                        eq(inventoryStock.version, targetRecord.version)
                    )
                )
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

    async commitReservation(
        variantId: string,
        quantity: number,
        _sessionId: string
    ): Promise<void> {
        // 1. Resolve numeric ID if it's a SKU
        let actualId: number;
        if (isNaN(Number(variantId))) {
            const variant = await this.database
                .select({ id: productVariants.id })
                .from(productVariants)
                .where(eq(productVariants.sku, variantId))
                .limit(1);

            if (variant.length === 0) return;
            actualId = variant[0].id;
        } else {
            actualId = Number(variantId);
        }

        // 2. Perform the update: decrease total on hand and clear reservation
        // Simple strategy: we assume the reservation exists for this variant.
        // In a full implementation, we would match by sessionId.
        await this.database
            .update(inventoryStock)
            .set({
                quantityOnHand: sql`${inventoryStock.quantityOnHand} - ${quantity}`,
                quantityReserved: sql`CASE 
                    WHEN ${inventoryStock.quantityReserved} >= ${quantity} THEN ${inventoryStock.quantityReserved} - ${quantity} 
                    ELSE 0 
                END`,
                version: sql`${inventoryStock.version} + 1`,
            })
            .where(eq(inventoryStock.variantId, actualId));
    }

    async releaseReservation(
        _variantId: string,
        _quantity: number,
        _sessionId: string
    ): Promise<void> {
        // Implementation placeholder for Phase 6
    }
}
