'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { useCart } from '@/context/cart-context';

export default function CheckoutPage(): React.JSX.Element {
    // Get real cart items from context
    const { items } = useCart();

    // Map cart items to checkout format
    const cartItems = items.map((item) => ({
        variantId: item.sku, // Use SKU for inventory lookup (not numeric ID)
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
    }));

    if (cartItems.length === 0) {
        return (
            <main className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 text-center">
                    <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h1>
                    <p className="text-gray-600 mb-6">
                        Agrega productos antes de proceder al checkout.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Ir a la Tienda
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="text-blue-600 hover:underline text-sm mb-2 inline-block"
                    >
                        ← Volver a la tienda
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                    <p className="text-gray-600 mt-1">
                        Completa tu información para finalizar la compra
                    </p>
                </div>

                {/* Checkout Form */}
                <CheckoutForm cartItems={cartItems} />
            </div>
        </main>
    );
}
