import { expect, test } from '../support/fixtures/pages.fixture';
import { Messages } from '../support/data/messages';

const STORIES_TO_CHECK = 10;

test.describe('Hacker News newest stories', () => {
  test('shows the first 10 stories from newest to oldest', async ({ hackerNewsNewestPage }) => {
    await hackerNewsNewestPage.open();

    const actualTimestamps = await hackerNewsNewestPage.getFirstStoryTimestamps(STORIES_TO_CHECK);
    const expectedTimestamps = [...actualTimestamps].sort((first, second) => second - first);

    expect(actualTimestamps).toHaveLength(STORIES_TO_CHECK);
    expect(actualTimestamps, Messages.HACKER_NEWS.STORIES_ARE_NOT_SORTED).toEqual(expectedTimestamps);
  });
});
