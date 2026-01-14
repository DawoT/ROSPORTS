'use client';

import { useTransition } from 'react';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { Product } from '@/core/domain/types';
import { addToCartAction } from '@/interface-adapters/actions/cart.actions';
import { useCart } from '@/context/cart-context';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps): React.JSX.Element {
    const [isPending, startTransition] = useTransition();
    const { addItem, openCart } = useCart();

    // Get the first variant's SKU or default
    const firstVariant = product.variants?.[0];
    const sku = firstVariant?.sku || 'N/A';
    const variantId = firstVariant?.id || '';

    // Format price
    const formattedPrice = new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
    }).format(product.basePrice);

    const handleAddToCart = (): void => {
        if (!variantId) {
            alert('No variant available for this product');
            return;
        }

        startTransition(async () => {
            const formData = new FormData();
            // Pass SKU for inventory lookup (the repository expects SKU)
            formData.append('variantId', sku);
            formData.append('productId', product.id);
            formData.append('quantity', '1');

            const result = await addToCartAction(null, formData);

            if (result.success) {
                // Add to local cart state
                addItem({
                    variantId,
                    productId: product.id,
                    productName: product.name,
                    sku,
                    quantity: 1,
                    unitPrice: product.basePrice,
                });
                // Open cart sidebar
                openCart();
            } else {
                alert(result.message || 'Error adding to cart');
            }
        });
    };

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                    src="https://placehold.co/400x400/e2e8f0/64748b?text=Product"
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
                {/* Status Badge */}
                {product.status === 'ACTIVE' && (
                    <span className="absolute top-3 left-3 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                        Disponible
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-5">
                {/* SKU */}
                <p className="text-xs text-gray-400 mb-2 font-mono">SKU: {sku}</p>

                {/* Name */}
                <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-3 min-h-[2.5rem]">
                    {product.name}
                </h3>

                {/* Price */}
                <p className="text-xl font-bold text-blue-600 mb-4">
                    {formattedPrice}
                </p>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={isPending || !variantId}
                    className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Añadiendo...
                        </>
                    ) : (
                        <>
                            <ShoppingBag className="h-4 w-4" />
                            Añadir al Carrito
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
