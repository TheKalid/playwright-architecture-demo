import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { Header } from '../../pages/components/Header';
import { InventoryPage } from '../../pages/InvetoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutYourPage } from '../../pages/CheckoutYourPage';
import { CheckoutOverviewPage } from '../../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../../pages/CheckoutCompletePage';

type PagesFixtures = {
  loginPage: LoginPage;
  header: Header;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutYourPage: CheckoutYourPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
};

export const test = base.extend<PagesFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  header: async ({ page }, use) => {
    await use(new Header(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutYourPage: async ({ page }, use) => {
    await use(new CheckoutYourPage(page));
  },
  checkoutOverviewPage: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page));
  },
  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },
});

export { expect };
