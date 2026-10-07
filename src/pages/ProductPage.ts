import { expect } from '@playwright/test';
import { Money } from '../models/Money';
import { OrderLine } from '../models/OrderLine';
import { type Product, productIdFromUrl } from '../models/Product';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  /** An option that changes the price is labelled like "Medium +$2.50". */
  private static readonly SURCHARGE = /\+\s*(?<amount>\S+)$/;

  private readonly details = this.page.locator('#box-product');
  readonly title = this.details.locator('h1.title');
  private readonly priceWrapper = this.details.locator('.information .price-wrapper');
  private readonly buyForm = this.details.locator('form[name="buy_now_form"]');
  private readonly requiredOptions = this.buyForm.locator('select[required]');
  private readonly quantityInput = this.buyForm.locator('input[name="quantity"]');
  private readonly addToCartButton = this.buyForm.locator('button[name="add_cart_product"]');

  async product(): Promise<Product> {
    const name = (await this.title.innerText()).trim();
    const regularPrice = Money.parse(await this.priceWrapper.locator('.regular-price, .price').innerText());
    const campaignPrice = this.priceWrapper.locator('.campaign-price');
    const onSale = (await campaignPrice.count()) > 0;
    return {
      id: productIdFromUrl(this.page.url()),
      name,
      price: onSale ? Money.parse(await campaignPrice.innerText()) : regularPrice,
      regularPrice,
      onSale,
    };
  }

  /** Adds the opened product to the cart and returns the row the cart is expected to show for it. */
  async addToCart(quantity: number): Promise<OrderLine> {
    const product = await this.product();
    const surcharge = await this.chooseRequiredOptions();
    const inCartBefore = Number(await this.cart.quantity.innerText());
    await this.quantityInput.fill(String(quantity));
    await this.addToCartButton.click();
    // The store adds the product in the background, so wait until the header cart shows the new amount.
    await expect(this.cart.quantity).toHaveText(String(inCartBefore + quantity));
    return OrderLine.of(product, quantity, surcharge);
  }

  /** Some products cannot be bought until a size is chosen. Returns what the chosen options add to the price. */
  private async chooseRequiredOptions(): Promise<Money> {
    let surcharge = Money.zero();
    for (const select of await this.requiredOptions.all()) {
      await select.selectOption({ index: 1 }); // index 0 is the "-- Select --" placeholder
      const label = (await select.locator('option:checked').textContent()) ?? '';
      const amount = ProductPage.SURCHARGE.exec(label.trim())?.groups?.amount;
      if (amount) {
        surcharge = surcharge.add(Money.parse(amount));
      }
    }
    return surcharge;
  }
}
