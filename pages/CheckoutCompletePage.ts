import { type Locator, type Page } from "@playwright/test"; 

export class CheckoutCompletePage {
    readonly page: Page;
    readonly thanksyouTitle: Locator;

    constructor(page: Page){
        this.page = page;
        this.thanksyouTitle = page.getByTestId('back-to-products')
    }
}
    