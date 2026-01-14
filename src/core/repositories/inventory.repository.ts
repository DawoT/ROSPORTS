/**
 * Interface for Inventory Operations (Port).
 */
export interface IInventoryRepository {
  /**
   * Attempt to reserve stock for a session (e.g. checkout).
   * @param sku Product SKU
   * @param quantity Amount to reserve
   * @param sessionId User session ID or Cart ID
   * @returns boolean indicating success or failure
   */
  reserveStock(
    sku: string,
    quantity: number,
    sessionId: string,
  ): Promise<boolean>;

  /**
   * Commit a reservation (convert to permanent deduction on order confirm).
   * @param reservationId ID of the reservation or SKU+Session combo
   */
  commitReservation(
    sku: string,
    quantity: number,
    sessionId: string,
  ): Promise<void>;

  /**
   * Release reserved stock (e.g. cart timeout or removal).
   */
  releaseReservation(
    sku: string,
    quantity: number,
    sessionId: string,
  ): Promise<void>;

  /**
   * Get the precise quantity currently available on hand.
   */
  getQuantityOnHand(sku: string): Promise<number>;
}
