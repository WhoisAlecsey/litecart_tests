import { Money } from './Money';
import type { Product } from './Product';

/** One row of the cart / order summary. */
export class OrderLine {
  constructor(
    readonly name: string,
    readonly quantity: number,
    readonly unitPrice: Money,
    readonly total: Money,
  ) {}

  /** The row the cart is expected to show after `quantity` pieces of `product` were added. */
  static of(product: Product, quantity: number, optionsSurcharge = Money.zero()): OrderLine {
    const unitPrice = product.price.add(optionsSurcharge);
    return new OrderLine(product.name, quantity, unitPrice, unitPrice.multiply(quantity));
  }
}
