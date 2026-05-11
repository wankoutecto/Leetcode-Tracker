import { Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(process.env.FRONTEND_URL || "http://localhost:5173");
  }

  async getTitle() {
    return this.page.title();
  }

  async clickLogin() {
    await this.page
      .getByRole("link", { name: /login|sign in/i })
      .first()
      .click();
  }

  async isLoggedIn() {
    return (await this.page.locator("text=Logout").count()) > 0;
  }

  // Selectors and simple checks kept in page object for reuse
  signupButton() {
    return this.page.getByRole("button", { name: "Sign up" });
  }

  loginButton() {
    return this.page.getByRole("button", { name: "Log in" });
  }

  rootLocator() {
    return this.page.locator("#root");
  }

  async gotoRoot() {
    // Use relative path so Playwright's baseURL (from config) is applied.
    await this.page.goto("/");
  }
}
