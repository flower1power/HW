import { DirectoryData } from '../support/data/directory';
import { Timeouts } from '../support/data/timeouts';
import { authenticatedAdminTest as test, expect } from '../support/fixtures/pages.fixture';

test.describe('Directory', () => {
  test.describe.configure({ mode: 'serial', timeout: Timeouts.DIRECTORY_TEST });

  test('shows all employee cards when the API request limit is increased', async ({ admin }) => {
    await admin.directoryPage.overrideEmployeesApiLimit(DirectoryData.LARGE_EMPLOYEES_API_LIMIT);
    await admin.directoryPage.open();

    await admin.directoryPage.expectEmployeeCardCountMatchesRecordsCounter();
  });

  test('loads all employee cards while scrolling through the directory', async ({ admin }) => {
    await admin.directoryPage.open();

    await admin.directoryPage.loadAllEmployeeCardsByScrolling();
    await admin.directoryPage.expectEmployeeCardCountMatchesRecordsCounter();
  });

  test('shows one default API page of employee cards before any interaction', async ({ admin }) => {
    await admin.directoryPage.open();

    const recordsCount = await admin.directoryPage.getRecordsCount();
    const employeeCardCount = await admin.directoryPage.getEmployeeCardCount();

    expect(employeeCardCount).toEqual(Math.min(DirectoryData.DEFAULT_EMPLOYEES_API_LIMIT, recordsCount));
  });
});
