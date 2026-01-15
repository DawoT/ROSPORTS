import type { NextAuthConfig } from 'next-auth';

/**
 * NextAuth.js v5 Configuration
 * Shared configuration for auth.ts and middleware.ts
 * Keep providers empty here - they are defined in auth.ts
 */
export const authConfig: NextAuthConfig = {
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/register',
        error: '/auth/error',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnCheckout = nextUrl.pathname.startsWith('/checkout');
            const isOnAccount = nextUrl.pathname.startsWith('/account');

            // Protected routes
            if (isOnDashboard || isOnAccount) {
                if (isLoggedIn) return true;
                return false; // Redirect to login
            }

            // Checkout requires login
            if (isOnCheckout) {
                if (isLoggedIn) return true;
                return Response.redirect(new URL('/auth/login?callbackUrl=/checkout', nextUrl));
            }

            return true;
        },
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    providers: [], // Defined in auth.ts
};
