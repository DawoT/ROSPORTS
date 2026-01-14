'use client';

import { useActionState, useEffect } from 'react';
import { useCart } from '@/context/cart-context';
import { placeOrderAction, CheckoutActionState } from '@/interface-adapters/actions/checkout.actions';
import { Loader2 } from 'lucide-react';

interface CartItemForCheckout {
    variantId: string; // This is actually the SKU for consistency
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
}

interface CheckoutFormProps {
    cartItems: CartItemForCheckout[];
}

export function CheckoutForm({ cartItems }: CheckoutFormProps): React.JSX.Element {
    const { clearCart } = useCart();
    const [state, formAction, isPending] = useActionState<CheckoutActionState | null, FormData>(
        placeOrderAction,
        null
    );

    // Calculate totals on client for display
    const subtotal = cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const formattedSubtotal = new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
    }).format(subtotal);

    useEffect(() => {
        if (state?.success) {
            clearCart();
        }
    }, [state, clearCart]);

    return (
        <form action={formAction} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Customer Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Información de Envío</h2>

                {state?.message && !state.success && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {state.message}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {state?.errors?.firstName && (
                                <p className="mt-1 text-sm text-red-500">{state.errors.firstName[0]}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                Apellido
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {state?.errors?.email && (
                            <p className="mt-1 text-sm text-red-500">{state.errors.email[0]}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Teléfono
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Dirección *
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {state?.errors?.address && (
                            <p className="mt-1 text-sm text-red-500">{state.errors.address[0]}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            Ciudad *
                        </label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {state?.errors?.city && (
                            <p className="mt-1 text-sm text-red-500">{state.errors.city[0]}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                            Notas (opcional)
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Resumen del Pedido</h2>

                <div className="space-y-4 mb-6">
                    {cartItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                            <div>
                                <p className="font-medium text-gray-900">{item.productName}</p>
                                <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                            </div>
                            <p className="font-medium text-gray-900">
                                {new Intl.NumberFormat('es-PE', {
                                    style: 'currency',
                                    currency: 'PEN',
                                }).format(item.unitPrice * item.quantity)}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>{formattedSubtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Envío</span>
                        <span>Gratis</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                        <span>Total</span>
                        <span>{formattedSubtotal}</span>
                    </div>
                </div>

                {/* Hidden field with cart items */}
                <input
                    type="hidden"
                    name="cartItems"
                    value={JSON.stringify(cartItems.map(item => ({
                        variantId: item.variantId,
                        productId: item.productId,
                        quantity: item.quantity,
                    })))}
                />

                <button
                    type="submit"
                    disabled={isPending || cartItems.length === 0}
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Procesando...
                        </>
                    ) : (
                        'Confirmar Compra'
                    )}
                </button>
            </div>
        </form>
    );
}
