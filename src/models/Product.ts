import { Money } from './Money';

export interface Product {
  id: number;
  name: string;
  price: Money;
  regularPrice: Money;
  onSale: boolean;
}

/** Product links look like ".../rubber-ducks-c-1/green-duck-p-2". */
const PRODUCT_ID_PATTERN = /-p-(?<id>\d+)(?:[/?#]|$)/;

export function productIdFromUrl(url: string): number {
  const id = PRODUCT_ID_PATTERN.exec(url)?.groups?.id;
  if (!id) {
    throw new Error(`"${url}" is not a product link`);
  }
  return Number(id);
}
