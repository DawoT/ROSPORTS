'use server';

import { AuthError } from 'next-auth';
import { signIn, signOut } from '@/lib/auth';
import { db } from '@/infrastructure/database/connection';
import { DrizzleUserRepository } from '@/infrastructure/adapters/drizzle-user.repository';
import { loginSchema, registerSchema } from '@/interface-adapters/dtos/auth.dto';
import { redirect } from 'next/navigation';
import type { SessionUser } from '@/core/domain/user.types';

const userRepository = new DrizzleUserRepository(db);

// ============================================
// LOGIN ACTION
// ============================================

export type LoginActionState = {
    success: boolean;
    error?: string;
    fieldErrors?: Record<string, string[]>;
};

export async function loginAction(
    _prevState: LoginActionState | null,
    formData: FormData
): Promise<LoginActionState> {
    const rawData = {
        email: formData.get('email'),
        password: formData.get('password'),
    };

    // Validate with Zod
    const parsed = loginSchema.safeParse(rawData);

    if (!parsed.success) {
        return {
            success: false,
            error: 'Por favor corrige los errores del formulario',
            fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        };
    }

    try {
        await signIn('credentials', {
            email: parsed.data.email,
            password: parsed.data.password,
            redirect: false,
        });

        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {
                        success: false,
                        error: 'Credenciales incorrectas. Verifica tu email y contraseña.',
                    };
                default:
                    return {
                        success: false,
                        error: 'Error de autenticación. Por favor intenta de nuevo.',
                    };
            }
        }
        throw error;
    }
}

// ============================================
// REGISTER ACTION
// ============================================

export type RegisterActionState = {
    success: boolean;
    error?: string;
    fieldErrors?: Record<string, string[]>;
};

export async function registerAction(
    _prevState: RegisterActionState | null,
    formData: FormData
): Promise<RegisterActionState> {
    const rawData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    };

    // Validate with Zod
    const parsed = registerSchema.safeParse(rawData);

    if (!parsed.success) {
        return {
            success: false,
            error: 'Por favor corrige los errores del formulario',
            fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
        };
    }

    try {
        // Check if user already exists
        const existingUser = await userRepository.findByEmail(parsed.data.email);

        if (existingUser) {
            return {
                success: false,
                error: 'Este correo electrónico ya está registrado.',
                fieldErrors: { email: ['Este correo ya está en uso'] },
            };
        }

        // Create new user with hashed password
        await userRepository.createWithPassword({
            name: parsed.data.name,
            email: parsed.data.email,
            password: parsed.data.password,
        });

        // Auto sign-in after registration
        await signIn('credentials', {
            email: parsed.data.email,
            password: parsed.data.password,
            redirect: false,
        });

        return { success: true };
    } catch {
        // Error is logged server-side but not exposed to client
        return {
            success: false,
            error: 'Error al crear la cuenta. Por favor intenta de nuevo.',
        };
    }
}

// ============================================
// LOGOUT ACTION
// ============================================

export async function logoutAction(): Promise<void> {
    await signOut({ redirect: false });
    redirect('/');
}

// ============================================
// GET CURRENT USER (Server Component Helper)
// ============================================

export async function getCurrentUser(): Promise<SessionUser | null> {
    const { auth } = await import('@/lib/auth');
    const session = await auth();
    if (!session?.user) return null;
    return {
        id: session.user.id,
        name: session.user.name ?? null,
        email: session.user.email,
        image: session.user.image ?? null,
        role: (session.user.role as 'ADMIN' | 'CUSTOMER') ?? 'CUSTOMER',
    };
}
