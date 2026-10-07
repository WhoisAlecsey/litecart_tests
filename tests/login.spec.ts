import { Messages } from '../src/data/messages';
import { expect, test } from '../src/fixtures';

test('TC4 — Невалидный логин', { tag: '@auth' }, async ({ page, homePage, rejectedCustomer }) => {
  await test.step('Шаг 1. Логин с некорректным паролем', async () => {
    await homePage.open();
    await homePage.loginForm.login(rejectedCustomer);

    await expect(page).toHaveURL(/\/login$/);
    await expect(homePage.accountBox.logoutLink).toBeHidden();
    await expect(homePage.notices.success).toBeHidden();
  });

  await test.step('Шаг 2. Сообщение об ошибке выделено красным', async () => {
    await expect(homePage.notices.error).toHaveText(Messages.loginRejected);

    const highlight = await homePage.notices.errorHighlight();
    expect(highlight.isRed(), `Сообщение выделено красным, фактический цвет: ${highlight}`).toBe(true);
  });
});
