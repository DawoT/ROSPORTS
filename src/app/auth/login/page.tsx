'use client';

import { useActionState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loginAction, LoginActionState } from '@/interface-adapters/actions/auth.actions';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const [state, formAction, isPending] = useActionState<LoginActionState | null, FormData>(
        loginAction,
        null
    );

    useEffect(() => {
        if (state?.success) {
            router.push(callbackUrl);
            router.refresh();
        }
    }, [state?.success, callbackUrl, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-3xl font-bold text-white">ROSPORTS</h1>
                    </Link>
                    <p className="text-gray-400 mt-2">Inicia sesión en tu cuenta</p>
                </div>

                {/* Login Card */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-700/50">
                    <form action={formAction} className="space-y-6">
                        {/* Global Error */}
                        {state?.error && !state.fieldErrors && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm">
                                {state.error}
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                autoComplete="email"
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="tu@email.com"
                            />
                            {state?.fieldErrors?.email && (
                                <p className="mt-1 text-sm text-red-400">{state.fieldErrors.email[0]}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                autoComplete="current-password"
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                            {state?.fieldErrors?.password && (
                                <p className="mt-1 text-sm text-red-400">{state.fieldErrors.password[0]}</p>
                            )}
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex justify-end">
                            <Link
                                href="/auth/forgot-password"
                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
                        >
                            {isPending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                    Iniciando sesión...
                                </span>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 pt-6 border-t border-gray-700 text-center">
                        <p className="text-gray-400">
                            ¿No tienes una cuenta?{' '}
                            <Link
                                href="/auth/register"
                                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                            >
                                Crear cuenta
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link href="/" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">
                        ← Volver a la tienda
                    </Link>
                </div>
            </div>
        </div>
    );
}
