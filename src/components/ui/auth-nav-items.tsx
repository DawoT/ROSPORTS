'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, LogOut } from 'lucide-react';
import { logoutAction } from '@/interface-adapters/actions/auth.actions';

interface AuthNavItemsProps {
    session: {
        user: {
            name?: string | null;
            email: string;
            role: string;
        };
    } | null;
}

export function AuthNavItems({ session }: AuthNavItemsProps): React.JSX.Element {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (): void => setIsMenuOpen(false);
        if (isMenuOpen) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [isMenuOpen]);

    if (!session?.user) {
        return (
            <Link
                href="/auth/login"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">Iniciar Sesión</span>
            </Link>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
            >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                    {session.user.name?.charAt(0).toUpperCase() || session.user.email.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-24 truncate">
                    {session.user.name || session.user.email.split('@')[0]}
                </span>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {session.user.name || 'Usuario'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                    </div>

                    <Link
                        href="/account"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <User className="h-4 w-4" />
                        Mi Cuenta
                    </Link>

                    {session.user.role === 'ADMIN' && (
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                            Dashboard
                        </Link>
                    )}

                    <form action={logoutAction}>
                        <button
                            type="submit"
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Cerrar Sesión
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
