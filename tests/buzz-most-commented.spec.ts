import { Messages } from '../support/data/messages';
import { authenticatedAdminTest as test, expect } from '../support/fixtures/pages.fixture';

test.describe('Buzz most commented posts', () => {
  test.beforeEach(async ({ admin }) => {
    await admin.buzzPage.open();
    await admin.buzzPage.sortByMostCommentedPosts();
  });

  test('sorts posts by comment count using the built-in Array.sort check', async ({ admin }) => {
    const actualCommentCounts = await admin.buzzPage.getCommentCounts();
    const expectedCommentCounts = [...actualCommentCounts].sort((first, second) => second - first);

    expect(actualCommentCounts.length, Messages.BUZZ.NOT_ENOUGH_POSTS).toBeGreaterThan(1);
    expect(actualCommentCounts, Messages.BUZZ.POSTS_ARE_NOT_SORTED_WITH_BUILT_IN_SORT).toEqual(expectedCommentCounts);
  });

  test('sorts posts by comment count using a manual adjacent-pair check', async ({ admin }) => {
    const commentCounts = await admin.buzzPage.getCommentCounts();

    expect(commentCounts.length, Messages.BUZZ.NOT_ENOUGH_POSTS).toBeGreaterThan(1);

    for (let index = 1; index < commentCounts.length; index += 1) {
      const previousCount = commentCounts[index - 1];
      const currentCount = commentCounts[index];

      expect(
        currentCount,
        Messages.BUZZ.POSTS_ARE_NOT_SORTED_MANUALLY(previousCount, currentCount, index),
      ).toBeLessThanOrEqual(previousCount);
    }
  });
});
