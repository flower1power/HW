import { BaseComponent } from './base';

export class Button extends BaseComponent {
  async click(): Promise<void> {
    await this.waitForVisible();
    await this.locator.click();
  }
}
