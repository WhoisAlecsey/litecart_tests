import { BaseComponent } from './BaseComponent';

/** Cart summary in the page header. */
export class CartWidget extends BaseComponent {
  readonly quantity = this.root.locator('span.quantity');
  readonly total = this.root.locator('span.formatted_value');
  private readonly checkoutLink = this.root.locator('a.link');

  async openCheckout(): Promise<void> {
    await this.checkoutLink.click();
  }
}
