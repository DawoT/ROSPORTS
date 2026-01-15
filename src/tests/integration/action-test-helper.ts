import { vi } from 'vitest';

/**
 * Creates a mock FormData object from a plain record.
 */
export function createFormData(data: Record<string, unknown>): FormData {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        if (Array.isArray(value) || typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
        } else {
            formData.append(key, String(value));
        }
    });
    return formData;
}

/**
 * Common configuration for mocking next/headers cookies.
 * Usage:
 *   const { mockCookies } = await import('./action-test-helper');
 *   const cookies = mockCookies({ 'cart_session': 'test-session' });
 */
export function setupCookieMock(initialCookies: Record<string, string> = {}): {
    get: (name: string) => { value: string } | undefined;
    set: (name: string, value: string) => void;
    delete: (name: string) => void;
    has: (name: string) => boolean;
} {
    const store = new Map<string, string>(Object.entries(initialCookies));

    const mockStore = {
        get: vi.fn((name: string) => {
            const val = store.get(name);
            return val ? { value: val } : undefined;
        }),
        set: vi.fn((name: string, value: string) => {
            store.set(name, value);
        }),
        delete: vi.fn((name: string) => {
            store.delete(name);
        }),
        has: vi.fn((name: string) => store.has(name)),
    };

    return mockStore;
}

/**
 * Auth Bypass Helper for Test Environments
 *
 * IMPORTANT: This helper prepares tests for the upcoming Auth phase.
 * Current checkout works with "guest" users. When auth is added:
 * 1. Use this helper to simulate authenticated sessions in tests
 * 2. Set TEST_AUTH_BYPASS=true in test environment
 * 3. Server actions should check for this flag to skip auth validation in tests
 *
 * Usage:
 *   const authCookies = setupAuthBypass({ userId: 'test-user-123' });
 *   mockCookieStore.get.mockImplementation(authCookies.get);
 */
export function setupAuthBypass(userData: {
    userId?: string;
    email?: string;
    role?: 'guest' | 'customer' | 'admin';
} = {}): {
    get: (name: string) => { value: string } | undefined;
    isAuthenticated: boolean;
    userId: string;
} {
    const defaults = {
        userId: userData.userId || 'test-user-guest',
        email: userData.email || 'test@example.com',
        role: userData.role || 'guest',
    };

    // Simulate auth session cookie
    const sessionToken = Buffer.from(JSON.stringify(defaults)).toString('base64');

    return {
        get: (name: string): { value: string } | undefined => {
            if (name === 'auth_session') {
                return { value: sessionToken };
            }
            if (name === 'user_id') {
                return { value: defaults.userId };
            }
            return undefined;
        },
        isAuthenticated: defaults.role !== 'guest',
        userId: defaults.userId,
    };
}
