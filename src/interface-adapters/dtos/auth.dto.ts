import { z } from 'zod';

/**
 * Password Complexity Requirements (Enterprise Security Standards)
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character (optional but recommended)
 */
const passwordSchema = z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
    .regex(
        /[^A-Za-z0-9]/,
        'La contraseña debe contener al menos un carácter especial (!@#$%^&*)'
    );

/**
 * Email validation with enterprise-grade regex
 */
const emailSchema = z
    .string()
    .email('El correo electrónico no es válido')
    .min(1, 'El correo electrónico es requerido')
    .toLowerCase()
    .trim();

/**
 * Login Schema - Validates login form input
 */
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'La contraseña es requerida'),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Register Schema - Validates registration with strict password policy
 */
export const registerSchema = z
    .object({
        name: z
            .string()
            .min(2, 'El nombre debe tener al menos 2 caracteres')
            .max(100, 'El nombre no puede exceder 100 caracteres')
            .trim(),
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: z.string().min(1, 'Confirmar contraseña es requerido'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Password Reset Request Schema
 */
export const forgotPasswordSchema = z.object({
    email: emailSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * Password Reset Completion Schema
 */
export const resetPasswordSchema = z
    .object({
        token: z.string().min(1, 'Token es requerido'),
        password: passwordSchema,
        confirmPassword: z.string().min(1, 'Confirmar contraseña es requerido'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Validation helper - Validates login input
 */
export function validateLoginInput(
    data: unknown
): { success: true; data: LoginInput } | { success: false; errors: z.ZodError } {
    const result = loginSchema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, errors: result.error };
}

/**
 * Validation helper - Validates registration input
 */
export function validateRegisterInput(
    data: unknown
): { success: true; data: RegisterInput } | { success: false; errors: z.ZodError } {
    const result = registerSchema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, errors: result.error };
}
