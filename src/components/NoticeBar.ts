import { Color } from '../models/Color';
import { BaseComponent } from './BaseComponent';

/** Messages the store shows at the top of the page after an action. */
export class NoticeBar extends BaseComponent {
  readonly success = this.root.locator('.notice.success');
  readonly error = this.root.locator('.notice.errors');

  /** The colour the error message is highlighted with. */
  async errorHighlight(): Promise<Color> {
    const background = await this.error.evaluate((notice) => getComputedStyle(notice).backgroundColor);
    return Color.parse(background);
  }
}
