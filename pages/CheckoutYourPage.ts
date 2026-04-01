import { type Locator, type Page } from "@playwright/test";

export class CheckoutYourPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    readonly cancelButton: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.getByTestId('firstName');
        this.lastNameInput = page.getByTestId('lastName');
        this.postalCodeInput = page.getByTestId('postalCode');
        this.continueButton = page.getByTestId('continue');
        this.cancelButton = page.getByTestId('cancel');
    }

    async fillYourInformationCheckout(){
        await this.firstNameInput.fill('Test Name');
        await this.lastNameInput.fill('Test Last');
        await this.postalCodeInput.fill('3523');
        await this.continueButton.click();
    }
}

