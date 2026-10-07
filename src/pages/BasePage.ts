import type { Page } from '@playwright/test';
import { CartWidget } from '../components/CartWidget';
import { NoticeBar } from '../components/NoticeBar';

/** Common part of every store page: the header cart and the notices. */
export abstract class BasePage {
  private static readonly LOAD_ATTEMPTS = 3;
  private static readonly LOAD_TIMEOUT = 20_000;

  readonly cart: CartWidget;
  readonly notices: NoticeBar;

  constructor(protected readonly page: Page) {
    this.cart = new CartWidget(page.locator('#cart'));
    this.notices = new NoticeBar(page.locator('#notices'));
  }

  /**
   * Opens an address of the store. The stand sometimes never finishes sending one of the scripts
   * and the page stays half-loaded, so it is requested again instead of waiting for the full timeout.
   */
  protected async navigate(path: string): Promise<void> {
    for (let attempt = 1; ; attempt++) {
      try {
        await this.page.goto(path, { waitUntil: 'domcontentloaded', timeout: BasePage.LOAD_TIMEOUT });
        return;
      } catch (error) {
        if (attempt === BasePage.LOAD_ATTEMPTS) {
          throw error;
        }
      }
    }
  }
}
