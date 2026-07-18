import { type Locator } from '@playwright/test';
import { Timeouts } from '../data/timeouts';

export class BaseComponent {
  protected readonly locator: Locator;

  constructor(locator: Locator) {
    this.locator = locator;
  }

  async waitForVisible(timeout = Timeouts.DEFAULT): Promise<void> {
    await this.locator.waitFor({ state: 'visible', timeout });
  }

  async waitForHidden(timeout = Timeouts.DEFAULT): Promise<void> {
    await this.locator.waitFor({ state: 'hidden', timeout });
  }
}
