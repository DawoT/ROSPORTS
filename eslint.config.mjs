import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default tseslint.config(
    {
        ignores: [
            'legacy_backup/',
            '.next/',
            'out/',
            'dist/',
            'node_modules/',
            'playwright-report/',
            'test-results/',
        ],
    },
    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                project: ['./tsconfig.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            import: importPlugin,
        },
        settings: {
            react: {
                version: 'detect',
            },
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                },
            },
        },
        rules: {
            ...reactHooksPlugin.configs.recommended.rules,
            'no-console': ['error', { allow: ['warn', 'error'] }],
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/explicit-function-return-type': 'error',
            'import/no-cycle': 'error',
            'react/react-in-jsx-scope': 'off',
        },
    },
    {
        // CLI Scripts: Allow console (UI for scripts) but maintain type strictness
        files: ['scripts/**/*.ts'],
        rules: {
            'no-console': 'off',
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/no-explicit-any': 'error',
        },
    },
    {
        // Tests: Allow console and relax any for mocks
        files: ['src/tests/**/*.ts'],
        rules: {
            'no-console': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'error',
        },
    },
    {
        // Next.js Components/Pages: Relax return type requirement as it's often implicit JSX
        // But maintain NO console and NO any
        files: ['src/app/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}'],
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'off',
        },
    }
);
