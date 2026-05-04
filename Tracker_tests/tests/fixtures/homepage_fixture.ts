import { test as base } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

type Fixtures = {
  home: HomePage;
};

export const test = base.extend<Fixtures>({
  home: async ({ page }, use) => {
    const home = new HomePage(page);
    await home.gotoRoot();
    await use(home);
  },
});
