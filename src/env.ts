import { z } from 'zod';

const envSchema = z.object({
    DATABASE_URL: z.string().url().optional(),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    USE_MOCK: z.enum(['true', 'false']).optional().default('false'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    const errorMessage = `❌ Invalid environment variables: ${JSON.stringify(parsed.error.format(), null, 4)}`;
    // Don't use process.exit in modules - it breaks test runners
    if (process.env.NODE_ENV !== 'test') {
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
}

// Export with defaults for test environment
export const env = parsed.success
    ? parsed.data
    : {
        DATABASE_URL: undefined,
        NODE_ENV: 'test' as const,
        USE_MOCK: 'false' as const,
    };
