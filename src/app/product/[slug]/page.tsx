import { getProductBySlugAction } from '@/interface-adapters/actions/product.actions';
import { notFound } from 'next/navigation';
import { ProductActions } from '@/components/product/product-actions';
import Link from 'next/link';

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;

    // Fetch product
    const result = await getProductBySlugAction(slug);

    if (!result.success || !result.data) {
        notFound();
    }

    const product = result.data;

    const formattedPrice = new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
    }).format(product.basePrice);

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                {/* Breadcrumb / Back */}
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-8"
                >
                    ← Volver a Productos
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Image Column */}
                        <div className="p-8 bg-gray-50 flex items-center justify-center min-h-[400px]">
                            <img
                                src="https://placehold.co/600x600/e2e8f0/64748b?text=Product"
                                alt={product.name}
                                className="w-full max-w-sm rounded-lg shadow-lg"
                            />
                        </div>

                        {/* Info Column */}
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                            {product.status === 'ACTIVE' && (
                                <span className="inline-block w-fit mb-4 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                    Disponible
                                </span>
                            )}

                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>

                            <div className="text-3xl font-bold text-blue-600 mb-6 font-mono">
                                {formattedPrice}
                            </div>

                            <div className="prose text-gray-600 mb-8">
                                <p>
                                    {product.descriptionLong ||
                                        product.descriptionShort ||
                                        'Sin descripción disponible.'}
                                </p>
                            </div>

                            <div className="border-t border-gray-100 pt-8">
                                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-3">
                                    Detalles
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">SKU</p>
                                        <p className="font-mono text-gray-900">
                                            {product.variants?.[0]?.sku || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Categoría</p>
                                        <p className="text-gray-900">General</p>
                                    </div>
                                </div>
                            </div>

                            {/* Client Component for Actions */}
                            <ProductActions product={product} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
