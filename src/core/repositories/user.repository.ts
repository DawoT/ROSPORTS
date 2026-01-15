import { User, CreateUserInput, UpdateUserInput } from '@/core/domain/user.types';

/**
 * User Repository Interface
 * Defines the contract for user data persistence operations
 */
export interface IUserRepository {
    /**
     * Find a user by their unique ID
     * @param id - User UUID
     * @returns User or null if not found
     */
    findById(id: string): Promise<User | null>;

    /**
     * Find a user by their email address
     * @param email - User email (case-insensitive)
     * @returns User or null if not found
     */
    findByEmail(email: string): Promise<User | null>;

    /**
     * Create a new user
     * @param input - User creation data (password should already be hashed)
     * @returns Created user
     */
    create(input: CreateUserInput & { passwordHash: string }): Promise<User>;

    /**
     * Update an existing user
     * @param id - User UUID
     * @param input - Fields to update
     * @returns Updated user or null if not found
     */
    update(id: string, input: UpdateUserInput): Promise<User | null>;

    /**
     * Delete a user by ID
     * @param id - User UUID
     * @returns true if deleted, false if not found
     */
    delete(id: string): Promise<boolean>;

    /**
     * Check if an email is already registered
     * @param email - Email to check
     * @returns true if email exists
     */
    emailExists(email: string): Promise<boolean>;
}
