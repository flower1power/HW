import { type Locator, type Page, expect } from '@playwright/test';
import { LoadingSpinner } from '../components/loading-spinner';
import { Links } from '../data/links';
import { Messages } from '../data/messages';
import { Timeouts } from '../data/timeouts';
import { HttpMethod, UiSelectors, UiText } from '../data/ui';
import { BasePage } from './base.page';

export class BuzzPage extends BasePage {
  protected readonly url = Links.BUZZ_PAGE;

  constructor(page: Page) {
    super(page);
  }

  private get mostCommentedPostsButton(): Locator {
    return this.page.getByRole('button', { name: UiText.BUZZ.MOST_COMMENTED_POSTS_BUTTON });
  }

  private get commentCounts(): Locator {
    return this.page.locator(UiSelectors.BUZZ.COMMENT_COUNTS).filter({ hasText: UiText.BUZZ.COMMENT_COUNT_PATTERN });
  }

  private get loadingSpinner(): LoadingSpinner {
    return new LoadingSpinner(this.page.locator(UiSelectors.BUZZ.LOADING_SPINNER));
  }

  override async open(): Promise<void> {
    await super.open();
    await this.loadingSpinner.waitForHidden(Timeouts.TABLE);
    await expect
      .poll(() => this.commentCounts.count(), {
        message: Messages.BUZZ.NOT_ENOUGH_POSTS,
        timeout: Timeouts.TABLE,
      })
      .toBeGreaterThan(1);
  }

  async sortByMostCommentedPosts(): Promise<void> {
    await Promise.all([this.waitForSuccessfulBuzzFeedApiResponse(), this.mostCommentedPostsButton.click()]);
    await expect(this.mostCommentedPostsButton).toHaveClass(/oxd-button--label-warn/);
    await this.loadingSpinner.waitForHidden(Timeouts.TABLE);
  }

  async getCommentCounts(): Promise<number[]> {
    const counterTexts = await this.commentCounts.allInnerTexts();

    return counterTexts.map((counterText) => this.parseCommentCount(counterText));
  }

  private async waitForSuccessfulBuzzFeedApiResponse(): Promise<void> {
    const response = await this.page.waitForResponse(
      (response) => response.url().includes(Links.BUZZ_FEED_API_PATH) && response.request().method() === HttpMethod.GET,
      { timeout: Timeouts.BUZZ_FEED_API },
    );

    const responseError = await response.finished();
    const errorMessage = Messages.BUZZ.BUZZ_FEED_API_FAILED(response.status(), response.url());

    expect(responseError, errorMessage).toBeNull();
    expect(response.ok(), errorMessage).toBeTruthy();
  }

  private parseCommentCount(counterText: string): number {
    const normalizedText = counterText.trim();
    const match = normalizedText.match(/^(\d+) Comments?$/);

    if (!match?.[1]) {
      throw new Error(Messages.BUZZ.INVALID_COMMENT_COUNT(normalizedText));
    }

    return Number(match[1]);
  }
}
