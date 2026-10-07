import { Messages } from '../src/data/messages';
import { type ProductFilter, ProductFilters } from '../src/data/productFilters';
import { expect, test } from '../src/fixtures';
import { OrderSuccessPage } from '../src/pages/OrderSuccessPage';

interface OrderScenario {
  title: string;
  productKind: string;
  filter: ProductFilter;
  discounted: boolean;
  quantity: number;
}

const scenarios: OrderScenario[] = [
  {
    title: 'TC1 — Заказ одного товара без скидки',
    productKind: 'без скидки',
    filter: ProductFilters.regular,
    discounted: false,
    quantity: 3,
  },
  {
    title: 'TC2 — Заказ одного товара со скидкой',
    productKind: 'со скидкой',
    filter: ProductFilters.discounted,
    discounted: true,
    quantity: 2,
  },
];

for (const scenario of scenarios) {
  test(
    scenario.title,
    { tag: '@order' },
    async ({ page, homePage, productPage, checkoutPage, orderSuccessPage, customer }) => {
      await test.step('Шаг 1. Логин с тестовой учеткой', async () => {
        await homePage.open();
        await homePage.loginForm.login(customer);

        await expect(homePage.notices.success).toHaveText(Messages.loggedIn);
        await expect(homePage.accountBox.logoutLink).toBeVisible();
      });

      // Done after the login: the store keeps the cart of an account between sessions.
      await test.step('Предусловие: корзина пустая', async () => {
        await checkoutPage.open();
        await checkoutPage.clearCart();

        await expect(checkoutPage.emptyCartMessage).toBeVisible();
      });

      await test.step(`Шаг 2. Выбираем один товар ${scenario.productKind}`, async () => {
        await homePage.open();
        const [product] = await homePage.latestProducts.findAll(scenario.filter);
        expect(product, `На главной странице есть товар ${scenario.productKind}`).toBeDefined();
        await homePage.latestProducts.open(product);

        await expect(productPage.title).toHaveText(product.name);
        const opened = await productPage.product();
        expect(opened.price.isLessThan(opened.regularPrice), 'Цена товара ниже обычной').toBe(
          scenario.discounted,
        );
      });

      const expectedLine =
        await test.step(`Шаг 3. Добавляем в корзину ${scenario.quantity} шт. товара`, async () => {
          const line = await productPage.addToCart(scenario.quantity);

          await expect(productPage.cart.quantity).toHaveText(String(scenario.quantity));
          return line;
        });

      await test.step('Шаг 4. Переходим в корзину', async () => {
        await productPage.cart.openCheckout();

        await expect(checkoutPage.cartItems).toHaveCount(1);
        await expect.poll(() => checkoutPage.summary.lines()).toEqual([expectedLine]);
        expect(await checkoutPage.summary.total()).toEqual(expectedLine.total);
      });

      await test.step('Шаг 5. Подтверждаем заказ', async () => {
        await checkoutPage.confirmOrder();

        await expect(page).toHaveURL(OrderSuccessPage.URL);
        await expect(orderSuccessPage.title).toHaveText(Messages.orderCompleted);
        expect(await orderSuccessPage.orderId()).toBeGreaterThan(0);
      });
    },
  );
}
