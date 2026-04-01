import { type Locator, type Page } from "@playwright/test";

export class Footer {
    readonly page: Page;
    readonly footerRoot: Locator;
    readonly socialTwitter: Locator;
    readonly socialFacebook: Locator;
    readonly socialLinkedin: Locator;
    readonly footerCopy: Locator;

    constructor(page: Page) {
        this.page = page;
        this.footerRoot = page.getByTestId('footer')
        this.socialTwitter = page.getByTestId('social-twitter')
        this.socialFacebook = page.getByTestId('social-facebook')
        this.socialLinkedin = page.getByTestId('social-linkedin')
        this.footerCopy = page.getByTestId('footer-copy')
    }

    async openTwitter() {
        await this.socialTwitter.click();
    }

    async openFacebook() {
        await this.socialFacebook.click();
    }

    async openLinkedin() {
        await this.socialLinkedin.click();
    }
}
