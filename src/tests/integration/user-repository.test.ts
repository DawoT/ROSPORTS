import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { getTestDb, closeTestDb, isDbAvailable } from './db-helper';
import { DrizzleUserRepository } from '@/infrastructure/adapters/drizzle-user.repository';
import { users } from '@/infrastructure/database/schema';

// Check if users table exists in test database
let usersTableExists = false;

describe.skipIf(!isDbAvailable)('User Repository Integration', () => {
    let repository: DrizzleUserRepository;

    beforeAll(async () => {
        // Check if users table exists
        const { db } = await getTestDb();
        try {
            await db.select().from(users).limit(1);
            usersTableExists = true;
        } catch {
            // Table doesn't exist - tests will be skipped
            usersTableExists = false;
            console.log('[Test] users table not found - skipping user repository tests');
        }
    });

    beforeEach(async () => {
        if (!usersTableExists) return;

        const { db } = await getTestDb();
        repository = new DrizzleUserRepository(db);

        // Clean up users table before each test
        await db.delete(users);
    });

    afterAll(async () => {
        await closeTestDb();
    });

    describe('create', () => {
        it.skipIf(!usersTableExists)(
            'should create a new user and return it with generated ID',
            async () => {
                const input = {
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'not-stored',
                    passwordHash: 'hashed_password_here',
                    role: 'CUSTOMER' as const,
                };

                const user = await repository.create(input);

                expect(user).toBeDefined();
                expect(user.id).toBeDefined();
                expect(user.id).toMatch(
                    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
                );
                expect(user.name).toBe('Test User');
                expect(user.email).toBe('test@example.com');
                expect(user.role).toBe('CUSTOMER');
                expect(user.passwordHash).toBe('hashed_password_here');
                expect(user.createdAt).toBeInstanceOf(Date);
            }
        );

        it.skipIf(!usersTableExists)('should normalize email to lowercase', async () => {
            const input = {
                name: 'Upper Email',
                email: 'UPPER@EXAMPLE.COM',
                password: 'ignored',
                passwordHash: 'hash',
            };

            const user = await repository.create(input);

            expect(user.email).toBe('upper@example.com');
        });

        it.skipIf(!usersTableExists)(
            'should default role to CUSTOMER when not specified',
            async () => {
                const input = {
                    name: 'Default Role',
                    email: 'default@example.com',
                    password: 'ignored',
                    passwordHash: 'hash',
                };

                const user = await repository.create(input);

                expect(user.role).toBe('CUSTOMER');
            }
        );
    });

    describe('findByEmail', () => {
        it.skipIf(!usersTableExists)('should find an existing user by email', async () => {
            await repository.create({
                name: 'Find Me',
                email: 'findme@example.com',
                password: 'ignored',
                passwordHash: 'hash123',
            });

            const found = await repository.findByEmail('findme@example.com');

            expect(found).not.toBeNull();
            expect(found?.name).toBe('Find Me');
            expect(found?.email).toBe('findme@example.com');
        });

        it.skipIf(!usersTableExists)(
            'should return null for non-existent email',
            async () => {
                const found = await repository.findByEmail('nonexistent@example.com');

                expect(found).toBeNull();
            }
        );

        it.skipIf(!usersTableExists)('should find user case-insensitively', async () => {
            await repository.create({
                name: 'Case Test',
                email: 'casetest@example.com',
                password: 'ignored',
                passwordHash: 'hash',
            });

            const found = await repository.findByEmail('CASETEST@EXAMPLE.COM');

            expect(found).not.toBeNull();
            expect(found?.email).toBe('casetest@example.com');
        });
    });

    describe('findById', () => {
        it.skipIf(!usersTableExists)('should find an existing user by ID', async () => {
            const created = await repository.create({
                name: 'Find By ID',
                email: 'findbyid@example.com',
                password: 'ignored',
                passwordHash: 'hash456',
            });

            const found = await repository.findById(created.id);

            expect(found).not.toBeNull();
            expect(found?.id).toBe(created.id);
            expect(found?.email).toBe('findbyid@example.com');
        });

        it.skipIf(!usersTableExists)('should return null for non-existent ID', async () => {
            const found = await repository.findById('00000000-0000-0000-0000-000000000000');

            expect(found).toBeNull();
        });
    });

    describe('emailExists', () => {
        it.skipIf(!usersTableExists)('should return true if email exists', async () => {
            await repository.create({
                name: 'Email Check',
                email: 'exists@example.com',
                password: 'ignored',
                passwordHash: 'hash',
            });

            const exists = await repository.emailExists('exists@example.com');

            expect(exists).toBe(true);
        });

        it.skipIf(!usersTableExists)(
            'should return false if email does not exist',
            async () => {
                const exists = await repository.emailExists('nothere@example.com');

                expect(exists).toBe(false);
            }
        );

        it.skipIf(!usersTableExists)('should check case-insensitively', async () => {
            await repository.create({
                name: 'Email Case',
                email: 'emailcase@example.com',
                password: 'ignored',
                passwordHash: 'hash',
            });

            const exists = await repository.emailExists('EMAILCASE@EXAMPLE.COM');

            expect(exists).toBe(true);
        });
    });

    describe('update', () => {
        it.skipIf(!usersTableExists)('should update user name', async () => {
            const created = await repository.create({
                name: 'Original Name',
                email: 'update@example.com',
                password: 'ignored',
                passwordHash: 'hash',
            });

            const updated = await repository.update(created.id, { name: 'Updated Name' });

            expect(updated).not.toBeNull();
            expect(updated?.name).toBe('Updated Name');
            expect(updated?.email).toBe('update@example.com');
        });

        it.skipIf(!usersTableExists)(
            'should return null when updating non-existent user',
            async () => {
                const updated = await repository.update(
                    '00000000-0000-0000-0000-000000000000',
                    { name: 'Ghost' }
                );

                expect(updated).toBeNull();
            }
        );
    });

    describe('delete', () => {
        it.skipIf(!usersTableExists)('should delete an existing user', async () => {
            const created = await repository.create({
                name: 'Delete Me',
                email: 'deleteme@example.com',
                password: 'ignored',
                passwordHash: 'hash',
            });

            const deleted = await repository.delete(created.id);

            expect(deleted).toBe(true);

            const found = await repository.findById(created.id);
            expect(found).toBeNull();
        });

        it.skipIf(!usersTableExists)(
            'should return false when deleting non-existent user',
            async () => {
                const deleted = await repository.delete(
                    '00000000-0000-0000-0000-000000000000'
                );

                expect(deleted).toBe(false);
            }
        );
    });
});
