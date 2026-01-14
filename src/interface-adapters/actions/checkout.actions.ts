'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { checkoutSchema, CheckoutCartItem } from '@/interface-adapters/dtos/checkout.dto';
import { PlaceOrderUseCase } from '@/core/use-cases/orders/place-order.use-case';
import { getOrderRepository, getInventoryRepository } from '@/lib/di';
import { StockInsufficientError } from '@/lib/errors';

/**
 * Standardized Action State for checkout.
 */
export interface CheckoutActionState {
    success: boolean;
    orderId?: string;
    message?: string;
    errors?: Record<string, string[]>;
}

/**
 * Server Action: Place Order (Checkout).
 */
export async function placeOrderAction(
    prevState: CheckoutActionState | null,
    formData: FormData
): Promise<CheckoutActionState> {
    // 1. Parse and Validate Customer Data
    const rawData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        notes: formData.get('notes'),
    };

    const validationResult = checkoutSchema.safeParse(rawData);

    if (!validationResult.success) {
        return {
            success: false,
            message: 'Por favor, corrige los errores en el formulario.',
            errors: validationResult.error.flatten().fieldErrors as Record<string, string[]>,
        };
    }

    const customerData = validationResult.data;

    // 2. Parse Cart Items from hidden field
    const cartItemsJson = formData.get('cartItems');
    let cartItems: CheckoutCartItem[] = [];

    try {
        if (typeof cartItemsJson === 'string') {
            cartItems = JSON.parse(cartItemsJson);
        }
    } catch {
        return {
            success: false,
            message: 'Error al procesar los items del carrito.',
        };
    }

    if (cartItems.length === 0) {
        return {
            success: false,
            message: 'El carrito está vacío.',
        };
    }

    // 3. Get Session ID
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('cart_session')?.value || crypto.randomUUID();

    // 4. Execute Use Case
    try {
        const orderRepo = getOrderRepository();
        const inventoryRepo = getInventoryRepository();
        const useCase = new PlaceOrderUseCase(orderRepo, inventoryRepo);

        const result = await useCase.execute({
            customer: {
                email: customerData.email,
                firstName: customerData.firstName,
                lastName: customerData.lastName,
                phone: customerData.phone,
                address: customerData.address,
                city: customerData.city,
            },
            items: cartItems.map(item => ({
                variantId: item.variantId,
                quantity: item.quantity,
            })),
            shippingAddress: `${customerData.address}, ${customerData.city}`,
            sessionId,
        });

        // Clear cart session after successful order
        cookieStore.delete('cart_session');

        // Redirect to success page
        redirect(`/checkout/success/${result.orderId}`);

    } catch (error) {
        if (error instanceof StockInsufficientError) {
            return {
                success: false,
                message: `Stock insuficiente: Solo hay ${error.available} unidades disponibles.`,
            };
        }

        console.error('Checkout Error:', error);

        return {
            success: false,
            message: 'Ocurrió un error al procesar tu orden. Por favor, intenta de nuevo.',
        };
    }
}
