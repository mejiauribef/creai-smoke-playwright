import { test, expect } from '../../src/fixtures/pomFixtures';

test.describe('Contact - Advanced Validation', () => {
  test.beforeEach(async ({ contactPage }) => {
    await contactPage.gotoDirect();
    await contactPage.acceptCookiesIfPrompted();
  });

  test('Validación de email inválido', async ({ contactPage }) => {
    await contactPage.nameInput.fill('Test User');
    await contactPage.purposeCombobox.selectOption({ index: 1 });
    await contactPage.descriptionTextarea.fill('Testing invalid email validation.');

    await contactPage.emailInput.fill('not-an-email');

    await contactPage.submitButton.click();

    await expect(contactPage.page).toHaveURL(/.*contact/);

    const emailField = contactPage.emailInput;

    const validationMessage = await emailField.evaluate(
      (e: HTMLInputElement) => e.validationMessage,
    );
    expect(validationMessage).not.toBe('');
  });

  test('Campos requeridos - Submit con todo vacío', async ({ contactPage }) => {
    await contactPage.submitButton.click();

    await expect(contactPage.page).toHaveURL(/.*contact/);

    const requiredFields = [
      contactPage.nameInput,
      contactPage.emailInput,
      contactPage.descriptionTextarea,
    ];

    for (const field of requiredFields) {
      const isInvalid = await field.evaluate((e: HTMLInputElement) => !e.checkValidity());
      expect(isInvalid, `Field should be invalid`).toBe(true);
    }
  });

  test('Success Path (Mocked) - Mensaje de éxito en DOM', async ({ contactPage }) => {
    await expect(contactPage.successMessage).toBeAttached();
    await expect(contactPage.successMessage).toBeHidden();

    await expect(contactPage.failureMessage).toBeAttached();
    await expect(contactPage.failureMessage).toBeHidden();
  });
});
