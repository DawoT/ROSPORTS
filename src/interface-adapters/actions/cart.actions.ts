'use server';

import { cookies } from 'next/headers';
import { addToCartSchema, AddToCartDTO } from '@/interface-adapters/dtos/cart.dto';
import { ReserveStockUseCase } from '@/core/use-cases/inventory/reserve-stock.use-case';
import { getInventoryRepository } from '@/lib/di';
import { StockInsufficientError } from '@/lib/errors';

/**
 * Standardized Action State for form submissions.
 */
export interface ActionState {
    success: boolean;
    message?: string;
    errors?: Record<string, string[]>;
}

/**
 * Server Action: Add item to cart (reserve stock).
 */
export async function addToCartAction(
    prevState: ActionState | null,
    formData: FormData
): Promise<ActionState> {
    // 1. Parse and Validate Input
    const rawData = {
        variantId: formData.get('variantId'),
        productId: formData.get('productId'),
        quantity: Number(formData.get('quantity')),
    };

    const validationResult = addToCartSchema.safeParse(rawData);

    if (!validationResult.success) {
        return {
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten().fieldErrors as Record<string, string[]>,
        };
    }

    const dto: AddToCartDTO = validationResult.data;

    // 2. Get or Create Session ID
    const cookieStore = await cookies();
    let sessionId = cookieStore.get('cart_session')?.value;

    if (!sessionId) {
        sessionId = crypto.randomUUID();
        cookieStore.set('cart_session', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });
    }

    // 3. Execute Use Case
    try {
        const repo = getInventoryRepository();
        const useCase = new ReserveStockUseCase(repo);

        const result = await useCase.execute(dto, sessionId);

        if (result) {
            return {
                success: true,
                message: 'Item added to cart successfully',
            };
        } else {
            return {
                success: false,
                message: 'Failed to reserve stock. Please try again.',
            };
        }
    } catch (error) {
        if (error instanceof StockInsufficientError) {
            return {
                success: false,
                message: `Insufficient stock: Only ${error.available} units available.`,
                errors: {
                    quantity: [`Only ${error.available} units available`],
                },
            };
        }

        // Log unexpected errors (in production, use a proper logger)
        console.error('AddToCart Error:', error);

        return {
            success: false,
            message: 'An unexpected error occurred. Please try again.',
        };
    }
}
