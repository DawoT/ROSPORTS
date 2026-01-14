import { BasePage } from './base.page';
import { Page, expect } from '@playwright/test';

export class CheckoutPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async goto(): Promise<void> {
        await this.navigate('/checkout');
    }

    async expectLoaded(): Promise<void> {
        await this.page.waitForURL(/.*\/checkout/);
        await this.page.waitForLoadState('networkidle');
        await expect(this.page.locator('h1, main')).toContainText(/Checkout|Pedido|Resumen/i, {
            timeout: 10000,
        });
        // Settle wait for hydration
        await this.page.waitForTimeout(1000);
    }

    async fillCustomerInfo(info: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
    }): Promise<void> {
        // Playwright fill() auto-waits and retries if element detaches during hydration
        await this.page.fill('#firstName', info.firstName);
        await this.page.fill('#lastName', info.lastName);
        await this.page.fill('#email', info.email);
        await this.page.fill('#phone', info.phone);
        await this.page.fill('#address', info.address);
        await this.page.fill('#city', info.city);
    }

    async submitOrder(): Promise<void> {
        await this.page
            .getByRole('button', { name: /confirmar compra/i })
            .first()
            .click();
    }

    async expectSuccess(): Promise<void> {
        // Expect redirect to /success?orderId=...
        await expect(this.page).toHaveURL(/.*\/success/);
        await expect(this.page.locator('h1')).toContainText('Gracias');
    }

    async expectFieldError(field: string, message: string | RegExp): Promise<void> {
        // const errorLocator = this.page.locator(`label[for="${field}"] + input + p.text-red-500, label[for="${field}"] + input + div + p.text-red-500`);
        // Simpler: find the text near the field
        await expect(this.page.locator('p.text-red-500')).toContainText(message);
    }

    async expectGeneralError(message: string | RegExp): Promise<void> {
        await expect(this.page.locator('.bg-red-50')).toContainText(message);
    }
}
