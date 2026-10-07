import { test as base } from '@playwright/test';
import { registeredCustomer, rejectedCustomer } from '../data/customers';
import type { Credentials } from '../models/Credentials';
import { CheckoutPage } from '../pages/CheckoutPage';
import { HomePage } from '../pages/HomePage';
import { OrderSuccessPage } from '../pages/OrderSuccessPage';
import { ProductPage } from '../pages/ProductPage';

interface Fixtures {
  homePage: HomePage;
  productPage: ProductPage;
  checkoutPage: CheckoutPage;
  orderSuccessPage: OrderSuccessPage;
  customer: Credentials;
  rejectedCustomer: Credentials;
}

/** Tests receive ready page objects and test data instead of creating them. */
export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  orderSuccessPage: async ({ page }, use) => use(new OrderSuccessPage(page)),
  customer: async ({}, use) => use(registeredCustomer()),
  rejectedCustomer: async ({}, use) => use(rejectedCustomer()),
});

export { expect } from '@playwright/test';
