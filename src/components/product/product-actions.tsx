'use client';

import { useTransition } from 'react';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { addToCartAction } from '@/interface-adapters/actions/cart.actions';
import { Product } from '@/core/domain/types';

interface ProductActionsProps {
    product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
    const [isPending, startTransition] = useTransition();
    const { addItem, openCart } = useCart();

    // Default to first variant
    const firstVariant = product.variants?.[0];
    const sku = firstVariant?.sku || 'N/A';
    const variantId = firstVariant?.id || '';

    const handleAddToCart = () => {
        if (!variantId) {
            alert('Producto no disponible');
            return;
        }

        console.warn('🛒 Adding to cart:', { sku, variantId, productName: product.name });

        startTransition(async () => {
            const formData = new FormData();
            formData.append('variantId', sku); // Backend expects SKU
            formData.append('productId', product.id);
            formData.append('quantity', '1');

            const result = await addToCartAction(null, formData);
            console.warn('✅ Server Action result:', result);

            if (result.success) {
                addItem({
                    variantId,
                    productId: product.id,
                    productName: product.name,
                    sku,
                    quantity: 1,
                    unitPrice: product.basePrice,
                });
                console.warn('✨ addItem called in context');
                openCart();
            } else {
                alert(result.message || 'Error al añadir al carrito');
            }
        });
    };

    return (
        <div className="mt-8 flex gap-4">
            <button
                onClick={handleAddToCart}
                disabled={isPending || !variantId}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg py-4 px-6 font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                {isPending ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Añadiendo...
                    </>
                ) : (
                    <>
                        <ShoppingBag className="h-5 w-5" />
                        Añadir al Carrito
                    </>
                )}
            </button>
        </div>
    );
}
