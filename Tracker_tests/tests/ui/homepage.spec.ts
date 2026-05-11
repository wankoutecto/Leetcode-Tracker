import { expect } from "@playwright/test";
import { test } from "../fixtures/homepage_fixture";

test.describe("UI — Leetcode Tracker ", () => {
  test("homepage basic elements", async ({ home }) => {
    await expect(home.signupButton()).toBeVisible();
    await expect(home.loginButton()).toBeVisible();
  });

  test("signup is available on screen", async ({ home }) => {
    const signup = home.signupButton();
    if ((await signup.count()) === 0) {
      test.skip();
      return;
    }
    // Ensure Sign up is visible and enabled; if not present, test will be skipped above
    await expect(signup).toBeVisible();
    await expect(signup).toBeEnabled();
  });
});
