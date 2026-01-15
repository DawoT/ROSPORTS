/**
 * User Domain Entity
 * Core identity representation in the domain layer
 */

export type UserRole = 'ADMIN' | 'CUSTOMER';

export interface User {
    id: string;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
    passwordHash: string | null;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * User creation input (without generated fields)
 */
export interface CreateUserInput {
    name: string;
    email: string;
    password: string; // Plain text - will be hashed before storage
    role?: UserRole;
}

/**
 * User profile update input
 */
export interface UpdateUserInput {
    name?: string;
    email?: string;
    image?: string;
}

/**
 * Authenticated session user (safe to expose to client)
 */
export interface SessionUser {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: UserRole;
}
