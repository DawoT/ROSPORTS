import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import * as checkoutActions from '@/interface-adapters/actions/checkout.actions';

// Mock cart context & server action
const { mockClearCart, mockPlaceOrderAction, mockPush } = vi.hoisted(
    (): {
        mockClearCart: Mock;
        mockPlaceOrderAction: Mock;
        mockPush: Mock;
    } => ({
        mockClearCart: vi.fn(),
        mockPlaceOrderAction: vi.fn(),
        mockPush: vi.fn(),
    })
);

vi.mock('@/context/cart-context', () => ({
    useCart: (): { clearCart: Mock } => ({
        clearCart: mockClearCart,
    }),
}));

vi.mock('@/interface-adapters/actions/checkout.actions', (): unknown => ({
    placeOrderAction: mockPlaceOrderAction,
}));

// Mock useRouter
vi.mock('next/navigation', (): unknown => ({
    useRouter: (): { push: Mock } => ({
        push: mockPush,
    }),
}));

describe('CheckoutForm', (): void => {
    const mockCartItems = [
        {
            variantId: 'v1',
            productId: 'p1',
            productName: 'Nike Test',
            sku: 'NIKE-TEST',
            quantity: 1,
            unitPrice: 100,
        },
    ];

    beforeEach((): void => {
        vi.clearAllMocks();
        // Default action implementation (doesn't do much by default unless we mock return)
        // In React 19 useActionState, the action is called when form submits.
        // We can't easily control the hook's internal state unless we mock the hook itself or trigger the action.
    });

    describe('Rendering', (): void => {
        it('should render all input fields', (): void => {
            render(<CheckoutForm cartItems={mockCartItems} />);

            expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument(); // Nombre *
            expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/dirección/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/ciudad/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/notas/i)).toBeInTheDocument();
        });

        it('should render order summary correct elements', (): void => {
            render(<CheckoutForm cartItems={mockCartItems} />);
            expect(screen.getByText('Nike Test')).toBeInTheDocument();
            // Price calculation: 1 * 100 = 100
            const prices = screen.getAllByText(/100/);
            expect(prices.length).toBeGreaterThan(0);
        });

        it('should disable submit button if cart is empty', (): void => {
            render(<CheckoutForm cartItems={[]} />);
            const button = screen.getByRole('button', { name: /confirmar compra/i });
            expect(button).toBeDisabled();
        });
    });

    describe('Validation Display', (): void => {
        it('should call placeOrderAction on form submission', async (): Promise<void> => {
            render(<CheckoutForm cartItems={mockCartItems} />);

            const firstName = screen.getByLabelText(/nombre/i);
            const email = screen.getByLabelText(/email/i);
            const address = screen.getByLabelText(/dirección/i);
            const city = screen.getByLabelText(/ciudad/i);

            fireEvent.change(firstName, { target: { value: 'Juan' } });
            const lastName = screen.getByLabelText(/apellido/i);
            fireEvent.change(lastName, { target: { value: 'Perez' } });
            fireEvent.change(email, { target: { value: 'juan@test.com' } });
            const phone = screen.getByLabelText(/teléfono/i);
            fireEvent.change(phone, { target: { value: '123456789' } });
            fireEvent.change(address, { target: { value: 'Calle 123' } });
            fireEvent.change(city, { target: { value: 'Lima' } });

            const submitBtn = screen.getByRole('button', { name: /confirmar compra/i });

            // Configure mock BEFORE triggering form submission
            mockPlaceOrderAction.mockResolvedValue({
                success: true,
                orderId: 'test-order-id',
            });

            fireEvent.click(submitBtn);

            await waitFor(
                (): void => {
                    expect(checkoutActions.placeOrderAction).toHaveBeenCalled();
                },
                { timeout: 3000 }
            );

            // Wait for effect to trigger
            await waitFor(
                () => {
                    expect(mockClearCart).toHaveBeenCalled();
                    expect(mockPush).toHaveBeenCalledWith('/checkout/success/test-order-id');
                },
                { timeout: 3000 }
            );
        });
    });
});
