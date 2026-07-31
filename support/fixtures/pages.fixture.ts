import { type BrowserContext, test as base } from '@playwright/test';
import { HackerNewsNewestPage } from '../pages/hacker-news-newest.page';
import { LoginPage } from '../pages/login.page';
import { Role } from '../data/role';
import { AdminRole } from '../role/admin';
import { UserRole } from '../role/user';

type PagesFixture = {
  admin: AdminRole;
  hackerNewsNewestPage: HackerNewsNewestPage;
  user: UserRole;
};

type AuthenticatedAdminWorkerFixture = {
  adminStorageState: Awaited<ReturnType<BrowserContext['storageState']>>;
};

export const test = base.extend<PagesFixture>({
  admin: async ({ page }, use) => {
    await use(new AdminRole(page));
  },
  hackerNewsNewestPage: async ({ page }, use) => {
    await use(new HackerNewsNewestPage(page));
  },
  user: async ({ page }, use) => {
    await use(new UserRole(page));
  },
});

export const authenticatedAdminTest = test.extend<object, AuthenticatedAdminWorkerFixture>({
  adminStorageState: [
    async ({ browser }, use) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      const loginPage = new LoginPage(page);

      await loginPage.login_as(Role.ADMIN);
      const storageState = await context.storageState();
      await context.close();

      await use(storageState);
    },
    { scope: 'worker' },
  ],
  storageState: async ({ adminStorageState }, use) => {
    await use(adminStorageState);
  },
});

export { expect } from '@playwright/test';
