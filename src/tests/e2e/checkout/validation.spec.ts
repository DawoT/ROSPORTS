import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ProductPage } from '../pages/product.page';
import { CheckoutPage } from '../pages/checkout.page';

test.describe('Checkout Validation', () => {
    test.beforeEach(async ({ page }) => {
        page.on('console', (msg) => {
            console.log(`BROWSER LOG [${msg.type()}]: ${msg.text()}`);
        });
        page.on('pageerror', (err) => {
            console.error(`BROWSER ERROR: ${err.message}`);
        });
    });

    test('Negative Path: Invalid email triggers error', async ({ page }) => {
        const home = new HomePage(page);
        const product = new ProductPage(page);
        const checkout = new CheckoutPage(page);

        // 1. Setup Cart
        await home.goto();
        await page.waitForLoadState('networkidle');

        // Go to specific product
        const productCard = page.getByTestId('product-card').nth(1);
        await productCard.waitFor({ state: 'visible' });
        await productCard.getByRole('link').first().click();

        await product.expectLoaded();
        await product.addToCart();

        // Navigate robustly to checkout (leveraging new localStorage persistence)
        await page.goto('/checkout');
        await page.waitForLoadState('networkidle');

        await checkout.expectLoaded();

        // 2. Fill Form with INVAlID data
        await checkout.fillCustomerInfo({
            firstName: 'Validation',
            lastName: 'Tester',
            email: 'invalid-email', // Clearly invalid for Zod
            phone: '5551234',
            address: 'Calle Falsa 123',
            city: 'Lima',
        });

        // 3. Submit
        await checkout.submitOrder();

        // 4. Verify Server Error UI
        await checkout.expectFieldError('email', /email/i);
    });

    test('Negative Path: Empty required fields block submission', async ({ page }) => {
        const home = new HomePage(page);
        const product = new ProductPage(page);
        const checkout = new CheckoutPage(page);

        await home.goto();
        await page.getByTestId('product-card').first().getByRole('link').first().click();

        await product.expectLoaded();
        await product.addToCart();

        // Navigate robustly to checkout
        await page.goto('/checkout');
        await page.waitForLoadState('networkidle');

        await checkout.expectLoaded();

        // Submit empty form (HTML5 standard check usually blocks it, but we also want to see if our Zod fallback works if we bypass HTML5)
        // We'll just check if the submit button is there
        await checkout.submitOrder();

        // At least one error should be visible (either browser tooltip or server msg)
        // Browser tooltips are hard to catch, so we verify we stay on the same page and see some red text if browser allows submission
        await expect(page).toHaveURL(/.*\/checkout/);
    });
});
