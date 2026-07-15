import { type Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

export class UserRole {
  readonly loginPage: LoginPage;

  constructor(page: Page) {
    this.loginPage = new LoginPage(page);
  }
}
