import type { ProductFilter } from '../data/productFilters';
import { Money } from '../models/Money';
import { type Product, productIdFromUrl } from '../models/Product';
import { BaseComponent } from './BaseComponent';

/** A box with product cards: "Most Popular", "Campaigns", "Latest Products". */
export class ProductListing extends BaseComponent {
  private readonly cards = this.root.locator('li.product');

  async products(): Promise<Product[]> {
    await this.cards.first().waitFor();
    const cards = await this.cards.evaluateAll((items) =>
      items.map((card) => ({
        name: card.querySelector('.name')?.textContent ?? '',
        link: card.querySelector('a.link')?.getAttribute('href') ?? '',
        regularPrice: card.querySelector('.regular-price, .price')?.textContent ?? '',
        campaignPrice: card.querySelector('.campaign-price')?.textContent ?? null,
      })),
    );
    return cards.map((card) => {
      const regularPrice = Money.parse(card.regularPrice);
      return {
        id: productIdFromUrl(card.link),
        name: card.name.trim(),
        price: card.campaignPrice ? Money.parse(card.campaignPrice) : regularPrice,
        regularPrice,
        onSale: card.campaignPrice !== null,
      };
    });
  }

  async findAll(filter: ProductFilter): Promise<Product[]> {
    return (await this.products()).filter(filter);
  }

  async open(product: Product): Promise<void> {
    await this.card(product.name).locator('a.link').click();
  }

  private card(name: string) {
    return this.root.locator(
      `xpath=.//li[contains(@class, "product")][.//div[@class="name" and normalize-space()="${name}"]]`,
    );
  }
}
