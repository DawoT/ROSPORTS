import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { authConfig } from './config';
import { db } from '@/infrastructure/database/connection';
import { DrizzleUserRepository } from '@/infrastructure/adapters/drizzle-user.repository';
import { loginSchema } from '@/interface-adapters/dtos/auth.dto';

// Repository instance for auth operations
const userRepository = new DrizzleUserRepository(db);

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: DrizzleAdapter(db),
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                // Validate input with Zod
                const parsed = loginSchema.safeParse(credentials);
                if (!parsed.success) {
                    return null;
                }

                const { email, password } = parsed.data;

                // Verify credentials against database
                const user = await userRepository.verifyPassword(email, password);

                if (!user) {
                    return null;
                }

                // Return user object for JWT
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                };
            },
        }),
    ],
    debug: process.env.NODE_ENV === 'development',
});

// Type augmentation for NextAuth
declare module 'next-auth' {
    interface User {
        role?: string;
    }
    interface Session {
        user: {
            id: string;
            role: string;
            email: string;
            name?: string | null;
            image?: string | null;
        };
    }
}
