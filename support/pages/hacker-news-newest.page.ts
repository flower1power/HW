import { type Locator, type Page } from '@playwright/test';
import { Links } from '../data/links';
import { Messages } from '../data/messages';
import { UiSelectors } from '../data/ui';
import { BasePage } from './base.page';

export class HackerNewsNewestPage extends BasePage {
  protected readonly url = Links.HACKER_NEWS_NEWEST_PAGE;

  constructor(page: Page) {
    super(page);
  }

  private get storyAges(): Locator {
    return this.page.locator(UiSelectors.HACKER_NEWS.STORY_AGE);
  }

  async getFirstStoryTimestamps(storyCount: number): Promise<number[]> {
    const timestamps: number[] = [];

    for (let index = 0; index < storyCount; index += 1) {
      const timestampTitle = await this.storyAges.nth(index).getAttribute('title');

      const unixTimestamp = Number(timestampTitle?.split(' ')[1]);

      if (!Number.isFinite(unixTimestamp)) {
        throw new Error(Messages.HACKER_NEWS.INVALID_STORY_TIMESTAMP(timestampTitle));
      }

      timestamps.push(unixTimestamp);
    }

    return timestamps;
  }
}
