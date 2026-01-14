/**
 * Interface for Inventory Operations (Port).
 */
export interface IInventoryRepository {
    /**
     * Attempt to reserve stock for a session (e.g. checkout).
     * @param variantId Product SKU or numeric ID
     * @param quantity Amount to reserve
     * @param sessionId User session ID or Cart ID
     * @returns boolean indicating success or failure
     */
    reserveStock(variantId: string, quantity: number, sessionId: string): Promise<boolean>;

    /**
     * Commit a reservation (convert to permanent deduction on order confirm).
     */
    commitReservation(variantId: string, quantity: number, sessionId: string): Promise<void>;

    /**
     * Release reserved stock (e.g. cart timeout or removal).
     */
    releaseReservation(variantId: string, quantity: number, sessionId: string): Promise<void>;

    /**
     * Get the precise quantity currently available on hand.
     */
    getQuantityOnHand(variantId: string): Promise<number>;
}
