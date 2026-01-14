
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CartContextType {
    isOpen: boolean;
    cartCount: number;
    toggleCart: () => void;
    incrementCart: () => void;
    setCartCount: (count: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps): React.JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    const toggleCart = (): void => {
        setIsOpen((prev) => !prev);
    };

    const incrementCart = (): void => {
        setCartCount((prev) => prev + 1);
    };

    return (
        <CartContext.Provider
            value={{
                isOpen,
                cartCount,
                toggleCart,
                incrementCart,
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
