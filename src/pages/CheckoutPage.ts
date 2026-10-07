import { expect, type Page } from '@playwright/test';
import { CustomerForm } from '../components/CustomerForm';
import { OrderSummary } from '../components/OrderSummary';
import { BasePage } from './BasePage';
import type { Navigable } from './Navigable';

export class CheckoutPage extends BasePage implements Navigable {
  readonly customerForm: CustomerForm;
  readonly summary: OrderSummary;
  readonly cartItems = this.page.locator('#box-checkout-cart li.item');
  readonly emptyCartMessage = this.page.locator('#checkout-cart-wrapper em');
  private readonly itemShortcuts = this.page.locator('#box-checkout-cart li.shortcut a');
  private readonly removeButtons = this.page.locator('#box-checkout-cart button[name="remove_cart_item"]');

  constructor(page: Page) {
    super(page);
    this.customerForm = new CustomerForm(page.locator('form[name="customer_form"]'));
    this.summary = new OrderSummary(page.locator('#box-checkout-summary'));
  }

  async open(): Promise<void> {
    await this.navigate('/en/checkout');
  }

  /** Removes every item, whatever was left in the cart before. */
  async clearCart(): Promise<void> {
    let remaining = await this.cartItems.count();
    while (remaining > 0) {
      // Several items are shown as an auto-rotating carousel; choosing a shortcut stops it on the first item.
      if (remaining > 1) {
        await this.itemShortcuts.first().click();
      }
      await this.removeButtons.first().click();
      remaining -= 1;
      await expect(this.cartItems).toHaveCount(remaining);
    }
  }

  async confirmOrder(): Promise<void> {
    await this.summary.confirmButton.click();
  }
}
