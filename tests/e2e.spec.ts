import { test, expect } from './fixtures';
import {
  SAUCE_DEMO_PASSWORD,
  SAUCE_DEMO_USERS,
  type SauceDemoUserKey,
} from '../utils/users';

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
});

test.describe('E2E Tests', () => {
  for (const key of Object.keys(SAUCE_DEMO_USERS) as SauceDemoUserKey[]) {
    const username = SAUCE_DEMO_USERS[key];
    test(`login with ${key} (${username})`, async ({ loginPage, page }) => {
      await loginPage.loginUser(username, SAUCE_DEMO_PASSWORD);
      if (key === 'lockedOut') {
        await expect(page.getByTestId('error')).toContainText(/locked out/i);
        await expect(page).not.toHaveURL(/inventory/);
      } else {
        await expect(page).toHaveURL(/inventory\.html/);
      }
    });
  }

  test('User can login with standard_user2', async ({ loginPage, header, page }) => {
    await loginPage.loginUser(SAUCE_DEMO_USERS.problem, SAUCE_DEMO_PASSWORD);
    await header.openCart();
    await expect(page).toHaveURL('/cart.html');
  });

  test('User is able to complete the main flow adding an item in the cart and finish checkout', async ({
    loginPage,
    header,
    inventoryPage,
    cartPage,
    checkoutYourPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    await loginPage.loginUser(SAUCE_DEMO_USERS.standard, SAUCE_DEMO_PASSWORD);
    await inventoryPage.addFirstItem();
    await header.openCart();
    await cartPage.clickCheckoutButton();
    await checkoutYourPage.fillYourInformationCheckout();
    await checkoutOverviewPage.clickFinishButtin();

    await expect(checkoutCompletePage.thanksyouTitle).toBeVisible();
  });
});
