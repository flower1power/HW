import { expect, test } from '../support/fixtures/pages.fixture';
import { Messages } from '../support/data/messages';
import { Role } from '../support/data/role';
import { Timeouts } from '../support/data/timeouts';
import { UiExpectedCounts } from '../support/data/ui';

test.describe('Dashboard', () => {
  test('displays seven columns in the Time at Work weekly chart', async ({ admin }) => {
    const [apiColumnCount] = await Promise.all([
      admin.dashboardPage.waitForWeeklyAttendanceColumnCount(),
      admin.loginPage.login_as(Role.ADMIN),
    ]);

    await expect(admin.dashboardPage.weeklyAttendanceChart).toBeVisible();

    const expectedColumnCount = UiExpectedCounts.DASHBOARD.TIME_AT_WORK_CHART_COLUMNS;
    await expect
      .poll(() => admin.dashboardPage.getRenderedWeeklyAttendanceColumnCount(), {
        message: Messages.DASHBOARD.WEEKLY_CHART_COLUMN_COUNT_MISMATCH(expectedColumnCount),
        timeout: Timeouts.DEFAULT,
      })
      .toBe(expectedColumnCount);

    expect(apiColumnCount).toBe(expectedColumnCount);
  });
});
