import { BasePage } from './BasePage';

export class OrderSuccessPage extends BasePage {
  static readonly URL = /\/order_success$/;
  /** The link to the printable copy is the only place that shows the number of the new order. */
  private static readonly ORDER_ID = /[?&]order_id=(?<id>\d+)/;

  readonly title = this.page.locator('#box-order-success h1.title');
  private readonly printableCopyLink = this.page.locator(
    '#box-order-success a[href*="printable_order_copy"]',
  );

  async orderId(): Promise<number> {
    const link = (await this.printableCopyLink.getAttribute('href')) ?? '';
    const id = OrderSuccessPage.ORDER_ID.exec(link)?.groups?.id;
    if (!id) {
      throw new Error(`No order number in the printable copy link "${link}"`);
    }
    return Number(id);
  }
}
