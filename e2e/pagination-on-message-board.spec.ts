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

test.describe("Pagination", () => {
  test.setTimeout(45000);
  test.beforeEach(async ({ page }) => {
    await setupE2eTest();
    page.goto("http://localhost:5173");
    await signUp(page, testUserEmail, testUserPassword, testUserName);
  });

  test("basic paging for 30 posts", async ({ page }) => {
    const numberOfPostsToMake = 30;
    for (let i = 0; i < numberOfPostsToMake; i++) {
      const post = await createPost(
        page,
        `Test Post #${i}`,
        "This is a test post"
      );
    }
    const messageBoardLink = page
      .locator("a", { hasText: "message board" })
      .first();
    await messageBoardLink.click();
    for (let i = 1; i <= 3; i++) {
      const pageButtonLocator = page.locator(`a[data-e2e="page-${i}"]`);
      await expect(pageButtonLocator).toHaveCount(1);
    }
    const secondPageLink = page.locator(`a[data-e2e="page-2"]`);
    await secondPageLink.click();
    for (let i = 0; i < 10; i++) {
      const postLocator = page.locator("h3", {
        hasText: `Test post #${19 - i}`,
      });
      await expect(postLocator).toHaveCount(1);
    }
  });

  test("adv paging for 120 posts", async ({ page }) => {
    const numberOfPostsToMake = 120;
    for (let i = 0; i < numberOfPostsToMake; i++) {
      const post = await createPost(
        page,
        `Test Post #${i}`,
        "This is a test post"
      );
    }
    const messageBoardLink = page
      .locator("a", { hasText: "message board" })
      .first();
    await messageBoardLink.click();
    async function assertCorrectPageButtonsShown({
      targetPage,
      pagesShown,
      pagesNotShown,
      showStartingEllipsis,
      showEndingEllipsis,
    }: {
      targetPage: number;
      pagesShown: number[];
      pagesNotShown: number[];
      showStartingEllipsis: boolean;
      showEndingEllipsis: boolean;
    }) {
      await page.goto(`http://localhost:5173/message-board/${targetPage}`);
      for (const pageNumber of pagesShown) {
        const linkLocator = page.locator(`a[data-e2e="page-${pageNumber}"]`);
        await expect(linkLocator).toHaveCount(1);
      }
      for (const pageNumber of pagesNotShown) {
        const linkLocator = page.locator(`a[data-e2e="page-${pageNumber}"]`);
        await expect(linkLocator).toHaveCount(0);
      }
      const startingElipsisLocator = page.locator(
        `span[data-e2e="starting-elipsis"]`
      );
      const endingElipsisLocator = page.locator(
        `span[data-e2e="ending-elipsis"]`
      );
      await expect(startingElipsisLocator).toHaveCount(
        showStartingEllipsis ? 1 : 0
      );
      await expect(endingElipsisLocator).toHaveCount(
        showEndingEllipsis ? 1 : 0
      );
    }
    await assertCorrectPageButtonsShown({
      targetPage: 1,
      showEndingEllipsis: true,
      showStartingEllipsis: false,
      pagesShown: [1, 2, 3, 4, 5, 12],
      pagesNotShown: [6, 7, 8, 9, 10, 11],
    });
    await assertCorrectPageButtonsShown({
      targetPage: 2,
      showEndingEllipsis: true,
      showStartingEllipsis: false,
      pagesShown: [1, 2, 3, 4, 5, 6, 12],
      pagesNotShown: [7, 8, 9, 10, 11],
    });
    await assertCorrectPageButtonsShown({
      targetPage: 3,
      showEndingEllipsis: true,
      showStartingEllipsis: false,
      pagesShown: [1, 2, 3, 4, 5, 6, 7, 12],
      pagesNotShown: [8, 9, 10, 11],
    });
    await assertCorrectPageButtonsShown({
      targetPage: 4,
      showEndingEllipsis: true,
      showStartingEllipsis: false,
      pagesShown: [1, 2, 3, 4, 5, 6, 7, 8, 12],
      pagesNotShown: [9, 10, 11],
    });
    await assertCorrectPageButtonsShown({
      targetPage: 5,
      showEndingEllipsis: true,
      showStartingEllipsis: false,
      pagesShown: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12],
      pagesNotShown: [10, 11],
    });
    await assertCorrectPageButtonsShown({
      targetPage: 6,
      showEndingEllipsis: true,
      showStartingEllipsis: false,
      pagesShown: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12],
      pagesNotShown: [11],
    });
    await assertCorrectPageButtonsShown({
      targetPage: 7,
      showEndingEllipsis: false,
      showStartingEllipsis: true,
      pagesShown: [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      pagesNotShown: [2],
    });
    await assertCorrectPageButtonsShown({
      targetPage: 8,
      showEndingEllipsis: false,
      showStartingEllipsis: true,
      pagesShown: [1, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      pagesNotShown: [2, 3],
    });
    await assertCorrectPageButtonsShown({
      targetPage: 9,
      showEndingEllipsis: false,
      showStartingEllipsis: true,
      pagesShown: [1, 5, 6, 7, 8, 9, 10, 11, 12],
      pagesNotShown: [2, 3, 4],
    });
    await assertCorrectPageButtonsShown({
      targetPage: 10,
      showEndingEllipsis: false,
      showStartingEllipsis: true,
      pagesShown: [1, 6, 7, 8, 9, 10, 11, 12],
      pagesNotShown: [2, 3, 4, 5],
    });
    await assertCorrectPageButtonsShown({
      targetPage: 11,
      showEndingEllipsis: false,
      showStartingEllipsis: true,
      pagesShown: [1, 7, 8, 9, 10, 11, 12],
      pagesNotShown: [2, 3, 4, 5, 6],
    });
    await assertCorrectPageButtonsShown({
      targetPage: 12,
      showEndingEllipsis: false,
      showStartingEllipsis: true,
      pagesShown: [1, 8, 9, 10, 11, 12],
      pagesNotShown: [2, 3, 4, 5, 6, 7],
    });
  });
});
