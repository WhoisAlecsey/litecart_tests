import { BaseComponent } from './BaseComponent';

/** "Account" box that replaces the login form for a logged-in customer. */
export class AccountBox extends BaseComponent {
  readonly logoutLink = this.root.locator('xpath=.//a[contains(@href, "/logout")]');
}
