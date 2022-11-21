import test, { expect, Locator, Page } from "@playwright/test";
import {
  createComment,
  createPost,
  login,
  setupE2eTest,
  signUp,
} from "./utils";

const testUserEmail = "test@test.io";
const testUserPassword = "test123567";
const testUserName = "test";

test.describe("Up Voting", () => {
  test.beforeEach(setupE2eTest);

  test.beforeEach(async ({ page }) => {
    page.goto("http://localhost:1337");
  });

  test("upvoting works on main page", async ({ page }) => {
    await signUp(page, testUserEmail, testUserPassword, testUserName);
    const post = await createPost(page, "test post", "test contents");
    const upvoteButton = page.locator(`[data-e2e="upvote"]`);
    const downvoteButton = page.locator(`[data-e2e="downvote"]`);
    await expect(upvoteButton).toHaveCount(1);
    await waitForClick(upvoteButton);
    const upvoteCount = page.locator(`[data-e2e="upvote-count"]`);
    await page.reload();
    await expect(upvoteCount).toHaveText("1");
    const filledUpvoteButton = page.locator(
      `[data-e2e="upvote"][data-filled="true"]`
    );
    const filledDownvoteButton = page.locator(
      `[data-e2e="downvote"][data-filled="true"]`
    );
    await expect(filledUpvoteButton).toHaveCount(1);
    await expect(filledDownvoteButton).toHaveCount(0);
    await waitForClick(downvoteButton);
    await page.reload();
    await expect(upvoteCount).toHaveText("-1");
    await expect(filledDownvoteButton).toHaveCount(1);
    await expect(filledUpvoteButton).toHaveCount(0);
  });
  test("upvoting works on post in post page", async ({ page }) => {
    await signUp(page, testUserEmail, testUserPassword, testUserName);
    const post = await createPost(page, "test post", "test contents");
    await post.click();
    const upvoteButton = page.locator(`[data-e2e="upvote"]`);
    const downvoteButton = page.locator(`[data-e2e="downvote"]`);
    await expect(upvoteButton).toHaveCount(1);
    await waitForClick(upvoteButton);
    await page.reload();
    const upvoteCount = page.locator(`[data-e2e="upvote-count"]`);
    await expect(upvoteCount).toHaveText("1");
    const filledUpvoteButton = page.locator(
      `[data-e2e="upvote"][data-filled="true"]`
    );
    const filledDownvoteButton = page.locator(
      `[data-e2e="downvote"][data-filled="true"]`
    );
    await expect(filledUpvoteButton).toHaveCount(1);
    await expect(filledDownvoteButton).toHaveCount(0);
    await waitForClick(downvoteButton);
    await page.reload();
    await expect(upvoteCount).toHaveText("-1");
    await expect(filledDownvoteButton).toHaveCount(1);
    await expect(filledUpvoteButton).toHaveCount(0);
  });
  test("upvoting works on comment in post page", async ({ page }) => {
    await signUp(page, testUserEmail, testUserPassword, testUserName);
    const post = await createPost(page, "test post", "test contents");
    await post.click();
    await createComment(page, "test comment");
    const upvoteButton = page.locator(`[data-e2e="upvote"]`);
    const upvoteCount = page.locator(`[data-e2e="upvote-count"]`);
    const downvoteButton = page.locator(`[data-e2e="downvote"]`);
    await expect(upvoteButton).toHaveCount(2);
    await expect(downvoteButton).toHaveCount(2);
    await expect(upvoteCount).toHaveCount(2);
    for (let i = 0; i < 2; i++) {
      await expect(upvoteCount.nth(i)).toHaveText("0");
      await waitForClick(upvoteButton.nth(i));
      await page.reload();
      await expect(upvoteCount.nth(i)).toHaveText("1");
      const filledUpvoteButton = page.locator(
        `[data-e2e="upvote"][data-filled="true"]`
      );
      const filledDownvoteButton = page.locator(
        `[data-e2e="downvote"][data-filled="true"]`
      );
      await expect(filledUpvoteButton).toHaveCount(1);
      await expect(filledDownvoteButton).toHaveCount(i);
      await waitForClick(downvoteButton.nth(i));
      await page.reload();
      await expect(upvoteCount.nth(i)).toHaveText("-1");
      await expect(filledDownvoteButton).toHaveCount(i + 1);
      await expect(filledUpvoteButton).toHaveCount(0);
    }
  });
});

export async function waitForClick(locator: Locator, ms = 10) {
  await locator.click();
  await new Promise<void>((res) =>
    setTimeout(() => {
      res();
    }, ms)
  );
}
