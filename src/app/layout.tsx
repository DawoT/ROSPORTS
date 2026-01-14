import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/cart-context';
import { Navbar } from '@/components/ui/navbar';

export const metadata: Metadata = {
    title: 'ROSPORTS - Tu Tienda de Deportes',
    description: 'Productos deportivos de alta calidad para atletas exigentes.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}): React.JSX.Element {
    return (
        <html lang="es">
            <body className="min-h-screen bg-gray-50 antialiased">
                <CartProvider>
                    <Navbar />
                    {children}
                </CartProvider>
            </body>
        </html>
    );
}
