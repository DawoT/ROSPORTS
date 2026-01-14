'use client';

import Link from 'next/link';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/context/cart-context';

export function MiniCart(): React.JSX.Element {
    const { isOpen, closeCart, items, removeItem, cartCount } = useCart();

    // Format price
    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
        }).format(price);
    };

    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    if (!isOpen) return <></>;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={closeCart}
            />

            {/* Sidebar */}
            <div
                data-testid="mini-cart"
                className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            Carrito ({cartCount})
                        </h2>
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Cerrar carrito"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                            <p className="text-gray-500 mb-2">Tu carrito está vacío</p>
                            <button
                                onClick={closeCart}
                                className="text-blue-600 hover:underline text-sm"
                            >
                                Continuar comprando
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.variantId}
                                    className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                                >
                                    {/* Image placeholder */}
                                    <div className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0" />

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                                            {item.productName}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            SKU: {item.sku}
                                        </p>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600">
                                                    Cant: {item.quantity}
                                                </span>
                                            </div>
                                            <p className="font-semibold text-blue-600">
                                                {formatPrice(item.unitPrice * item.quantity)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Remove button */}
                                    <button
                                        onClick={() => removeItem(item.variantId)}
                                        className="self-start p-1 text-gray-400 hover:text-red-500 transition-colors"
                                        aria-label="Eliminar"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="text-xl font-bold text-gray-900">
                                {formatPrice(subtotal)}
                            </span>
                        </div>
                        <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold text-center hover:bg-blue-700 transition-colors"
                        >
                            Ir al Checkout
                        </Link>
                        <button
                            onClick={closeCart}
                            className="block w-full text-gray-600 py-2 text-sm hover:text-gray-900 transition-colors"
                        >
                            Continuar comprando
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
