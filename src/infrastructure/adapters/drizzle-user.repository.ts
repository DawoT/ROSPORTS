import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { IUserRepository } from '@/core/repositories/user.repository';
import { User, CreateUserInput, UpdateUserInput } from '@/core/domain/user.types';
import * as schema from '@/infrastructure/database/schema';

const SALT_ROUNDS = 12; // Enterprise-grade security

/**
 * Drizzle User Repository
 * Implements IUserRepository using Drizzle ORM with PostgreSQL.
 * Handles password hashing with bcrypt.
 */
export class DrizzleUserRepository implements IUserRepository {
    constructor(private readonly db: NodePgDatabase<typeof schema>) { }

    async findById(id: string): Promise<User | null> {
        const result = await this.db
            .select()
            .from(schema.users)
            .where(eq(schema.users.id, id))
            .limit(1);

        if (result.length === 0) return null;

        return this.mapToUser(result[0]);
    }

    async findByEmail(email: string): Promise<User | null> {
        const result = await this.db
            .select()
            .from(schema.users)
            .where(eq(schema.users.email, email.toLowerCase()))
            .limit(1);

        if (result.length === 0) return null;

        return this.mapToUser(result[0]);
    }

    async create(input: CreateUserInput & { passwordHash: string }): Promise<User> {
        const [result] = await this.db
            .insert(schema.users)
            .values({
                name: input.name,
                email: input.email.toLowerCase(),
                passwordHash: input.passwordHash,
                role: input.role || 'CUSTOMER',
            })
            .returning();

        return this.mapToUser(result);
    }

    /**
     * Creates a new user with password hashing
     * Use this method when you have a plain text password
     */
    async createWithPassword(
        input: Omit<CreateUserInput, 'password'> & { password: string }
    ): Promise<User> {
        const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

        const [result] = await this.db
            .insert(schema.users)
            .values({
                name: input.name,
                email: input.email.toLowerCase(),
                passwordHash,
                role: input.role || 'CUSTOMER',
            })
            .returning();

        return this.mapToUser(result);
    }

    async update(id: string, input: UpdateUserInput): Promise<User | null> {
        const [result] = await this.db
            .update(schema.users)
            .set({
                ...input,
                updatedAt: new Date(),
            })
            .where(eq(schema.users.id, id))
            .returning();

        if (!result) return null;

        return this.mapToUser(result);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.db.delete(schema.users).where(eq(schema.users.id, id));

        return (result.rowCount ?? 0) > 0;
    }

    async emailExists(email: string): Promise<boolean> {
        const result = await this.db
            .select({ id: schema.users.id })
            .from(schema.users)
            .where(eq(schema.users.email, email.toLowerCase()))
            .limit(1);

        return result.length > 0;
    }

    /**
     * Verifies a password against the stored hash
     * @returns true if password matches
     */
    async verifyPassword(email: string, password: string): Promise<User | null> {
        const user = await this.findByEmail(email);
        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;

        return user;
    }

    /**
     * Maps database row to User domain entity
     */
    private mapToUser(row: typeof schema.users.$inferSelect): User {
        return {
            id: row.id,
            name: row.name,
            email: row.email,
            emailVerified: row.emailVerified,
            image: row.image,
            passwordHash: row.passwordHash,
            role: row.role as 'ADMIN' | 'CUSTOMER',
            createdAt: row.createdAt ?? new Date(),
            updatedAt: row.updatedAt ?? new Date(),
        };
    }
}

/**
 * Helper to hash a password (for use outside repository)
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Helper to verify a password (for use outside repository)
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}
