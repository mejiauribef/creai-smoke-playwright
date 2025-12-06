// tests/contact/contact.form-structure.spec.ts
import { test, expect } from '../../src/fixtures/pomFixtures';

test.describe('Contact - form structure & validation (shallow)', () => {
  test('estructura del formulario y opciones de Purpose', async ({ contactPage }) => {
    await contactPage.gotoDirect();
    await contactPage.assertBasicStructure();

    const options = await contactPage.getPurposeOptionsText();
    expect(options).toEqual([
      'Select one...',
      'Holistic AI Strategy',
      'Custom AI Solutions Factory',
      'Talent as a Service',
    ]);
  });

  test('no debería permitir enviar sin aceptar T&C (si hay validación de frontend)', async ({
    contactPage,
  }) => {
    await contactPage.gotoDirect();
    await contactPage.acceptCookiesIfPrompted();
    await contactPage.assertBasicStructure();

    await contactPage.nameInput.fill('Test User');
    await contactPage.emailInput.fill('test@example.com');

    await contactPage.purposeCombobox.selectOption('Holistic AI Strategy');

    await contactPage.descriptionTextarea.fill('Some description for testing.');

    await contactPage.submitButton.click();

    await expect(contactPage.page).toHaveURL(/.*contact/);
  });
});
