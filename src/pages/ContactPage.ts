import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Contact Page.
 * Contains selectors and methods for interacting with the contact form.
 */
export class ContactPage {
  readonly page: Page;
  readonly allowAllCta: Locator;
  readonly heading: Locator;
  readonly form: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly purposeCombobox: Locator;
  readonly purposeOptions: Locator;
  readonly descriptionTextarea: Locator;
  readonly termsCheckbox: Locator;
  readonly termsLink: Locator;
  readonly submitButton: Locator;

  /**
   * Initializes the ContactPage object.
   * @param page Playwright Page object.
   */
  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole('heading', { name: 'Let’s talk' });
    this.form = page.getByRole('form', { name: 'Contact Form' });

    this.nameInput = page.getByLabel('Name');
    this.emailInput = page.getByLabel('Email');
    this.purposeCombobox = page.getByRole('combobox', { name: 'Purpose' });
    this.purposeOptions = this.purposeCombobox.getByRole('option');

    this.descriptionTextarea = page.getByLabel('Description');

    this.termsCheckbox = page.getByRole('checkbox', { name: /i accept the terms/i });

    this.termsLink = page.getByRole('link', { name: 'Terms and Conditions' });

    this.submitButton = page.getByRole('button', { name: 'Contact' }).last();
    this.allowAllCta = page.getByRole('button', { name: /^(allow all|permitir todas)$/i });
  }

  /** Gets the success message element. */
  get successMessage() {
    return this.form.locator('xpath=..').locator('.w-form-done');
  }
  /** Gets the failure message element. */
  get failureMessage() {
    return this.form.locator('xpath=..').locator('.w-form-fail');
  }

  /**
   * Navigates directly to the contact page.
   */
  async gotoDirect(): Promise<void> {
    await this.page.goto('/contact', { waitUntil: 'networkidle' });
  }

  /**
   * Accepts cookies if the consent dialog is visible.
   */
  async acceptCookiesIfPrompted(): Promise<void> {
    if (await this.allowAllCta.isVisible()) {
      await this.allowAllCta.click();
    }
  }

  /**
   * Asserts that the basic structure of the contact form is visible.
   * Checks for heading, form, inputs, checkbox, and submit button.
   */
  async assertBasicStructure(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.form).toBeVisible();

    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.purposeCombobox).toBeVisible();
    await expect(this.descriptionTextarea).toBeVisible();

    await expect(this.termsCheckbox).toBeAttached();

    await expect(this.page.getByText('I accept the Terms and').first()).toBeVisible();

    await expect(this.termsLink).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  /**
   * Retrieves the text content of all options in the Purpose combobox.
   * @returns An array of option strings.
   */
  async getPurposeOptionsText(): Promise<string[]> {
    const count = await this.purposeOptions.count();
    const values: string[] = [];
    for (let i = 0; i < count; i++) {
      values.push((await this.purposeOptions.nth(i).innerText()).trim());
    }
    return values;
  }
}
