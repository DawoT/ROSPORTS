import { getProductsAction } from '@/interface-adapters/actions/product.actions';
import { ProductCard } from '@/components/ui/product-card';

export default async function HomePage(): Promise<React.JSX.Element> {
    // Fetch products from the server
    const result = await getProductsAction(1);

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                        ROSPORTS
                    </h1>
                    <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
                        Tu tienda de deportes favorita. Productos de calidad para atletas exigentes.
                    </p>
                </div>
            </section>

            {/* Products Section */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Productos Destacados</h2>

                    {!result.success ? (
                        <div className="rounded-lg bg-red-50 p-4 text-center">
                            <p className="text-red-600">
                                {result.message ||
                                    'Error loading products. Please try again later.'}
                            </p>
                        </div>
                    ) : result.data && result.data.items.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {result.data.items.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg bg-gray-100 p-8 text-center">
                            <p className="text-gray-600">
                                No hay productos disponibles en este momento.
                            </p>
                            <p className="mt-2 text-sm text-gray-500">
                                Tip: Ejecuta el script de seed para agregar productos de prueba.
                            </p>
                        </div>
                    )}

                    {/* Pagination Info */}
                    {result.success && result.data && result.data.total > 0 && (
                        <div className="mt-8 text-center text-sm text-gray-500">
                            Mostrando {result.data.items.length} de {result.data.total} productos
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
