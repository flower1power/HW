import { test } from '../support/fixtures/pages.fixture';
import { Role } from '../support/data/role';

test.describe('Admin', () => {
  test('searches a random system user by employee name from the table', async ({ admin }) => {
    await admin.loginPage.login_as(Role.ADMIN);
    await admin.adminUsersPage.open();

    const employeeName = await admin.adminUsersPage.searchByRandomEmployeeNameFromTable();

    await admin.adminUsersPage.expectSearchResultsContainOnlyEmployeeName(employeeName);
  });
});
