import { describe, it, expect } from 'vitest';
import {
    loginSchema,
    registerSchema,
    validateLoginInput,
    validateRegisterInput,
} from '@/interface-adapters/dtos/auth.dto';

describe('Auth Validation', () => {
    describe('Login Schema', () => {
        it('should accept valid email and password', () => {
            const result = loginSchema.safeParse({
                email: 'user@example.com',
                password: 'password123',
            });
            expect(result.success).toBe(true);
        });

        it('should reject invalid email format', () => {
            const result = loginSchema.safeParse({
                email: 'invalid-email',
                password: 'password123',
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toContain('email');
            }
        });

        it('should reject empty email', () => {
            const result = loginSchema.safeParse({
                email: '',
                password: 'password123',
            });
            expect(result.success).toBe(false);
        });

        it('should reject empty password', () => {
            const result = loginSchema.safeParse({
                email: 'user@example.com',
                password: '',
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toContain('password');
            }
        });

        it('should normalize email to lowercase', () => {
            const result = loginSchema.safeParse({
                email: 'USER@EXAMPLE.COM',
                password: 'password123',
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.email).toBe('user@example.com');
            }
        });

        it('should reject missing fields', () => {
            const result = loginSchema.safeParse({});
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues.length).toBeGreaterThanOrEqual(2);
            }
        });
    });

    describe('Register Schema', () => {
        const validRegistration = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'SecurePass123!',
            confirmPassword: 'SecurePass123!',
        };

        it('should accept valid registration data', () => {
            const result = registerSchema.safeParse(validRegistration);
            expect(result.success).toBe(true);
        });

        describe('Password Complexity', () => {
            it('should reject passwords shorter than 8 characters', () => {
                const result = registerSchema.safeParse({
                    ...validRegistration,
                    password: 'Short1!',
                    confirmPassword: 'Short1!',
                });
                expect(result.success).toBe(false);
                if (!result.success) {
                    const passwordError = result.error.issues.find(
                        (i) => i.path.includes('password') && i.message.includes('8')
                    );
                    expect(passwordError).toBeDefined();
                }
            });

            it('should reject passwords without uppercase letters', () => {
                const result = registerSchema.safeParse({
                    ...validRegistration,
                    password: 'lowercase123!',
                    confirmPassword: 'lowercase123!',
                });
                expect(result.success).toBe(false);
                if (!result.success) {
                    const passwordError = result.error.issues.find(
                        (i) => i.path.includes('password') && i.message.includes('mayúscula')
                    );
                    expect(passwordError).toBeDefined();
                }
            });

            it('should reject passwords without lowercase letters', () => {
                const result = registerSchema.safeParse({
                    ...validRegistration,
                    password: 'UPPERCASE123!',
                    confirmPassword: 'UPPERCASE123!',
                });
                expect(result.success).toBe(false);
                if (!result.success) {
                    const passwordError = result.error.issues.find(
                        (i) => i.path.includes('password') && i.message.includes('minúscula')
                    );
                    expect(passwordError).toBeDefined();
                }
            });

            it('should reject passwords without numbers', () => {
                const result = registerSchema.safeParse({
                    ...validRegistration,
                    password: 'NoNumbers!',
                    confirmPassword: 'NoNumbers!',
                });
                expect(result.success).toBe(false);
                if (!result.success) {
                    const passwordError = result.error.issues.find(
                        (i) => i.path.includes('password') && i.message.includes('número')
                    );
                    expect(passwordError).toBeDefined();
                }
            });

            it('should reject passwords without special characters', () => {
                const result = registerSchema.safeParse({
                    ...validRegistration,
                    password: 'NoSpecial123',
                    confirmPassword: 'NoSpecial123',
                });
                expect(result.success).toBe(false);
                if (!result.success) {
                    const passwordError = result.error.issues.find(
                        (i) => i.path.includes('password') && i.message.includes('especial')
                    );
                    expect(passwordError).toBeDefined();
                }
            });
        });

        describe('Password Confirmation', () => {
            it('should reject mismatched passwords', () => {
                const result = registerSchema.safeParse({
                    ...validRegistration,
                    confirmPassword: 'DifferentPassword123!',
                });
                expect(result.success).toBe(false);
                if (!result.success) {
                    const confirmError = result.error.issues.find((i) =>
                        i.path.includes('confirmPassword')
                    );
                    expect(confirmError).toBeDefined();
                }
            });
        });

        describe('Name Validation', () => {
            it('should reject names shorter than 2 characters', () => {
                const result = registerSchema.safeParse({
                    ...validRegistration,
                    name: 'A',
                });
                expect(result.success).toBe(false);
            });

            it('should reject names longer than 100 characters', () => {
                const result = registerSchema.safeParse({
                    ...validRegistration,
                    name: 'A'.repeat(101),
                });
                expect(result.success).toBe(false);
            });

            it('should trim whitespace from names', () => {
                const result = registerSchema.safeParse({
                    ...validRegistration,
                    name: '  John Doe  ',
                });
                expect(result.success).toBe(true);
                if (result.success) {
                    expect(result.data.name).toBe('John Doe');
                }
            });
        });

        describe('Email Validation', () => {
            it('should reject invalid email formats', () => {
                const invalidEmails = ['notanemail', 'missing@tld', '@nodomain.com', 'spaces in@email.com'];

                invalidEmails.forEach((email) => {
                    const result = registerSchema.safeParse({
                        ...validRegistration,
                        email,
                    });
                    expect(result.success).toBe(false);
                });
            });
        });
    });

    describe('Validation Helpers', () => {
        it('validateLoginInput should return success for valid data', () => {
            const result = validateLoginInput({
                email: 'user@example.com',
                password: 'password123',
            });
            expect(result.success).toBe(true);
        });

        it('validateLoginInput should return errors for invalid data', () => {
            const result = validateLoginInput({
                email: 'invalid',
                password: '',
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.errors.issues.length).toBeGreaterThan(0);
            }
        });

        it('validateRegisterInput should return success for valid data', () => {
            const result = validateRegisterInput({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'SecurePass123!',
                confirmPassword: 'SecurePass123!',
            });
            expect(result.success).toBe(true);
        });

        it('validateRegisterInput should return errors for weak password', () => {
            const result = validateRegisterInput({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'weak',
                confirmPassword: 'weak',
            });
            expect(result.success).toBe(false);
        });
    });
});
