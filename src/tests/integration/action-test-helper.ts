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
