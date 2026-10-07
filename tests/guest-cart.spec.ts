import { ProductFilters } from '../src/data/productFilters';
import { expect, test } from '../src/fixtures';
import { Money } from '../src/models/Money';
import type { OrderLine } from '../src/models/OrderLine';
import type { Product } from '../src/models/Product';

test('TC3 — Заказ товара без логина', { tag: '@guest' }, async ({ homePage, productPage, checkoutPage }) => {
  const products: Product[] = [];
  const expectedLines: OrderLine[] = [];

  await test.step('Предусловие: корзина пустая', async () => {
    await homePage.open();

    await expect(homePage.cart.quantity).toHaveText('0');
  });

  await test.step('Шаг 1. Выбираем два разных товара и добавляем в корзину', async () => {
    products.push(...(await homePage.latestProducts.findAll(ProductFilters.regular)).slice(0, 2));
    expect(products, 'На главной странице есть два разных товара').toHaveLength(2);

    for (const product of products) {
      await homePage.open();
      await homePage.latestProducts.open(product);
      expectedLines.push(await productPage.addToCart(1));
    }

    await expect(productPage.cart.quantity).toHaveText(String(products.length));
  });

  await test.step('Шаг 2. Переходим в корзину', async () => {
    await productPage.cart.openCheckout();

    // The store does not keep the order in which the products were added.
    await expect.poll(() => checkoutPage.summary.lines()).toHaveLength(expectedLines.length);
    expect(await checkoutPage.summary.lines()).toEqual(expect.arrayContaining(expectedLines));
    expect(await checkoutPage.summary.total()).toEqual(Money.sum(expectedLines.map((line) => line.total)));

    await expect(checkoutPage.customerForm.fields).not.toHaveCount(0);
    for (const field of await checkoutPage.customerForm.fields.all()) {
      await expect(field).toBeEmpty();
    }
  });

  await test.step('Шаг 3. Возвращаемся на домашнюю страницу', async () => {
    await homePage.open();

    await expect
      .poll(() => homePage.recentlyViewed.productIds(), 'Товары в блоке "Recently Viewed"')
      .toEqual(expect.arrayContaining(products.map((product) => product.id)));
  });
});
