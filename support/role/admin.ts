import { type Page } from '@playwright/test';
import { AdminUsersPage } from '../pages/admin-users.page';
import { BuzzPage } from '../pages/buzz.page';
import { DashboardPage } from '../pages/dashboard.page';
import { DirectoryPage } from '../pages/directory.page';
import { LoginPage } from '../pages/login.page';

export class AdminRole {
  readonly adminUsersPage: AdminUsersPage;
  readonly buzzPage: BuzzPage;
  readonly dashboardPage: DashboardPage;
  readonly directoryPage: DirectoryPage;
  readonly loginPage: LoginPage;

  constructor(page: Page) {
    this.adminUsersPage = new AdminUsersPage(page);
    this.buzzPage = new BuzzPage(page);
    this.dashboardPage = new DashboardPage(page);
    this.directoryPage = new DirectoryPage(page);
    this.loginPage = new LoginPage(page);
  }
}
