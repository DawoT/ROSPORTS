'use client';

import Link from 'next/link';
import { ShoppingCart, Menu } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { AuthNavItems } from './auth-nav-items';

interface NavbarProps {
    session?: {
        user: {
            name?: string | null;
            email: string;
            role: string;
        };
    } | null;
}

export function Navbar({ session = null }: NavbarProps): React.JSX.Element {
    const { cartCount, toggleCart } = useCart();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-bold tracking-tight text-gray-900">
                        ROSPORTS
                    </span>
                </Link>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center space-x-6">
                    <Link
                        href="/"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Home
                    </Link>
                    <Link
                        href="/tienda"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Tienda
                    </Link>
                    <Link
                        href="/nosotros"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Nosotros
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                    {/* Auth Items */}
                    <AuthNavItems session={session} />

                    {/* Cart Button */}
                    <button
                        onClick={toggleCart}
                        data-testid="cart-trigger"
                        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                        aria-label="Open cart"
                    >
                        <ShoppingCart className="h-6 w-6" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                {cartCount > 99 ? '99+' : cartCount}
                            </span>
                        )}
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </header>
    );
}
