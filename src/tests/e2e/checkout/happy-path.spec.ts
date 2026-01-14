import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ProductPage } from '../pages/product.page';
import { CheckoutPage } from '../pages/checkout.page';

test.describe('Checkout Flow', () => {
    test('Happy Path: Guest triggers purchase from Home to Success', async ({ page }) => {
        const home = new HomePage(page);
        const product = new ProductPage(page);
        const checkout = new CheckoutPage(page);

        // 1. Visit Home
        page.on('console', (msg) => console.log(`BROWSER [${msg.type()}]: ${msg.text()}`));
        await home.goto();
        await page.waitForLoadState('networkidle');

        // 2. Click on the second product card found
        const productCard = page.getByTestId('product-card').nth(1);
        await expect(productCard).toBeVisible();
        await productCard.getByRole('link').first().click();

        // 3. Add to Cart
        await product.expectLoaded();
        await product.addToCart();

        // Manual open fallback if automatic trigger fails
        try {
            await product.waitForCart();
        } catch {
            console.log('Cart did not open automatically, clicking trigger...');
            await product.openMiniCart();
            await product.waitForCart();
        }

        // 4. Open MiniCart and Proceed to Checkout (or assume redirect/button)
        // Wait for cart to be open/updated
        const checkoutBtn = page.getByRole('link', { name: /checkout/i });
        await checkoutBtn.click(); // MiniCart usually opens and allows checkout

        // 5. Fill Checkout Form
        await checkout.expectLoaded();

        await checkout.fillCustomerInfo({
            firstName: 'Playwright',
            lastName: 'Tester',
            email: 'e2e@example.com',
            phone: '555-5555',
            address: '123 E2E Street',
            city: 'Automation City',
        });

        // 6. Submit
        await checkout.submitOrder();

        // 7. Verify Success
        await checkout.expectSuccess();
    });
});
