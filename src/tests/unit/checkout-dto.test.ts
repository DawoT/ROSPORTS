import { describe, it, expect } from 'vitest';
import { checkoutSchema } from '@/interface-adapters/dtos/checkout.dto';

describe('checkoutSchema', () => {
    const validData = {
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan@example.com',
        phone: '999888777',
        address: 'Av. Javier Prado 123',
        city: 'Lima',
        notes: 'Dejar con el portero',
    };

    describe('Valid Inputs', () => {
        it('should accept valid data with all fields', () => {
            const result = checkoutSchema.safeParse(validData);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.firstName).toBe('Juan');
                expect(result.data.email).toBe('juan@example.com');
            }
        });

        it('should accept data without optional fields', () => {
            const minimalData = {
                firstName: 'Juan',
                email: 'juan@example.com',
                address: 'Av. Prado 123',
                city: 'Lima',
            };
            const result = checkoutSchema.safeParse(minimalData);
            expect(result.success).toBe(true);
        });

        it('should trim whitespace from fields', () => {
            const dataWithSpaces = {
                ...validData,
                firstName: '  Juan  ',
                email: ' juan@example.com ',
            };
            const result = checkoutSchema.safeParse(dataWithSpaces);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.firstName).toBe('Juan');
                expect(result.data.email).toBe('juan@example.com');
            }
        });
    });

    describe('Required Field Validation', () => {
        it('should reject empty firstName', () => {
            const data = { ...validData, firstName: '' };
            const result = checkoutSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].path).toContain('firstName');
            }
        });

        it('should reject missing email', () => {
            const { email: _, ...dataWithoutEmail } = validData;
            const result = checkoutSchema.safeParse(dataWithoutEmail);
            expect(result.success).toBe(false);
        });

        it('should reject empty address', () => {
            const data = { ...validData, address: '' };
            const result = checkoutSchema.safeParse(data);
            expect(result.success).toBe(false);
        });

        it('should reject empty city', () => {
            const data = { ...validData, city: '' };
            const result = checkoutSchema.safeParse(data);
            expect(result.success).toBe(false);
        });
    });

    describe('Email Validation', () => {
        it('should reject invalid email format', () => {
            const invalidEmails = [
                'notanemail',
                'missing@domain',
                '@nodomain.com',
                'spaces in@email.com',
            ];

            for (const email of invalidEmails) {
                const result = checkoutSchema.safeParse({ ...validData, email });
                expect(result.success).toBe(false);
            }
        });

        it('should accept various valid email formats', () => {
            const validEmails = [
                'simple@example.com',
                'user.name@domain.org',
                'user+tag@company.co',
            ];

            for (const email of validEmails) {
                const result = checkoutSchema.safeParse({ ...validData, email });
                expect(result.success).toBe(true);
            }
        });
    });

    describe('Optional Fields', () => {
        it('should accept undefined lastName', () => {
            const { lastName: _, ...data } = validData;
            const result = checkoutSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        it('should accept undefined phone', () => {
            const { phone: _, ...data } = validData;
            const result = checkoutSchema.safeParse(data);
            expect(result.success).toBe(true);
        });

        it('should accept undefined notes', () => {
            const { notes: _, ...data } = validData;
            const result = checkoutSchema.safeParse(data);
            expect(result.success).toBe(true);
        });
    });
});
