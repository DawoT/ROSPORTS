import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        environment: 'node',
        globals: true,
        include: ['src/tests/integration/**/*.test.{ts,tsx}'],
        exclude: ['legacy_backup/**/*', 'node_modules/**/*'],
        pool: 'forks', // Force separate processes for integration tests
        setupFiles: [],
        testTimeout: 30000,
    },
});
