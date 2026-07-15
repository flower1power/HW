import { type Locator, expect } from '@playwright/test';
import { Timeouts } from '../data/timeouts';
import { BaseComponent } from './base';
import { Input } from './input';

export type AutocompleteOptions = {
  closeKey: string;
  loadingOptionText: RegExp | string;
  optionSelector: string;
  timeout?: number;
};

export class Autocomplete extends BaseComponent {
  private readonly closeKey: string;
  private readonly loadingOptionText: RegExp | string;
  private readonly optionSelector: string;
  private readonly timeout: number;

  constructor(
    private readonly input: Input,
    optionsList: Locator,
    options: AutocompleteOptions,
  ) {
    super(optionsList);
    this.closeKey = options.closeKey;
    this.loadingOptionText = options.loadingOptionText;
    this.optionSelector = options.optionSelector;
    this.timeout = options.timeout ?? Timeouts.AUTOCOMPLETE;
  }

  /** Очищает поле и закрывает список опций. */
  async clear(): Promise<void> {
    await this.input.clear();
    await this.input.press(this.closeKey);
  }

  /** Выбирает опцию только при полном совпадении текста. */
  async selectExactOption(value: string): Promise<boolean> {
    await this.input.clear();
    await this.input.pressSequentially(value);
    await this.waitForVisible(this.timeout);
    await this.waitForSearchToFinish();

    const option = this.locator.locator(this.optionSelector).getByText(value, { exact: true }).first();
    if ((await option.count()) === 0) {
      return false;
    }

    await option.click();
    await this.input.expectNotEmpty();

    return true;
  }

  private async waitForSearchToFinish(): Promise<void> {
    await expect.poll(() => this.areOptionsLoaded(), { timeout: this.timeout }).toBe(true);
  }

  private async areOptionsLoaded(): Promise<boolean> {
    const optionTexts = await this.locator.locator(this.optionSelector).allInnerTexts();

    return optionTexts.length > 0 && !optionTexts.some((optionText) => this.isLoadingOption(optionText));
  }

  private isLoadingOption(optionText: string): boolean {
    if (typeof this.loadingOptionText === 'string') {
      return optionText === this.loadingOptionText;
    }

    return this.loadingOptionText.test(optionText);
  }
}
