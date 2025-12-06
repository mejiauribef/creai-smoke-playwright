// tests/contact/contact.aria-snapshot.spec.ts
import { test, expect } from '../../src/fixtures/pomFixtures';

test.describe('Contact - ARIA snapshot (regresión estructural)', () => {
  test('estructura accesible del formulario de contacto', async ({ contactPage, page }) => {
    await contactPage.gotoDirect();

    await expect(page.getByRole('form', { name: 'Contact Form' })).toMatchAriaSnapshot(`
      - form "Contact Form":
        - text: ""
        - textbox "Name*":
          - /placeholder: Name
        - text: ""
        - textbox "Email*":
          - /placeholder: example@email.com
        - text: ""
        - combobox "Purpose*":
          - option "Select one..." [selected]
          - option "Holistic AI Strategy"
          - option "Custom AI Solutions Factory"
          - option "Talent as a Service"
        - text: Description*
        - textbox "Description*":
          - /placeholder: Max 400 characters
        - checkbox "I accept the Terms and Conditions"
        - text: I accept the
        - link "Terms and Conditions":
          - /url: /privacy-notice
        - button "Contact"
    `);
  });
});
