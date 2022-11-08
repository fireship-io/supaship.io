import { expect, Page } from "@playwright/test";
import { execSync } from "child_process";
import detect from "detect-port";

export async function setupE2eTest() {
  await startSupabase();
  await reseedDb();
}

async function startSupabase() {
  const port = await detect(54321);
  if (port !== 54321) {
    return;
  }
  console.warn("Supabase not detected - Starting it now");
  execSync("npx supabase start");
}

async function reseedDb() {
  execSync(
    "PGPASSWORD=postgres psql -U postgres -h 127.0.0.1 -p 54322 -f supabase/clear-db-data.sql",
    { stdio: "ignore" }
  );
}

export async function signUp(
  page: Page,
  email: string,
  password: string,
  userName: string,
  skipUserName = false
) {
  const signUpButton = page.locator("button", { hasText: "Sign Up" });
  await signUpButton.click();
  const emailInput = page.locator('input[name="email"]');
  await emailInput.fill(email);
  const passwordInput = page.locator('input[name="password"]');
  await passwordInput.fill(password);
  const signUpSubmitButton = page.locator("button.supabase-ui-auth_ui-button");
  await signUpSubmitButton.click();
  const welcomeNotice = page.locator("h2", { hasText: "Welcome to Supaship!" });
  await expect(welcomeNotice).toHaveCount(1);
  if (skipUserName) {
    return;
  }
  const usernameInput = page.locator('input[name="username"]');
  await usernameInput.fill(userName);
  const submitButton = page.locator("button", { hasText: "Submit" });
  await expect(submitButton).toBeEnabled();
  await page.keyboard.press("Enter");
  const logoutButton = page.locator("button", { hasText: "Logout" });
  await expect(logoutButton).toHaveCount(1);
}

export async function login(
  page: Page,
  email: string,
  password: string,
  username: string
) {
  const signUpButton = page.locator("button", { hasText: "Login" });
  await signUpButton.click();
  const emailInput = page.locator('input[name="email"]');
  await emailInput.fill(email);
  const passwordInput = page.locator('input[name="password"]');
  await passwordInput.fill(password);
  const signUpSubmitButton = page.locator("button.supabase-ui-auth_ui-button");
  await signUpSubmitButton.click();
  const logoutButton = page.locator("button", { hasText: "Logout" });
  await expect(logoutButton).toHaveCount(1);
  const usernameMention = page.locator("h2", { hasText: username });
  await expect(usernameMention).toHaveCount(1);
}
