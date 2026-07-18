import { type Page } from '@playwright/test';
import { AdminUsersPage } from '../pages/admin-users.page';
import { LoginPage } from '../pages/login.page';

export class AdminRole {
  readonly adminUsersPage: AdminUsersPage;
  readonly loginPage: LoginPage;

  constructor(page: Page) {
    this.adminUsersPage = new AdminUsersPage(page);
    this.loginPage = new LoginPage(page);
  }
}
