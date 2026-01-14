import { db } from '../database/connection';
import { customers, orders, orderItems, productVariants, products, inventoryStock } from '../database/schema';
import { eq, sql } from 'drizzle-orm';
import { IOrderRepository, CustomerInput, OrderItemInput } from '@/core/repositories/order.repository';
import { Order, CartItem } from '@/core/domain/types';

export class DrizzleOrderRepository implements IOrderRepository {

    async createOrder(
        customer: CustomerInput,
        items: OrderItemInput[],
        shippingAddress: string
    ): Promise<string> {
        return await db.transaction(async (tx) => {
            // 1. Find or create customer
            let customerId: number;

            const existingCustomer = await tx.select()
                .from(customers)
                .where(eq(customers.email, customer.email))
                .limit(1);

            if (existingCustomer.length > 0) {
                customerId = existingCustomer[0].id;
            } else {
                const [newCustomer] = await tx.insert(customers).values({
                    email: customer.email,
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    phone: customer.phone,
                    address: customer.address,
                    city: customer.city,
                }).returning();
                customerId = newCustomer.id;
            }

            // 2. Fetch variant prices and calculate totals
            // IMPORTANT: variantId here is actually the SKU (for inventory lookup consistency)
            let subtotal = 0;
            const orderItemsData: Array<{
                variantId: number;
                productName: string;
                sku: string;
                quantity: number;
                unitPrice: string;
                totalPrice: string;
            }> = [];

            for (const item of items) {
                // Look up variant by SKU (not by numeric ID)
                const [variant] = await tx.select({
                    id: productVariants.id,
                    sku: productVariants.sku,
                    priceOverride: productVariants.priceOverride,
                    productId: productVariants.productId,
                })
                    .from(productVariants)
                    .where(eq(productVariants.sku, item.variantId));

                if (!variant) {
                    throw new Error(`Variant with SKU ${item.variantId} not found`);
                }

                // Get product for name and base price
                const [product] = await tx.select({
                    name: products.name,
                    basePrice: products.basePrice,
                })
                    .from(products)
                    .where(eq(products.id, variant.productId!));

                const unitPrice = variant.priceOverride
                    ? parseFloat(variant.priceOverride)
                    : parseFloat(product.basePrice);

                const totalPrice = unitPrice * item.quantity;
                subtotal += totalPrice;

                orderItemsData.push({
                    variantId: variant.id,
                    productName: product.name,
                    sku: variant.sku,
                    quantity: item.quantity,
                    unitPrice: unitPrice.toFixed(2),
                    totalPrice: totalPrice.toFixed(2),
                });
            }

            // 3. Create order
            const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

            const [order] = await tx.insert(orders).values({
                orderNumber,
                customerId,
                status: 'PENDING',
                paymentStatus: 'UNPAID',
                subtotal: subtotal.toFixed(2),
                taxTotal: '0',
                shippingCost: '0',
                totalAmount: subtotal.toFixed(2),
                shippingAddress,
            }).returning();

            // 4. Create order items
            for (const itemData of orderItemsData) {
                await tx.insert(orderItems).values({
                    orderId: order.id,
                    ...itemData,
                });
            }

            // 5. Deduct stock (commit the sale) - using variant ID from lookup
            for (const itemData of orderItemsData) {
                await tx.execute(sql`
          UPDATE inventory_stock 
          SET quantity_on_hand = quantity_on_hand - ${itemData.quantity},
              quantity_reserved = GREATEST(quantity_reserved - ${itemData.quantity}, 0),
              version = version + 1,
              last_updated_at = NOW()
          WHERE variant_id = ${itemData.variantId}
        `);
            }

            return String(order.id);
        });
    }

    async findById(orderId: string): Promise<Order | null> {
        const result = await db.select()
            .from(orders)
            .where(eq(orders.id, parseInt(orderId)))
            .limit(1);

        if (result.length === 0) return null;

        const order = result[0];

        // Get order items
        const items = await db.select()
            .from(orderItems)
            .where(eq(orderItems.orderId, order.id));

        const cartItems: CartItem[] = items.map(item => ({
            productId: String(item.variantId),
            variantId: String(item.variantId),
            productName: item.productName,
            variantSku: item.sku,
            quantity: item.quantity,
            unitPrice: parseFloat(item.unitPrice),
        }));

        return {
            id: String(order.id),
            orderNumber: order.orderNumber,
            customerId: String(order.customerId),
            channel: 'WEB',
            status: order.status as Order['status'],
            paymentStatus: order.paymentStatus as Order['paymentStatus'],
            subtotal: parseFloat(order.subtotal),
            discountTotal: 0,
            taxTotal: parseFloat(order.taxTotal),
            shippingCost: parseFloat(order.shippingCost),
            grandTotal: parseFloat(order.totalAmount),
            items: cartItems,
            createdAt: order.createdAt ?? new Date(),
        };
    }

    async findByOrderNumber(orderNumber: string): Promise<Order | null> {
        const result = await db.select()
            .from(orders)
            .where(eq(orders.orderNumber, orderNumber))
            .limit(1);

        if (result.length === 0) return null;

        return this.findById(String(result[0].id));
    }

    async updateStatus(orderId: string, status: string): Promise<void> {
        await db.update(orders)
            .set({ status, updatedAt: new Date() })
            .where(eq(orders.id, parseInt(orderId)));
    }
}
