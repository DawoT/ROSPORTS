'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface CartItem {
    variantId: string;
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
}

interface CartContextType {
    isOpen: boolean;
    cartCount: number;
    items: CartItem[];
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    addItem: (item: CartItem) => void;
    removeItem: (variantId: string) => void;
    clearCart: () => void;
    setCartCount: (count: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps): React.JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const [items, setItems] = useState<CartItem[]>([]);

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const toggleCart = useCallback((): void => {
        setIsOpen((prev) => !prev);
    }, []);

    const openCart = useCallback((): void => {
        setIsOpen(true);
    }, []);

    const closeCart = useCallback((): void => {
        setIsOpen(false);
    }, []);

    const addItem = useCallback((newItem: CartItem): void => {
        setItems((prev) => {
            const existing = prev.find((item) => item.variantId === newItem.variantId);
            if (existing) {
                return prev.map((item) =>
                    item.variantId === newItem.variantId
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
            }
            return [...prev, newItem];
        });
    }, []);

    const removeItem = useCallback((variantId: string): void => {
        setItems((prev) => prev.filter((item) => item.variantId !== variantId));
    }, []);

    const clearCart = useCallback((): void => {
        setItems([]);
    }, []);

    const setCartCount = useCallback((): void => {
        // Legacy compatibility - not used anymore
    }, []);

    return (
        <CartContext.Provider
            value={{
                isOpen,
                cartCount,
                items,
                toggleCart,
                openCart,
                closeCart,
                addItem,
                removeItem,
                clearCart,
                setCartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart(): CartContextType {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
