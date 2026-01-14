import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

interface SuccessPageProps {
    params: Promise<{ orderId: string }>;
}

export default async function CheckoutSuccessPage({ params }: SuccessPageProps): Promise<React.JSX.Element> {
    const { orderId } = await params;

    return (
        <main className="min-h-screen bg-gray-50 py-16">
            <div className="container mx-auto px-4 max-w-lg text-center">
                {/* Success Icon */}
                <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                </div>

                {/* Success Message */}
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    ¡Gracias por tu compra!
                </h1>
                <p className="text-gray-600 mb-8">
                    Tu orden ha sido procesada exitosamente. Recibirás un email de confirmación pronto.
                </p>

                {/* Order Details */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8 text-left">
                    <div className="flex items-center gap-3 mb-4">
                        <Package className="h-6 w-6 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Detalles del Pedido</h2>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Número de Orden</span>
                            <span className="font-mono font-medium text-gray-900">ORD-{orderId.padStart(6, '0')}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Estado</span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pendiente
                            </span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">Fecha</span>
                            <span className="text-gray-900">{new Date().toLocaleDateString('es-PE')}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Seguir Comprando
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </main>
    );
}
