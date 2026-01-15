import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/config';

const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
    // Matcher for routes that should run middleware
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
