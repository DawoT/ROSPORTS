import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MiniCart } from '@/components/ui/mini-cart';
import { CartItem } from '@/context/cart-context';

// Mock the cart context
const mockUseCart: Mock = vi.fn();
vi.mock('@/context/cart-context', (): { useCart: () => ReturnType<typeof mockUseCart> } => ({
    useCart: (): ReturnType<typeof mockUseCart> => mockUseCart(),
}));

describe('MiniCart', (): void => {
    const defaultCartState = {
        isOpen: true,
        closeCart: vi.fn(),
        items: [],
        removeItem: vi.fn(),
        cartCount: 0,
        addItem: vi.fn(),
        openCart: vi.fn(),
        toggleCart: vi.fn(),
        clearCart: vi.fn(),
        setCartCount: vi.fn(),
    };

    beforeEach((): void => {
        vi.clearAllMocks();
        mockUseCart.mockReturnValue(defaultCartState);
    });

    describe('Visibility', (): void => {
        it('should not render when isOpen is false', (): void => {
            mockUseCart.mockReturnValue({ ...defaultCartState, isOpen: false });
            const { container } = render(<MiniCart />);
            expect(container).toBeEmptyDOMElement();
        });

        it('should render when isOpen is true', (): void => {
            render(<MiniCart />);
            expect(screen.getByText('Carrito (0)')).toBeInTheDocument();
        });
    });

    describe('Empty State', (): void => {
        it('should show empty message when no items', (): void => {
            render(<MiniCart />);
            expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
            expect(screen.getByText('Continuar comprando')).toBeInTheDocument();
        });
    });

    describe('With Items', (): void => {
        const mockItems: CartItem[] = [
            {
                variantId: 'v1',
                productId: 'p1',
                productName: 'Nike Air Max',
                sku: 'NIKE-42',
                quantity: 1,
                unitPrice: 400,
            },
            {
                variantId: 'v2',
                productId: 'p2',
                productName: 'Adidas Ultra',
                sku: 'ADI-43',
                quantity: 2,
                unitPrice: 300,
            },
        ];

        beforeEach((): void => {
            mockUseCart.mockReturnValue({
                ...defaultCartState,
                items: mockItems,
                cartCount: 3,
            });
        });

        it('should render list of items', (): void => {
            render(<MiniCart />);
            expect(screen.getByText('Nike Air Max')).toBeInTheDocument();
            expect(screen.getByText('Adidas Ultra')).toBeInTheDocument();
        });

        it('should display correct SKUs', (): void => {
            render(<MiniCart />);
            expect(screen.getByText('SKU: NIKE-42')).toBeInTheDocument();
            expect(screen.getByText('SKU: ADI-43')).toBeInTheDocument();
        });

        it('should calculate and display subtotal correctly', (): void => {
            // 1 * 400 + 2 * 300 = 1000
            render(<MiniCart />);
            const subtotalElement = screen.getByText(/1.{0,1}000/);
            expect(subtotalElement).toBeInTheDocument();
        });

        it('should show checkout button', (): void => {
            render(<MiniCart />);
            expect(screen.getByText('Ir al Checkout')).toBeInTheDocument();
        });
    });

    describe('Interactions', (): void => {
        it('should call closeCart when clicking backdrop', (): void => {
            render(<MiniCart />);
            const backdrop = document.querySelector('.bg-black\\/50');
            if (backdrop) {
                fireEvent.click(backdrop);
                expect(defaultCartState.closeCart).toHaveBeenCalled();
            }
        });

        it('should call closeCart when clicking close button (X)', (): void => {
            render(<MiniCart />);
            const closeButton = screen.getByLabelText('Cerrar carrito');
            fireEvent.click(closeButton);
            expect(defaultCartState.closeCart).toHaveBeenCalled();
        });

        it('should call removeItem when clicking trash icon', (): void => {
            const mockItems: CartItem[] = [
                {
                    variantId: 'v1',
                    productId: 'p1',
                    productName: 'Nike Air Max',
                    sku: 'NIKE-42',
                    quantity: 1,
                    unitPrice: 400,
                },
            ];
            mockUseCart.mockReturnValue({
                ...defaultCartState,
                items: mockItems,
                cartCount: 1,
            });

            render(<MiniCart />);
            const removeButton = screen.getByLabelText('Eliminar');
            fireEvent.click(removeButton);
            expect(defaultCartState.removeItem).toHaveBeenCalledWith('v1');
        });
    });
});
