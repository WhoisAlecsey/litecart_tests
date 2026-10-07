import { Money } from '../models/Money';
import { OrderLine } from '../models/OrderLine';
import { BaseComponent } from './BaseComponent';

/** "Order Summary" table on the checkout page. */
export class OrderSummary extends BaseComponent {
  /** Only the rows that describe a product: the table also has header, spacer and total rows. */
  private readonly productRows = this.root.locator(
    'xpath=.//table[contains(@class, "dataTable")]//tr[td[@class="item"]]',
  );
  readonly paymentDue = this.root.locator('xpath=.//tr[@class="footer"]/td[last()]');
  readonly confirmButton = this.root.locator('button[name="confirm_order"]');

  async lines(): Promise<OrderLine[]> {
    const rows = await this.productRows.evaluateAll((items) =>
      items.map((row) => Array.from(row.children, (cell) => cell.textContent?.trim() ?? '')),
    );
    // Columns: Quantity | Product | SKU | Unit Cost | Incl. Tax | Total
    return rows.map(
      ([quantity, name, , unitCost, , total]) =>
        new OrderLine(name, Number(quantity), Money.parse(unitCost), Money.parse(total)),
    );
  }

  async total(): Promise<Money> {
    return Money.parse(await this.paymentDue.innerText());
  }
}
