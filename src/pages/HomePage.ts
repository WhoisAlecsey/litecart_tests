import type { Page } from '@playwright/test';
import { AccountBox } from '../components/AccountBox';
import { LoginForm } from '../components/LoginForm';
import { ProductListing } from '../components/ProductListing';
import { RecentlyViewedBox } from '../components/RecentlyViewedBox';
import { BasePage } from './BasePage';
import type { Navigable } from './Navigable';

export class HomePage extends BasePage implements Navigable {
  readonly loginForm: LoginForm;
  readonly accountBox: AccountBox;
  readonly mostPopular: ProductListing;
  readonly campaigns: ProductListing;
  readonly latestProducts: ProductListing;
  readonly recentlyViewed: RecentlyViewedBox;

  constructor(page: Page) {
    super(page);
    this.loginForm = new LoginForm(page.locator('#box-account-login'));
    this.accountBox = new AccountBox(page.locator('#box-account'));
    this.mostPopular = new ProductListing(page.locator('#box-most-popular'));
    this.campaigns = new ProductListing(page.locator('#box-campaigns'));
    this.latestProducts = new ProductListing(page.locator('#box-latest-products'));
    this.recentlyViewed = new RecentlyViewedBox(page.locator('#box-recently-viewed-products'));
  }

  async open(): Promise<void> {
    await this.navigate('/en/');
  }
}
