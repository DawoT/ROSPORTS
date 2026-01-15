import { test, expect } from '@playwright/test';

/**
 * Login Page E2E Tests
 *
 * NOTE: These tests are part of TDD "Red" stage.
 * They WILL FAIL because the /login page does not exist yet.
 * This is the expected behavior for TDD.
 */
test.describe('Login Page', () => {
    test.describe('UI Elements', () => {
        test('should display login form with email and password inputs', async ({ page }) => {
            await page.goto('/login');

            // Check for email input
            const emailInput = page.getByLabel(/correo|email/i);
            await expect(emailInput).toBeVisible();
            await expect(emailInput).toHaveAttribute('type', 'email');

            // Check for password input
            const passwordInput = page.getByLabel(/contraseña|password/i);
            await expect(passwordInput).toBeVisible();
            await expect(passwordInput).toHaveAttribute('type', 'password');

            // Check for submit button
            const submitButton = page.getByRole('button', { name: /iniciar sesión|login|entrar/i });
            await expect(submitButton).toBeVisible();
        });

        test('should display link to registration page', async ({ page }) => {
            await page.goto('/login');

            const registerLink = page.getByRole('link', { name: /registr|crear cuenta|sign up/i });
            await expect(registerLink).toBeVisible();
        });

        test('should display link to forgot password', async ({ page }) => {
            await page.goto('/login');

            const forgotLink = page.getByRole('link', {
                name: /olvidaste|forgot|recuperar/i,
            });
            await expect(forgotLink).toBeVisible();
        });
    });

    test.describe('Form Validation', () => {
        test('should show error when submitting empty form', async ({ page }) => {
            await page.goto('/login');

            // Click submit without filling form
            const submitButton = page.getByRole('button', { name: /iniciar sesión|login|entrar/i });
            await submitButton.click();

            // Expect validation error messages
            await expect(
                page.getByText(/correo.*requerido|email.*required/i).or(page.getByText(/campo.*obligatorio/i))
            ).toBeVisible();
        });

        test('should show error for invalid email format', async ({ page }) => {
            await page.goto('/login');

            const emailInput = page.getByLabel(/correo|email/i);
            await emailInput.fill('invalid-email');

            const passwordInput = page.getByLabel(/contraseña|password/i);
            await passwordInput.fill('somepassword');

            const submitButton = page.getByRole('button', { name: /iniciar sesión|login|entrar/i });
            await submitButton.click();

            // Expect email validation error
            await expect(page.getByText(/correo.*válido|valid.*email/i)).toBeVisible();
        });

        test('should show error for incorrect credentials', async ({ page }) => {
            await page.goto('/login');

            const emailInput = page.getByLabel(/correo|email/i);
            await emailInput.fill('wrong@example.com');

            const passwordInput = page.getByLabel(/contraseña|password/i);
            await passwordInput.fill('wrongpassword');

            const submitButton = page.getByRole('button', { name: /iniciar sesión|login|entrar/i });
            await submitButton.click();

            // Expect authentication error
            await expect(
                page.getByText(/credenciales.*incorrectas|invalid.*credentials|incorrecto/i)
            ).toBeVisible({ timeout: 5000 });
        });
    });

    test.describe('Successful Authentication', () => {
        // NOTE: This test requires a seeded test user in the database
        // For now, it will fail as part of TDD "Red" stage
        test('should redirect to dashboard after successful login', async ({ page }) => {
            await page.goto('/login');

            // Fill in test user credentials (will be seeded in Green stage)
            const emailInput = page.getByLabel(/correo|email/i);
            await emailInput.fill('test@rosports.com');

            const passwordInput = page.getByLabel(/contraseña|password/i);
            await passwordInput.fill('TestPass123!');

            const submitButton = page.getByRole('button', { name: /iniciar sesión|login|entrar/i });
            await submitButton.click();

            // Should redirect to dashboard or home
            await expect(page).toHaveURL(/\/(dashboard|home|tienda)?$/i, { timeout: 10000 });

            // Should show user indicator (name or avatar)
            await expect(
                page.getByText(/test/i).or(page.getByRole('button', { name: /mi cuenta|perfil|account/i }))
            ).toBeVisible();
        });

        test('should persist session after page reload', async ({ page }) => {
            // First, login
            await page.goto('/login');

            const emailInput = page.getByLabel(/correo|email/i);
            await emailInput.fill('test@rosports.com');

            const passwordInput = page.getByLabel(/contraseña|password/i);
            await passwordInput.fill('TestPass123!');

            await page.getByRole('button', { name: /iniciar sesión|login|entrar/i }).click();

            // Wait for redirect
            await page.waitForURL(/\/(dashboard|home|tienda)?$/i, { timeout: 10000 });

            // Reload page
            await page.reload();

            // Session should persist - user should still be logged in
            await expect(
                page.getByRole('button', { name: /mi cuenta|perfil|account/i }).or(page.getByText(/cerrar sesión|logout/i))
            ).toBeVisible();
        });
    });

    test.describe('Logout', () => {
        test('should logout and redirect to home', async ({ page }) => {
            // Assume logged in state (will need auth helper in Green stage)
            await page.goto('/login');

            const emailInput = page.getByLabel(/correo|email/i);
            await emailInput.fill('test@rosports.com');

            const passwordInput = page.getByLabel(/contraseña|password/i);
            await passwordInput.fill('TestPass123!');

            await page.getByRole('button', { name: /iniciar sesión|login|entrar/i }).click();

            await page.waitForURL(/\/(dashboard|home|tienda)?$/i, { timeout: 10000 });

            // Find and click logout
            const accountButton = page.getByRole('button', { name: /mi cuenta|perfil|account/i });
            await accountButton.click();

            const logoutButton = page.getByRole('button', { name: /cerrar sesión|logout|salir/i });
            await logoutButton.click();

            // Should redirect to home or login
            await expect(page).toHaveURL(/\/(login|home)?$/i);

            // Login button should be visible again
            await expect(
                page.getByRole('link', { name: /iniciar sesión|login/i })
            ).toBeVisible();
        });
    });
});
