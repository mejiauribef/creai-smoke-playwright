import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ContactPage } from '../pages/ContactPage';

type Pages = {
  homePage: HomePage;
  contactPage: ContactPage;
  isMobile: boolean;
};

/**
 * Custom test fixture that extends the base Playwright test.
 * Provides initialized Page Objects and mobile detection.
 */
export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },
  isMobile: async (_, use, testInfo) => {
    await use(testInfo.project.name.toLowerCase().includes('mobile'));
  },
});

export { expect } from '@playwright/test';
