import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/cart-context';
import { Navbar } from '@/components/ui/navbar';
import { MiniCart } from '@/components/ui/mini-cart';
import { auth } from '@/lib/auth';

export const metadata: Metadata = {
    title: 'ROSPORTS - Tu Tienda de Deportes',
    description: 'Productos deportivos de alta calidad para atletas exigentes.',
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}): Promise<React.JSX.Element> {
    // Get session for auth-aware navbar
    const session = await auth();

    return (
        <html lang="es" suppressHydrationWarning>
            <body className="min-h-screen bg-gray-50 antialiased" suppressHydrationWarning>
                <CartProvider>
                    <Navbar
                        session={
                            session?.user
                                ? {
                                    user: {
                                        name: session.user.name,
                                        email: session.user.email ?? '',
                                        role: session.user.role ?? 'CUSTOMER',
                                    },
                                }
                                : null
                        }
                    />
                    <MiniCart />
                    {children}
                </CartProvider>
            </body>
        </html>
    );
}
