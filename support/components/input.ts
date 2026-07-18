import { expect } from '@playwright/test';
import { Timeouts } from '../data/timeouts';
import { BaseComponent } from './base';

export class Input extends BaseComponent {
  async fill(value: string | number): Promise<void> {
    const text = value.toString();

    await this.waitForVisible();
    await this.locator.fill(text);
    await this.expectValue(text);
  }

  async pressSequentially(value: string | number, delay = Timeouts.TYPE_DELAY): Promise<void> {
    await this.waitForVisible();
    await this.locator.pressSequentially(value.toString(), { delay });
  }

  async clear(): Promise<void> {
    await this.waitForVisible();
    await this.locator.clear();
    await this.expectValue('');
  }

  async press(key: string): Promise<void> {
    await this.waitForVisible();
    await this.locator.press(key);
  }

  async expectValue(expected: string): Promise<void> {
    await expect(this.locator).toHaveValue(expected);
  }

  async expectNotEmpty(): Promise<void> {
    await expect(this.locator).not.toHaveValue('');
  }
}
