import test, { expect, Page } from "@playwright/test";
import { login, setupE2eTest, signUp } from "./utils";

const testUserEmail = "test@test.io";
const testUserPassword = "test123567";
const testUserName = "test";

test.describe("Message Board", () => {
  test.beforeEach(setupE2eTest);

  test.beforeEach(async ({ page }) => {
    page.goto("http://localhost:5173");
  });

  //   test("can see message board, but cannot interact", async ({ page }) => {
  //     const messageBoardLink = page.locator("a", { hasText: "Message Board" });
  //     await messageBoardLink.click();
  //   });

  //   test("signing up from the message board sends you back to the message board", async ({
  //     page,
  //   }) => {
  //     const messageBoardLink = page.locator("a", { hasText: "Message Board" });
  //     await messageBoardLink.click();
  //     await signUp(page, testUserEmail, testUserPassword, testUserName);
  //     const messageBoardTitle = page.locator("h2", { hasText: "Message Board" });
  //     await expect(messageBoardTitle).toHaveCount(1);
  //   });

  //   test("logging in from the message board sends you back to the message board", async ({
  //     page,
  //   }) => {
  //     await signUp(page, testUserEmail, testUserPassword, testUserName);
  //     const logoutButton = page.locator("button", { hasText: "Logout" }).first();
  //     await logoutButton.click();
  //     const messageBoardLink = page.locator("a", { hasText: "Message Board" });
  //     await messageBoardLink.click();
  //     await login(page, testUserEmail, testUserPassword, testUserName);
  //   });

  test.describe("signed in user", () => {
    test.beforeEach(async ({ page }) => {
      await signUp(page, testUserEmail, testUserPassword, testUserName);
    });

    // test("can get to message board", async ({ page }) => {
    //   const messageBoardLink = page.locator("a", { hasText: "Message Board" });
    //   await messageBoardLink.click();
    //   const messageBoardHeader = page.locator("h2", {
    //     hasText: "Message Board",
    //   });
    //   await expect(messageBoardHeader).toHaveCount(1);
    // });

    test("can create a new post", async ({ page }) => {
      await createPost(page, "Test Post", "This is a test post");
      const postedByMessage = page.locator("p", {
        hasText: `Posted by ${testUserName}`,
      });
      await expect(postedByMessage).toHaveCount(1);
      //   const commentCount = page.locator("p", { hasText: "comments" });
      //   await expect(commentCount).toHaveText("0 comments");
    });

    test("can create a new comment", async ({ page }) => {
      const post = await createPost(page, "Test Post", "This is a test post");
      await post.click();
      await createComment(page, "This is a test comment");
      //   const commentCount = page.locator("p", { hasText: "comments" });
      //   await expect(commentCount).toHaveText("1 comments");
    });
  });
});

async function createPost(page: Page, title: string, contents: string) {
  page.goto("http://localhost:5173/message-board/1");
  const postTitleInput = page.locator(`input[name="title"]`);
  const postContentsInput = page.locator(`textarea[name="contents"]`);
  const postSubmitButton = page.locator(`button[type="submit"]`);
  await postTitleInput.fill(title);
  await postContentsInput.fill(contents);
  await postSubmitButton.click();
  const post = page.locator("h3", { hasText: title });
  await expect(post).toHaveCount(1);
  return post;
}

async function createComment(page: Page, comment: string) {
  const commentInput = page.locator(`textarea[name="comment"]`);
  const commentSubmitButton = page.locator(`button[type="submit"]`);
  await commentInput.fill(comment);
  await commentSubmitButton.click();
  const createdComment = page.locator("p", { hasText: comment });
  await expect(createdComment).toHaveCount(1);
}
