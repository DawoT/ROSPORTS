import { BasePage } from './base.page';
import { Page, Locator } from '@playwright/test';

export class HomePage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async goto(): Promise<void> {
        await this.navigate('/');
    }

    async getProductCard(partialName: string): Promise<Locator> {
        return this.page.getByTestId('product-card').filter({ hasText: partialName }).first();
    }

    async clickProduct(partialName: string): Promise<void> {
        const card = await this.getProductCard(partialName);
        await card.getByRole('link').first().click();
    }
}
