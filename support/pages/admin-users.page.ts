import { type Page, expect } from '@playwright/test';
import { Autocomplete } from '../components/autocomplete';
import { Button } from '../components/button';
import { Input } from '../components/input';
import { LoadingSpinner } from '../components/loading-spinner';
import { Table } from '../components/table';
import { TextElement } from '../components/text';
import { Links } from '../data/links';
import { Messages } from '../data/messages';
import { Timeouts } from '../data/timeouts';
import { HttpMethod, UiKeys, UiSelectors, UiTableColumns, UiText } from '../data/ui';
import { BasePage } from './base.page';

export class AdminUsersPage extends BasePage {
  protected readonly url = Links.ADMIN_USERS_PAGE;

  constructor(page: Page) {
    super(page);
  }

  private get employeeNameInput(): Input {
    return new Input(this.page.locator(UiSelectors.ADMIN_USERS.EMPLOYEE_NAME_FIELD));
  }

  private get employeeNameAutocomplete(): Autocomplete {
    return new Autocomplete(this.employeeNameInput, this.page.locator(UiSelectors.ADMIN_USERS.EMPLOYEE_NAME_OPTIONS_LIST), {
      closeKey: UiKeys.ESCAPE,
      loadingOptionText: UiText.ADMIN_USERS.SEARCHING_OPTION_PATTERN,
      optionSelector: UiSelectors.ADMIN_USERS.EMPLOYEE_NAME_OPTION,
      timeout: Timeouts.AUTOCOMPLETE,
    });
  }

  private get searchButton(): Button {
    return new Button(this.page.locator(UiSelectors.ADMIN_USERS.SEARCH_BUTTON));
  }

  private get usersTable(): Table {
    return new Table(this.page.locator(UiSelectors.ADMIN_USERS.TABLE_ROWS), UiSelectors.ADMIN_USERS.TABLE_CELL);
  }

  private get recordsCounter(): TextElement {
    return new TextElement(
      this.page.locator(UiSelectors.ADMIN_USERS.RECORDS_COUNTER_CONTAINER).getByText(UiText.ADMIN_USERS.RECORDS_COUNTER_PATTERN),
    );
  }

  private get loadingSpinner(): LoadingSpinner {
    return new LoadingSpinner(this.page.locator(UiSelectors.ADMIN_USERS.LOADING_SPINNER));
  }

  override async open(): Promise<void> {
    await super.open();
    await this.waitForUsersTable();
  }

  async searchByRandomEmployeeNameFromTable(): Promise<string> {
    const employeeNames = [...new Set(await this.getEmployeeNames())];
    expect(employeeNames.length, Messages.ADMIN_USERS.NO_EMPLOYEE_NAMES_IN_TABLE).toBeGreaterThan(0);

    const candidates = this.shuffle(employeeNames);
    const attemptedNames: string[] = [];

    for (const employeeName of candidates) {
      attemptedNames.push(employeeName);
      await this.resetSearchForm();

      const wasSelected = await this.employeeNameAutocomplete.selectExactOption(employeeName);
      if (!wasSelected) {
        continue;
      }

      await this.submitSearch();

      if ((await this.getEmployeeNames()).includes(employeeName)) {
        return employeeName;
      }
    }

    throw new Error(Messages.ADMIN_USERS.NO_SEARCHABLE_EMPLOYEE_NAME(attemptedNames));
  }

  // Проверяет, что результаты поиска содержат только указанное имя сотрудника.
  async expectSearchResultsContainOnlyEmployeeName(employeeName: string): Promise<void> {
    await this.recordsCounter.waitForVisible(Timeouts.TABLE);

    await expect
      .poll(() => this.hasOnlyEmployeeName(employeeName), {
        timeout: Timeouts.TABLE,
        message: Messages.ADMIN_USERS.SEARCH_RESULTS_MISMATCH(employeeName),
      })
      .toBe(true);
  }

  private async submitSearch(): Promise<void> {
    const previousRows = await this.usersTable.getRows();
    await Promise.all([this.waitForSuccessfulUsersApiResponse(), this.searchButton.click()]);

    await this.waitForUsersTable();
    await expect
      .poll(() => this.usersTable.getRows(), {
        timeout: Timeouts.TABLE,
        message: Messages.ADMIN_USERS.TABLE_DID_NOT_UPDATE,
      })
      .not.toEqual(previousRows);
  }

  private async resetSearchForm(): Promise<void> {
    await this.employeeNameAutocomplete.clear();
  }

  private async waitForUsersTable(): Promise<void> {
    await this.loadingSpinner.waitForHidden(Timeouts.TABLE);
    await this.recordsCounter.waitForVisible(Timeouts.TABLE);
  }

  private async waitForSuccessfulUsersApiResponse(): Promise<void> {
    const response = await this.page.waitForResponse(
      (response) => response.url().includes(Links.ADMIN_USERS_API_PATH) && response.request().method() === HttpMethod.GET,
      { timeout: Timeouts.USERS_API },
    );

    const responseError = await response.finished();
    const errorMessage = Messages.ADMIN_USERS.USERS_API_FAILED(response.status(), response.url());

    expect(responseError, errorMessage).toBeNull();
    expect(response.ok(), errorMessage).toBeTruthy();
  }

  private async getEmployeeNames(): Promise<string[]> {
    return this.usersTable.getColumnValues(UiTableColumns.ADMIN_USERS.EMPLOYEE_NAME);
  }

  private async hasOnlyEmployeeName(employeeName: string): Promise<boolean> {
    const employeeNames = await this.getEmployeeNames();

    return employeeNames.length > 0 && employeeNames.every((name) => name === employeeName);
  }

  private shuffle<T>(items: T[]): T[] {
    return [...items].sort(() => Math.random() - 0.5);
  }
}
