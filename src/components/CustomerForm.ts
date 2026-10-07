import { BaseComponent } from './BaseComponent';

/** "Customer Details" form on the checkout page (billing address part). */
export class CustomerForm extends BaseComponent {
  /** Everything the customer types in: name, address, e-mail, phone. The country select has a default value. */
  readonly fields = this.root.locator('.billing-address input:not([type="hidden"])');
}
