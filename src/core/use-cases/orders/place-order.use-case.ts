import { IOrderRepository, CustomerInput, OrderItemInput } from '@/core/repositories/order.repository';
import { IInventoryRepository } from '@/core/repositories/inventory.repository';
import { StockInsufficientError } from '@/lib/errors';

export interface PlaceOrderInput {
    customer: CustomerInput;
    items: OrderItemInput[];
    shippingAddress: string;
    sessionId: string;
}

export interface PlaceOrderResult {
    orderId: string;
    orderNumber: string;
}

export class PlaceOrderUseCase {
    constructor(
        private readonly orderRepo: IOrderRepository,
        private readonly inventoryRepo: IInventoryRepository
    ) { }

    /**
     * Execute the order placement logic.
     * 1. Validate stock availability for all items
     * 2. Create order with customer
     * 3. Commit inventory reservations
     */
    async execute(input: PlaceOrderInput): Promise<PlaceOrderResult> {
        const { customer, items, shippingAddress, sessionId } = input;

        // 1. Validate stock for all items (final check before order)
        for (const item of items) {
            const available = await this.inventoryRepo.getQuantityOnHand(item.variantId);

            if (available < item.quantity) {
                throw new StockInsufficientError(
                    item.variantId,
                    item.quantity,
                    available
                );
            }
        }

        // 2. Create the order (this will also create customer if needed)
        const orderId = await this.orderRepo.createOrder(
            customer,
            items,
            shippingAddress
        );

        // 3. Commit reservations (convert reserved to sold)
        for (const item of items) {
            await this.inventoryRepo.commitReservation(
                item.variantId,
                item.quantity,
                sessionId
            );
        }

        // Generate order number (simple format for now)
        const orderNumber = `ORD-${orderId.padStart(6, '0')}`;

        return {
            orderId,
            orderNumber,
        };
    }
}
