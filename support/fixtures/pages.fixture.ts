import { test as base } from '@playwright/test';
import { AdminRole } from '../role/admin';
import { UserRole } from '../role/user';

type PagesFixture = {
  admin: AdminRole;
  user: UserRole;
};

export const test = base.extend<PagesFixture>({
  admin: async ({ page }, use) => {
    await use(new AdminRole(page));
  },
  user: async ({ page }, use) => {
    await use(new UserRole(page));
  },
});

export { expect } from '@playwright/test';
