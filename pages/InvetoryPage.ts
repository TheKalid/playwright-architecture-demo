import { type Locator, type Page } from "@playwright/test";

export class InventoryPage {
    readonly page: Page;
    readonly firstItem: Locator;


    constructor(page: Page) {
        this.page = page;
        this.firstItem = page.getByRole('button', {name: 'Add to cart'}).nth(0);
    }

    async addFirstItem() {
        await this.firstItem.click();
    }
}