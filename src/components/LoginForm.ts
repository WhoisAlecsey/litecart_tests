import type { Credentials } from '../models/Credentials';
import { BaseComponent } from './BaseComponent';

/** "Login" box in the left column. */
export class LoginForm extends BaseComponent {
  readonly emailInput = this.root.locator('input[name="email"]');
  readonly passwordInput = this.root.locator('input[name="password"]');
  readonly loginButton = this.root.locator('button[name="login"]');

  async login({ email, password }: Credentials): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
