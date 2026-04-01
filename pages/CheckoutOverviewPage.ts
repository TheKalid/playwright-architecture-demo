import { type Locator, type Page } from "@playwright/test"; 

export class CheckoutOverviewPage {
    readonly page: Page;
    readonly finishButton: Locator;

    constructor(page: Page){
        this.page = page;
        this.finishButton = page.getByTestId('finish');
    }

    async clickFinishButtin(){
        await this.finishButton.click();
    }
}
    