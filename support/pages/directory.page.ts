import { type Locator, type Page, expect } from '@playwright/test';
import { LoadingSpinner } from '../components/loading-spinner';
import { Links } from '../data/links';
import { Messages } from '../data/messages';
import { Timeouts } from '../data/timeouts';
import { HttpMethod, UiSelectors, UiText } from '../data/ui';
import { BasePage } from './base.page';

export class DirectoryPage extends BasePage {
  protected readonly url = Links.DIRECTORY_PAGE;

  constructor(page: Page) {
    super(page);
  }

  private get employeeCards(): Locator {
    return this.page.locator(UiSelectors.DIRECTORY.EMPLOYEE_CARDS);
  }

  private get recordsCounter(): Locator {
    return this.page.getByText(UiText.DIRECTORY.RECORDS_COUNTER_PATTERN).first();
  }

  private get loadingSpinner(): LoadingSpinner {
    return new LoadingSpinner(this.page.locator(UiSelectors.DIRECTORY.LOADING_SPINNER));
  }

  override async open(): Promise<void> {
    await expect(async () => {
      await super.open();
      await this.loadingSpinner.waitForHidden(Timeouts.DIRECTORY_LOAD_ATTEMPT);
      await expect(this.recordsCounter).toBeVisible({ timeout: Timeouts.DIRECTORY_LOAD_ATTEMPT });
    }).toPass({
      intervals: [1_000, 2_000],
      timeout: Timeouts.DIRECTORY_PAGE,
    });
  }

  async overrideEmployeesApiLimit(limit: number): Promise<void> {
    await this.page.route(`**${Links.DIRECTORY_EMPLOYEES_API_PATH}**`, async (route) => {
      if (route.request().method() !== HttpMethod.GET) {
        await route.continue();
        return;
      }

      const requestUrl = new URL(route.request().url());
      requestUrl.searchParams.set('limit', String(limit));

      await route.continue({ url: requestUrl.toString() });
    });
  }

  async loadAllEmployeeCardsByScrolling(): Promise<void> {
    const recordsCount = await this.getRecordsCount();

    while ((await this.employeeCards.count()) < recordsCount) {
      const currentCardCount = await this.employeeCards.count();
      await this.employeeCards.last().scrollIntoViewIfNeeded();

      await expect
        .poll(() => this.employeeCards.count(), {
          message: Messages.DIRECTORY.EMPLOYEE_CARDS_DID_NOT_LOAD(currentCardCount),
          timeout: Timeouts.DIRECTORY_LOAD_ATTEMPT,
        })
        .toBeGreaterThan(currentCardCount);
    }
  }

  async getEmployeeCardCount(): Promise<number> {
    return this.employeeCards.count();
  }

  async getRecordsCount(): Promise<number> {
    const counterText = (await this.recordsCounter.innerText()).trim();

    return this.parseRecordsCount(counterText);
  }

  async expectEmployeeCardCountMatchesRecordsCounter(): Promise<void> {
    const recordsCount = await this.getRecordsCount();

    await expect(this.employeeCards, Messages.DIRECTORY.EMPLOYEE_CARDS_COUNT_MISMATCH(recordsCount)).toHaveCount(recordsCount, {
      timeout: Timeouts.TABLE,
    });
  }

  private parseRecordsCount(counterText: string): number {
    const match = counterText.match(/^\((\d+)\)/);
    if (!match?.[1]) {
      throw new Error(Messages.DIRECTORY.INVALID_RECORDS_COUNTER(counterText));
    }

    return Number(match[1]);
  }
}
