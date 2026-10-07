import type { Product } from '../models/Product';

/** Strategy for choosing a product from a listing. */
export type ProductFilter = (product: Product) => boolean;

export const ProductFilters = {
  /** Sold at its regular price. Free products are skipped: the stand has some with a $0 price. */
  regular: (product) => !product.onSale && product.price.isPositive(),
  /** Has a campaign price lower than the regular one. */
  discounted: (product) => product.onSale && product.price.isPositive(),
} satisfies Record<string, ProductFilter>;
