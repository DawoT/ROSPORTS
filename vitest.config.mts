import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    // @ts-ignore
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        fileParallelism: false,
        environment: 'jsdom',
        setupFiles: ['./src/tests/setup.ts'],
        globals: true,
        include: ['src/tests/**/*.test.{ts,tsx}'],
        exclude: ['legacy_backup/**/*', 'node_modules/**/*'],
    },
});
