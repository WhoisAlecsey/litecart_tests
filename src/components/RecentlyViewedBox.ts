import { productIdFromUrl } from '../models/Product';
import { BaseComponent } from './BaseComponent';

/** "Recently Viewed" box: product thumbnails without names, so products are told apart by their links. */
export class RecentlyViewedBox extends BaseComponent {
  private readonly links = this.root.locator('ul.list-horizontal > li > a');

  async productIds(): Promise<number[]> {
    const links = await this.links.evaluateAll((items) =>
      items.map((link) => link.getAttribute('href') ?? ''),
    );
    return links.map(productIdFromUrl);
  }
}
