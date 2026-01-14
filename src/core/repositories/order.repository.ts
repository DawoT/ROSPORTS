import { Order } from '@/core/domain/types';

/**
 * Order Item Input for creation
 */
export interface OrderItemInput {
    variantId: string;
    quantity: number;
}

/**
 * Customer Input for order creation
 */
export interface CustomerInput {
    email: string;
    firstName: string;
    lastName?: string;
    phone?: string;
    address?: string;
    city?: string;
}

/**
 * Interface for Order Data Access (Port).
 */
export interface IOrderRepository {
    /**
     * Create a new order with items in a single transaction.
     * @param customer Customer data
     * @param items Order items
     * @param shippingAddress Shipping address
     * @returns The created order ID
     */
    createOrder(
        customer: CustomerInput,
        items: OrderItemInput[],
        shippingAddress: string
    ): Promise<string>;

    /**
     * Find an order by its ID.
     */
    findById(orderId: string): Promise<Order | null>;

    /**
     * Find an order by order number.
     */
    findByOrderNumber(orderNumber: string): Promise<Order | null>;

    /**
     * Update order status.
     */
    updateStatus(orderId: string, status: string): Promise<void>;
}
