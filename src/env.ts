import { z } from 'zod';

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    USE_MOCK: z.enum(['true', 'false']).optional().default('false'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error(
        '❌ Invalid environment variables:',
        JSON.stringify(parsed.error.format(), null, 4)
    );
    process.exit(1);
}

export const env = parsed.data;
