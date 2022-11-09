import test, { expect, Page } from "@playwright/test";
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

test.describe("Message Board", () => {
  test.beforeEach(setupE2eTest);

  test.beforeEach(async ({ page }) => {
    page.goto("http://localhost:5173");
  });

  test("upvoting works on main page", async ({ page }) => {
    await signUp(page, testUserEmail, testUserPassword, testUserName);
    const post = await createPost(page, "test post", "test contents");
    const upvoteButton = page.locator(`[data-e2e="upvote"]`);
    await expect(upvoteButton).toHaveCount(1);
    await upvoteButton.click();
    const upvoteCount = page.locator(`[data-e2e="upvote-count"]`);
    await expect(upvoteCount).toHaveText("1");
    // add when filled is in
    // const filledUpvoteButton = post.locator(
    //   `[data-e2e="upvote"][data-filled="true"]`
    // );
    // await expect(filledUpvoteButton).toHaveCount(1);
    const downvoteButton = page.locator(`[data-e2e="downvote"]`);
    await downvoteButton.click();
    await expect(upvoteCount).toHaveText("-1");
  });
  test("upvoting works on post in post page", async ({ page }) => {
    await signUp(page, testUserEmail, testUserPassword, testUserName);
    const post = await createPost(page, "test post", "test contents");
    await post.click();
    const upvoteButton = page.locator(`[data-e2e="upvote"]`);
    await expect(upvoteButton).toHaveCount(1);
    await upvoteButton.click();
    const upvoteCount = page.locator(`[data-e2e="upvote-count"]`);
    await expect(upvoteCount).toHaveText("1");
    // add when filled is in
    // const filledUpvoteButton = post.locator(
    //   `[data-e2e="upvote"][data-filled="true"]`
    // );
    // await expect(filledUpvoteButton).toHaveCount(1);
    const downvoteButton = page.locator(`[data-e2e="downvote"]`);
    await downvoteButton.click();
    await expect(upvoteCount).toHaveText("-1");
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
      await upvoteButton.nth(i).click();
      await expect(upvoteCount.nth(i)).toHaveText("1");
      // add when filled is in
      // const filledUpvoteButton = post.locator(
      //   `[data-e2e="upvote"][data-filled="true"]`
      // );
      // await expect(filledUpvoteButton).toHaveCount(1);
      await downvoteButton.nth(i).click();
      await expect(upvoteCount.nth(i)).toHaveText("-1");
    }
  });
});
