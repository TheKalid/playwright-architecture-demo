import { type Locator, type Page } from "@playwright/test";
export class Header {
    readonly page: Page;
    readonly shoppingCartButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.shoppingCartButton = page.getByTestId('shopping-cart-link')
    }

    async openCart() {
        await this.shoppingCartButton.click();
    }
}