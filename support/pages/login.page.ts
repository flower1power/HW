import { type Page, expect } from '@playwright/test';
import { Button } from '../components/button';
import { Input } from '../components/input';
import { Credential } from '../data/credential';
import { Links } from '../data/links';
import { Messages } from '../data/messages';
import { Role } from '../data/role';
import { UiSelectors } from '../data/ui';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  protected readonly url = Links.LOGIN_PAGE;

  constructor(page: Page) {
    super(page);
  }

  //Тут по желанию - я предпочитаю ленивые компоненты
  private get usernameField(): Input {
    return new Input(this.page.locator(UiSelectors.LOGIN.USERNAME_FIELD));
  }

  private get passwordField(): Input {
    return new Input(this.page.locator(UiSelectors.LOGIN.PASSWORD_FIELD));
  }

  private get loginButton(): Button {
    return new Button(this.page.locator(UiSelectors.LOGIN.LOGIN_BUTTON));
  }

  async login(username: string, password: string): Promise<void> {
    await this.open();
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();

    await expect(this.page).toHaveURL(new RegExp(`${Links.DASHBOARD_PATH}$`));
  }

  async login_as(role: Role): Promise<void> {
    switch (role) {
      case Role.ADMIN:
        await this.login(Credential.ADMIN_USERNAME, Credential.ADMIN_PASSWORD);
        break;
      default:
        throw new Error(Messages.AUTH.UNSUPPORTED_ROLE(role));
    }
  }
}
