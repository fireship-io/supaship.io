import { test, expect } from "@playwright/test";
import { login, setupE2eTest, signUp } from "./utils";

test.describe("User auth", () => {
  const userEmail = "test@test.io";
  const userPassword = "test123456";
  const userName = "testuser";
  test.beforeEach(setupE2eTest);
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:1337");
  });
  test("new user can signup", async ({ browser, page }) => {
    await signUp(page, userEmail, userPassword, userName);
  });

  test("after signing up, user can login from another machine", async ({
    browser,
    page,
  }) => {
    await signUp(page, userEmail, userPassword, userName);
    const newMachine = await browser.newPage();
    await newMachine.goto("http://localhost:1337");
    await login(newMachine, userEmail, userPassword, userName);
  });

  test("after signing up, user is logged in on a new tab", async ({
    context,
    page,
  }) => {
    await signUp(page, userEmail, userPassword, userName);
    const newTab = await context.newPage();
    await newTab.goto("http://localhost:1337");
    const logoutButton = newTab.locator("button", { hasText: "Logout" });
    await expect(logoutButton).toHaveCount(1);
  });

  test('user without a username gets redirected to "/welcome"', async ({
    page,
  }) => {
    await signUp(page, userEmail, userPassword, userName, true);
    await page.goto("http://localhost:1337");
    const welcomeNotice = page.locator("h2", {
      hasText: "Welcome to Supaship!",
    });
    await expect(welcomeNotice).toHaveCount(1);
  });

  test('a user with a username get sent back home if they visit "/welcome"', async ({
    page,
  }) => {
    await signUp(page, userEmail, userPassword, userName);
    await page.goto("http://localhost:1337/welcome");
    const welcomeNotice = page.locator("h2", {
      hasText: "Welcome to Supaship!",
    });
    await expect(welcomeNotice).toHaveCount(0);
    const logoutButton = page.locator("button", { hasText: "Logout" });
    await expect(logoutButton).toHaveCount(1);
  });

  test('a logged out user goes to "/" if they visit "/welcome"', async ({
    page,
  }) => {
    await page.goto("http://localhost:1337/welcome");
    await page.waitForNavigation({
      url: "http://localhost:1337/",
      timeout: 2000,
    });
    const welcomeNotice = page.locator("h2", {
      hasText: "Welcome to Supaship!",
    });
    await expect(welcomeNotice).toHaveCount(0);
  });

  test.describe("username validation", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("http://localhost:1337");
      await signUp(page, userEmail, userPassword, userName, true);
    });
    test("it should not allow an empty username", async ({ page }) => {
      const userNameInput = page.locator("input[name='username']");
      const submitButton = page.locator("button", { hasText: "Submit" });
      const validation = page.locator("p.validation-feedback");
      await userNameInput.fill("");
      await expect(submitButton).toBeDisabled();
      await page.keyboard.press("Enter");
      const welcomeHeader = page.locator("h2", {
        hasText: "Welcome to Supaship!",
      });
      await expect(welcomeHeader).toHaveCount(1);
    });

    test("it should not allow spaces in the username", async ({ page }) => {
      const userNameInput = page.locator("input[name='username']");
      const submitButton = page.locator("button", { hasText: "Submit" });
      const validation = page.locator("p.validation-feedback");
      await userNameInput.fill("hello world");
      await expect(submitButton).toBeDisabled();
      await page.keyboard.press("Enter");
      const welcomeHeader = page.locator("h2", {
        hasText: "Welcome to Supaship!",
      });
      await expect(welcomeHeader).toHaveCount(1);
      await expect(validation).toHaveText(
        "Username can only contain letters, numbers, and underscores"
      );
    });
    test("it should not allow usernames longer than 15 characters", async ({
      page,
    }) => {
      const userNameInput = page.locator("input[name='username']");
      const submitButton = page.locator("button", { hasText: "Submit" });
      const validation = page.locator("p.validation-feedback");
      await userNameInput.fill("asdfhkdasfljfjdakdlsjflakdsjflkasdjflak");
      await expect(submitButton).toBeDisabled();
      await page.keyboard.press("Enter");
      const welcomeHeader = page.locator("h2", {
        hasText: "Welcome to Supaship!",
      });
      await expect(welcomeHeader).toHaveCount(1);
      await expect(validation).toHaveText(
        "Username must be less than 15 characters long"
      );
    });

    test("it should not allow usernames less than 3 characters", async ({
      page,
    }) => {
      const userNameInput = page.locator("input[name='username']");
      const submitButton = page.locator("button", { hasText: "Submit" });
      const validation = page.locator("p.validation-feedback");
      await userNameInput.fill("asd");
      await expect(submitButton).toBeDisabled();
      await page.keyboard.press("Enter");
      const welcomeHeader = page.locator("h2", {
        hasText: "Welcome to Supaship!",
      });
      await expect(welcomeHeader).toHaveCount(1);
      await expect(validation).toHaveText(
        "Username must be at least 4 characters long"
      );
    });
  });

  test("it should not allow duplicate usernames", async ({ page }) => {
    await signUp(page, userEmail, userPassword, userName);
    const logoutButton = page.locator("button", { hasText: "Logout" });
    await logoutButton.click();
    const signInButton = page.locator("button", { hasText: "Login" });
    await expect(signInButton).toHaveCount(2);
    await signUp(page, `${userEmail}io`, userPassword, userName, true);
    const userNameInput = page.locator("input[name='username']");
    const submitButton = page.locator("button", { hasText: "Submit" });
    const validation = page.locator("p.validation-feedback");
    await userNameInput.fill(userName);
    // potential for eager name validation here later
    await expect(submitButton).toBeEnabled();
    await page.keyboard.press("Enter");
    const welcomeHeader = page.locator("h2", {
      hasText: "Welcome to Supaship!",
    });
    await expect(welcomeHeader).toHaveCount(1);
    await expect(validation).toHaveText(`Username "testuser" is already taken`);
  });
});
