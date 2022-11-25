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

test.describe("Pyramid of Death", () => {
  test.beforeEach(async ({ page }) => {
    await setupE2eTest();
    page.goto("http://localhost:5173");
  });

  test.describe("signed in user", () => {
    test.beforeEach(async ({ page }) => {
      await signUp(page, testUserEmail, testUserPassword, testUserName);
    });

    test("nested comment form closes after comment is posted", async ({
      page,
    }) => {
      const post = await createPost(page, "Test Post", "This is a test post");
      await post.click();
      await createComment(page, "This is a test comment");
      const targetDepth = 6;
      for (let i = 0; i < targetDepth; i++) {
        const replyButton = page.locator(`button`, { hasText: "Reply" }).last();
        await replyButton.focus();
        await page.keyboard.press("Enter");
        const commentForms = page.locator(`[data-e2e="create-comment-form"]`);
        await expect(commentForms).toHaveCount(2);
        const targetCommentForm = commentForms.last();
        const commentText = `This is a ${new Array(i + 1)
          .fill("nested")
          .join(" ")} comment`;
        await targetCommentForm.locator("textarea").fill(commentText);
        await page.keyboard.press("Tab");
        await page.keyboard.press("Space");
        const postedComment = page.locator(`[data-e2e="comment-content"]`, {
          hasText: commentText,
        });
        if (i < 2) {
          await expect(postedComment).toHaveCount(1);
        } else {
          await expect(postedComment).toHaveCount(0);
          const goDeeperLocator = page.locator("button", {
            hasText: "Go Deeper",
          });
          await expect(goDeeperLocator).toHaveCount(1);
          await goDeeperLocator.focus();
          await page.keyboard.press("Enter");
          await expect(postedComment).toHaveCount(1);
        }
        await expect(commentForms).toHaveCount(1);
      }
    });
  });
});
