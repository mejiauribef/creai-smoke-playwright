import { Page, Locator, Response } from '@playwright/test';

/**
 * Page Object Model for the Home Page.
 * Contains selectors and methods for interacting with the home page elements.
 */
export class HomePage {
  readonly page: Page;
  readonly allowAllCta: Locator;
  readonly logo: Locator;
  readonly heroTitle: Locator;
  readonly primaryCta: Locator;
  readonly servicesSectionTitle: Locator;
  readonly successStoriesSectionTitle: Locator;
  readonly faqSectionTitle: Locator;
  readonly headerNav: Locator;

  /**
   * Initializes the HomePage object.
   * @param page Playwright Page object.
   */
  constructor(page: Page) {
    this.page = page;
    this.allowAllCta = page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
    this.logo = page.getByRole('link', { name: 'home' });
    this.heroTitle = page.getByRole('heading', { level: 1 });
    this.primaryCta = page.getByRole('link', { name: 'Get started' });
    this.servicesSectionTitle = page
      .locator('.section_layout497')
      .getByRole('heading', { name: /Evolve and optimize/ });
    this.successStoriesSectionTitle = page.getByRole('heading', { name: 'Success stories' });
    this.faqSectionTitle = page.getByRole('heading', { name: 'FAQs' });
    this.headerNav = page.locator('.navbar11_menu');
  }

  /** Gets the hamburger menu button (mobile only). */
  get navMenuButton() {
    return this.page.getByRole('button', { name: 'menu' });
  }
  /** Gets the contact button in the navigation bar. */
  get navContact() {
    return this.page
      .locator('.navbar11_component a[href="/contact"][trigger="contact_cta"]')
      .first();
  }
  /** Gets the contact link inside the mobile menu. */
  get mobileMenuContact() {
    return this.headerNav.locator('a[href="/contact"]');
  }
  /** Gets the navigation links. */
  get navLinks() {
    return this.page.locator('.navbar11_component .w-nav-menu a.navbar11_link');
  }

  /** Gets the mobile navigation overlay. */
  get mobileNavOverlay() {
    // Narrow it to the navbar component; don’t grab all overlays in page
    return this.page.locator('.navbar11_component .w-nav-overlay');
  }

  async openMobileMenu(): Promise<void> {
    await this.navMenuButton.scrollIntoViewIfNeeded();
    await this.navMenuButton.click();

    // Wait for something that indicates “menu is open”
    // Try overlay first; if that’s unreliable, use class/aria.
    await this.page.waitForTimeout(100); // tiny debounce for Webflow animations
  }

  async isMenuOpen(): Promise<boolean> {
    const btnClasses = await this.navMenuButton.getAttribute('class');
    return !!btnClasses && btnClasses.includes('w--open');
  }

  /** Gets the services section. */
  get servicesSection() {
    return this.page.locator('.section_layout497');
  }
  /** Gets the service tabs. */
  get serviceTabs() {
    return this.servicesSection.locator('.layout497_tab-link');
  }
  /** Gets the service tab panes. */
  get serviceTabPanes() {
    return this.servicesSection.locator('.layout497_tab-pane');
  }

  /** Gets the success stories slider. */
  get successStoriesSlider() {
    return this.page.locator('.swiper.test2');
  }
  /** Gets the success story slides (excluding cloned ones). */
  get successStorySlides() {
    return this.successStoriesSlider.locator('.swiper-slide:not(.slick-cloned)');
  }

  /** Gets the FAQ section. */
  get faqSection() {
    return this.page.locator('.section_faq6');
  }
  /** Gets the FAQ questions. */
  get faqQuestions() {
    return this.faqSection.locator('.faq6_question');
  }
  /** Gets the FAQ answers. */
  get faqAnswers() {
    return this.faqSection.locator('.faq6_answer');
  }

  /** Gets the insights/blog section. */
  get insightsSection() {
    return this.page.locator('.section_latest_posts');
  }
  /** Gets the insight cards. */
  get insightCards() {
    return this.insightsSection.locator('.latest_post_card-item');
  }

  /** Gets the newsletter CTA button. */
  get newsletterCta() {
    return this.page.locator('.banner_newsletter-cta');
  }
  /** Gets the newsletter modal. */
  get newsletterModal() {
    return this.page.locator('.newsletter_modal');
  }
  /** Gets the newsletter email input. */
  get newsletterEmailInput() {
    return this.newsletterModal.locator('input[name="Email-2"]');
  }
  /** Gets the newsletter terms checkbox. */
  get newsletterTermsCheckbox() {
    return this.newsletterModal.locator('input[name="Contact-6-Checkbox"]');
  }
  /** Gets the newsletter terms label. */
  get newsletterTermsLabel() {
    return this.newsletterModal.locator('label#Contact-6-Checkbox');
  }
  /** Gets the newsletter submit button. */
  get newsletterSubmit() {
    return this.newsletterModal.locator('input[type="submit"]');
  }

  /**
   * Opens the newsletter modal by clicking the CTA.
   */
  async openNewsletterModal() {
    await this.newsletterCta.click();
    await this.newsletterModal.waitFor({ state: 'visible' });
  }

  /**
   * Toggles the terms and conditions checkbox in the newsletter modal.
   */
  async toggleNewsletterTerms() {
    await this.newsletterTermsLabel.click();
  }

  /**
   * Navigates to the specified path.
   * @param path The URL path to navigate to. Defaults to '/'.
   * @returns The response object or null.
   */
  async goto(path: string = '/'): Promise<Response | null> {
    const response = await this.page.goto(path, { waitUntil: 'networkidle' });
    return response;
  }

  /**
   * Accepts cookies if the consent dialog is visible.
   */
  async acceptCookiesIfPrompted(): Promise<void> {
    try {
      if (await this.allowAllCta.isVisible({ timeout: 5000 })) {
        await this.allowAllCta.click();
        await this.allowAllCta.waitFor({ state: 'hidden' });
      }
    } catch {
      // Ignore errors if cookie banner is not present or interactable
    }
  }

  /**
   * Clicks a navigation item in the header by its text content.
   * @param text The text of the navigation item to click.
   */
  async clickNavItemByText(text: string): Promise<void> {
    await this.page
      .getByRole('link', { name: new RegExp(text, 'i') })
      .first()
      .click();
  }

  /**
   * Captures console errors that occur during a specific action.
   * @param action The async action to execute.
   * @returns An array of error messages logged to the console.
   */
  async getConsoleErrorsDuring(action: () => Promise<void>): Promise<string[]> {
    const errors: string[] = [];

    const handler = (msg: any) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    };

    this.page.on('console', handler);
    try {
      await action();
    } finally {
      this.page.off('console', handler);
    }

    return errors;
  }
}
