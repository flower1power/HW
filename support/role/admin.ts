import { type Page } from '@playwright/test';
import { AdminUsersPage } from '../pages/admin-users.page';
import { BuzzPage } from '../pages/buzz.page';
import { DirectoryPage } from '../pages/directory.page';
import { LoginPage } from '../pages/login.page';

export class AdminRole {
  readonly adminUsersPage: AdminUsersPage;
  readonly buzzPage: BuzzPage;
  readonly directoryPage: DirectoryPage;
  readonly loginPage: LoginPage;

  constructor(page: Page) {
    this.adminUsersPage = new AdminUsersPage(page);
    this.buzzPage = new BuzzPage(page);
    this.directoryPage = new DirectoryPage(page);
    this.loginPage = new LoginPage(page);
  }
}
