import { CartProvider, useCart, CartItem } from '@/context/cart-context';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

// Wrapper component for testing
const wrapper = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
    <CartProvider>{children}</CartProvider>
);

describe('CartContext', (): void => {
    beforeEach(() => {
        window.localStorage.clear();
        vi.clearAllMocks();
    });

    describe('Initial State', (): void => {
        it('should provide initial state with empty cart', (): void => {
            const { result } = renderHook(() => useCart(), { wrapper });

            expect(result.current.items).toEqual([]);
            expect(result.current.cartCount).toBe(0);
            expect(result.current.isOpen).toBe(false);
        });
    });

    describe('Cart Open/Close', (): void => {
        it('should open cart with openCart()', (): void => {
            const { result } = renderHook(() => useCart(), { wrapper });

            act((): void => {
                result.current.openCart();
            });

            expect(result.current.isOpen).toBe(true);
        });

        it('should close cart with closeCart()', (): void => {
            const { result } = renderHook(() => useCart(), { wrapper });

            act((): void => {
                result.current.openCart();
                result.current.closeCart();
            });

            expect(result.current.isOpen).toBe(false);
        });

        it('should toggle cart with toggleCart()', (): void => {
            const { result } = renderHook(() => useCart(), { wrapper });

            act((): void => {
                result.current.toggleCart();
            });
            expect(result.current.isOpen).toBe(true);

            act((): void => {
                result.current.toggleCart();
            });
            expect(result.current.isOpen).toBe(false);
        });
    });

    describe('Adding Items', (): void => {
        const testItem: CartItem = {
            variantId: 'NIKE-42',
            productId: 'prod-1',
            productName: 'Nike Air Max',
            sku: 'NIKE-42',
            quantity: 1,
            unitPrice: 459.9,
        };

        it('should add item to cart', (): void => {
            const { result } = renderHook(() => useCart(), { wrapper });

            act((): void => {
                result.current.addItem(testItem);
            });

            expect(result.current.items).toHaveLength(1);
            expect(result.current.items[0].productName).toBe('Nike Air Max');
        });

        it('should increment cartCount when adding item', (): void => {
            const { result } = renderHook(() => useCart(), { wrapper });

            act((): void => {
                result.current.addItem(testItem);
            });

            expect(result.current.cartCount).toBe(1);
        });

        it('should increment quantity for existing item', (): void => {
            const { result } = renderHook(() => useCart(), { wrapper });

            act((): void => {
                result.current.addItem(testItem);
                result.current.addItem(testItem);
            });

            expect(result.current.items).toHaveLength(1);
            expect(result.current.items[0].quantity).toBe(2);
            expect(result.current.cartCount).toBe(2);
        });

        it('should add different items separately', (): void => {
            const { result } = renderHook(() => useCart(), { wrapper });

            const secondItem: CartItem = {
                ...testItem,
                variantId: 'ADIDAS-42',
                sku: 'ADIDAS-42',
                productName: 'Adidas Ultraboost',
            };

            act((): void => {
                result.current.addItem(testItem);
                result.current.addItem(secondItem);
            });

            expect(result.current.items).toHaveLength(2);
            expect(result.current.cartCount).toBe(2);
        });
    });

    describe('Removing Items', (): void => {
        const testItem: CartItem = {
            variantId: 'NIKE-42',
            productId: 'prod-1',
            productName: 'Nike Air Max',
            sku: 'NIKE-42',
            quantity: 2,
            unitPrice: 459.9,
        };

        it('should remove item from cart', (): void => {
            const { result } = renderHook(() => useCart(), { wrapper });

            act((): void => {
                result.current.addItem(testItem);
                result.current.removeItem('NIKE-42');
            });

            expect(result.current.items).toHaveLength(0);
            expect(result.current.cartCount).toBe(0);
        });

        it('should not affect other items when removing', (): void => {
            const { result } = renderHook(() => useCart(), { wrapper });

            const secondItem: CartItem = {
                ...testItem,
                variantId: 'ADIDAS-42',
                sku: 'ADIDAS-42',
            };

            act((): void => {
                result.current.addItem(testItem);
                result.current.addItem(secondItem);
                result.current.removeItem('NIKE-42');
            });

            expect(result.current.items).toHaveLength(1);
            expect(result.current.items[0].variantId).toBe('ADIDAS-42');
        });
    });

    describe('Clear Cart', (): void => {
        it('should clear all items', (): void => {
            const { result } = renderHook(() => useCart(), { wrapper });

            act((): void => {
                result.current.addItem({
                    variantId: 'A',
                    productId: '1',
                    productName: 'A',
                    sku: 'A',
                    quantity: 1,
                    unitPrice: 100,
                });
                result.current.addItem({
                    variantId: 'B',
                    productId: '2',
                    productName: 'B',
                    sku: 'B',
                    quantity: 2,
                    unitPrice: 200,
                });
                result.current.clearCart();
            });

            expect(result.current.items).toEqual([]);
            expect(result.current.cartCount).toBe(0);
        });
    });

    describe('Error Handling', (): void => {
        it('should throw error when used outside provider', (): void => {
            expect((): void => {
                renderHook(() => useCart());
            }).toThrow('useCart must be used within a CartProvider');
        });
    });
});
