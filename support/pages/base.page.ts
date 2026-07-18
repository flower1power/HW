import { type Page, expect } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;
  protected abstract readonly url: string;

  protected constructor(page: Page) {
    this.page = page;
  }

  async open(): Promise<void> {
    await this.page.goto(this.url);
    await expect(this.page).toHaveURL(this.url);
  }
}
