import { BasePage } from './base.page';
import { Page, expect } from '@playwright/test';

export class ProductPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async expectLoaded(): Promise<void> {
        await this.page.waitForURL(/.*\/product\/.*/);
        await this.page.waitForLoadState('networkidle');
        await expect(this.page.locator('h1')).toBeVisible();
    }

    async addToCart(): Promise<void> {
        // Look for the main Add to Cart button
        const btn = this.page
            .locator('.bg-blue-600 button, button:has-text("Carrito"), button:has-text("Añadir")')
            .first();
        await btn.waitFor({ state: 'attached', timeout: 5000 });
        await btn.click({ force: true });

        // Wait for pending state to finish (button should no longer say "Añadiendo")
        await expect(btn).not.toHaveText(/Añadiendo/i, { timeout: 10000 });
        await expect(btn).toBeEnabled({ timeout: 10000 });
    }

    async openMiniCart(): Promise<void> {
        // If already visible, don't click again to avoid toggling it closed
        const isVisible = await this.page.locator('[data-testid="mini-cart"]').isVisible();
        if (isVisible) return;

        const trigger = this.page
            .locator(
                '[data-testid="cart-trigger"], button:has-text("🛒"), a[href="/cart"], .relative button'
            )
            .first();
        await trigger.click({ force: true });
        await this.page.waitForTimeout(500);
    }

    async waitForCart(): Promise<void> {
        // Wait for anything that looks like the cart drawer content
        // data-testid="mini-cart" is the primary one, verified by subagent
        await this.page
            .locator('[data-testid="mini-cart"]')
            .first()
            .waitFor({ state: 'visible', timeout: 10000 });
    }
}
