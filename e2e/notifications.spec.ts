import { expect, test } from '@playwright/test';
import { createPost, setupE2eTest, signUp } from './utils';

test.describe('Notification', () => {
  test.beforeEach(setupE2eTest);

  test.beforeEach(async ({ page }) => {
    page.goto('http://localhost:5173');
  });

  test('should show notification when another user comments on your post', async ({
    page,
    browser,
  }) => {
    const testUserEmail = 'test@test.test';
    const testUserPassword = 'testtest';
    const testUserName = 'user';
    const testCommenterEmail = 'commenter@test.test';
    const testCommenterPassword = 'testtest';
    const testCommenterName = 'commenter';
    await signUp(page, testUserEmail, testUserPassword, testUserName);
    await createPost(page, 'Test Post', 'This is a test post');
    const commenterPage = await browser.newPage();
    await commenterPage.goto('http://localhost:5173');
    await signUp(
      commenterPage,
      testCommenterEmail,
      testCommenterPassword,
      testCommenterName
    );
    const messageBoardLink = commenterPage.locator('a', {
      hasText: 'Message Board',
    });
    await messageBoardLink.click();
    const post = commenterPage.locator('h3', { hasText: 'Test Post' });
    await post.click();
    const commentForm = commenterPage.locator('[name="comment"]');
    await commentForm.fill('This is a test comment');
    const submitButton = commenterPage.locator('button', { hasText: 'Submit' });
    await submitButton.click();
    const comment = commenterPage.locator('p', {
      hasText: 'This is a test comment',
    });
    await expect(comment).toHaveCount(1);
  });
});
