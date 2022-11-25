// import test, { expect, Page } from "@playwright/test";
// import {
//   createComment,
//   createPost,
//   login,
//   setupE2eTest,
//   signUp,
// } from "./utils";

// const testUserEmail = "test@test.io";
// const testUserPassword = "test123567";
// const testUserName = "test";

// test.describe("Message Board", () => {
//   test.beforeEach(setupE2eTest);

//   test.beforeEach(async ({ page }) => {
//     page.goto("http://localhost:5173");
//   });

//   test("logged in users can add themselves to the email list", async ({
//     page,
//   }) => {
//     await signUp(page, testUserEmail, testUserPassword, testUserName);
//     const emailSignUpNotification = page.locator(
//       `button[data-e2e="email-signup"]`
//     );
//     await expect(emailSignUpNotification).toHaveCount(1);
//     await emailSignUpNotification.click();
//     const emailSignUpForm = page.locator(`[data-e2e="email-signup-form"]`);
//     await expect(emailSignUpForm).toHaveCount(1);
//     const emailSignUpInput = page.locator(`[data-e2e="email-signup-input"]`);
//     // await emailSignUpInput.fill("foo@bar.com");
//     await expect(emailSignUpInput).toHaveValue(testUserEmail);
//     await page.keyboard.press("Enter");
//     const emailConfirmation = page.locator(
//       `[data-e2e="email-confirmation-notice"]`
//     );
//     await expect(emailConfirmation).toHaveCount(1);
//   });

//   test("logged in users can remove themselves from the email list", async ({
//     page,
//   }) => {
//     await signUp(page, testUserEmail, testUserPassword, testUserName);
//     const emailSignUpNotification = page.locator(
//       `button[data-e2e="email-signup"]`
//     );
//     await expect(emailSignUpNotification).toHaveCount(1);
//     await emailSignUpNotification.click();
//     const emailSignUpForm = page.locator(`[data-e2e="email-signup-form"]`);
//     await expect(emailSignUpForm).toHaveCount(1);
//     const emailSignUpInput = page.locator(`[data-e2e="email-signup-input"]`);
//     await emailSignUpInput.fill("foo@bar.com");
//     await page.keyboard.press("Enter");
//     const emailConfirmation = page.locator(
//       `[data-e2e="email-confirmation-notice"]`
//     );
//     await expect(emailConfirmation).toHaveCount(1);
//     await expect(emailSignUpNotification).toHaveCount(0);
//     const emailRemoveButton = page.locator(`[data-e2e="email-remove-button"]`);
//     await emailRemoveButton.click();
//     const emailRemovedConfirmation = page.locator(
//       `[data-e2e="email-remove-confirmation"]`
//     );
//     await expect(emailRemovedConfirmation).toHaveCount(1);
//     await page.reload();
//     await expect(emailSignUpNotification).toHaveCount(1);
//   });

//   test("stop asking button works for logged in users", async ({
//     page,
//     browser,
//   }) => {
//     await signUp(page, testUserEmail, testUserPassword, testUserName);
//     const emailSignUpNotification = page.locator(
//       `button[data-e2e="email-signup"]`
//     );
//     await expect(emailSignUpNotification).toHaveCount(1);
//     const stopAsking = page.locator(`button`, { hasText: "Stop Asking" });
//     await stopAsking.click();
//     await expect(emailSignUpNotification).toHaveCount(0);
//     const nextTimeTheySignIn = await browser.newPage();
//     await nextTimeTheySignIn.goto("http://localhost:5173");
//     await login(
//       nextTimeTheySignIn,
//       testUserEmail,
//       testUserPassword,
//       testUserName
//     );
//     const nextTimeTheySignInEmailSignUpNotification =
//       nextTimeTheySignIn.locator(`button[data-e2e="email-signup"]`);
//     await expect(nextTimeTheySignInEmailSignUpNotification).toHaveCount(0);
//   });

//   test("logged out users are unaware of the email list", async ({ page }) => {
//     const logoutButton = page.locator("button", { hasText: "Sign Up" });
//     await expect(logoutButton).toHaveCount(1);
//     const emailSignUpNotification = page.locator(
//       `button[data-e2e="email-signup"]`
//     );
//     await expect(emailSignUpNotification).toHaveCount(0);
//   });

//   //   test("not logged in users can add and remove themselves to the email list", async ({
//   //     page,
//   //   }) => {
//   //     const emailSignUpNotification = page.locator(
//   //       `button[data-e2e="email-signup"]`
//   //     );
//   //     await expect(emailSignUpNotification).toHaveCount(1);
//   //     await emailSignUpNotification.click();
//   //     const emailSignUpForm = page.locator(`[data-e2e="email-signup-form"]`);
//   //     await expect(emailSignUpForm).toHaveCount(1);
//   //     const emailSignUpInput = page.locator(`[data-e2e="email-signup-input"]`);
//   //     await emailSignUpInput.fill("foo@bar.com");
//   //     await page.keyboard.press("Enter");
//   //     const emailConfirmation = page.locator(
//   //       `[data-e2e="email-confirmation-notice"]`
//   //     );
//   //     await expect(emailConfirmation).toHaveCount(1);
//   //     await expect(emailSignUpNotification).toHaveCount(0);
//   //     const emailRemoveButton = page.locator(`[data-e2e="email-remove-button"]`);
//   //     await emailRemoveButton.click();
//   //     const emailRemoveConfirmation = page.locator(
//   //       `[data-e2e="email-remove-confirmation"]`
//   //     );
//   //     await expect(emailRemoveConfirmation).toHaveCount(1);
//   //   });

//   //   test("not logged in users are not continuously asked to add themselves to the email list", async ({
//   //     page,
//   //     context,
//   //   }) => {
//   //     const emailSignUpNotification = page.locator(
//   //       `button[data-e2e="email-signup"]`
//   //     );
//   //     await expect(emailSignUpNotification).toHaveCount(1);
//   //     await emailSignUpNotification.click();
//   //     const emailSignUpForm = page.locator(`[data-e2e="email-signup-form"]`);
//   //     await expect(emailSignUpForm).toHaveCount(1);
//   //     const emailSignUpInput = page.locator(`[data-e2e="email-signup-input"]`);
//   //     await emailSignUpInput.fill("foo@bar.com");
//   //     await page.keyboard.press("Enter");
//   //     const emailConfirmation = page.locator(
//   //       `[data-e2e="email-confirmation-notice"]`
//   //     );
//   //     await expect(emailConfirmation).toHaveCount(1);
//   //     await expect(emailSignUpNotification).toHaveCount(0);
//   //     const emailRemoveButton = page.locator(`[data-e2e="email-remove-button"]`);
//   //     await emailRemoveButton.click();
//   //     const emailRemoveConfirmation = page.locator(
//   //       `[data-e2e="email-remove-confirmation"]`
//   //     );
//   //     await expect(emailRemoveConfirmation).toHaveCount(1);
//   //     const newTab = await context.newPage();
//   //     await newTab.goto("http://localhost:5173");
//   //     const emailSignUpNotification2 = newTab.locator(
//   //       `[data-e2e="email-signup-form"]`
//   //     );
//   //     await expect(emailSignUpNotification2).toHaveCount(0);
//   //     const newTabEmailRemoveConfirmation = newTab.locator(
//   //       `[data-e2e="email-remove-confirmation"]`
//   //     );
//   //     await expect(newTabEmailRemoveConfirmation).toHaveCount(1);
//   //     await newTabEmailRemoveConfirmation.click();
//   //     const newTabRemoveEmailConfirmation = newTab.locator(
//   //       `[data-e2e="email-remove-confirmation"]`
//   //     );
//   //     await expect(newTabRemoveEmailConfirmation).toHaveCount(1);
//   //   });

//   //   test("stop asking button works for not logged in users", async ({
//   //     page,
//   //     context,
//   //   }) => {
//   //     const emailSignUpNotification = page.locator(
//   //       `button[data-e2e="email-signup"]`
//   //     );
//   //     await expect(emailSignUpNotification).toHaveCount(1);
//   //     const stopAsking = page.locator(`button`, { hasText: "Stop Asking" });
//   //     await stopAsking.click();
//   //     await expect(emailSignUpNotification).toHaveCount(0);
//   //     const nextTimeTheyCome = await context.newPage();
//   //     const nextTimeTheyComeEmailSignUpNotification = nextTimeTheyCome.locator(
//   //       `button[data-e2e="email-signup"]`
//   //     );
//   //     await expect(nextTimeTheyComeEmailSignUpNotification).toHaveCount(0);
//   //   });
// });
