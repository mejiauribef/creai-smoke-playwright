// tests/contact/contact.navigation.spec.ts
import { test, expect } from '../../src/fixtures/pomFixtures';

test.describe('Contact - navigation', () => {
  test('desde home se puede navegar al formulario de contacto', async ({
    homePage,
    contactPage,
    page,
  }) => {
    const response = await homePage.goto('/');
    expect(response, 'response de la home no debe ser null').not.toBeNull();
    expect(response!.status(), 'status HTTP de la home').toBe(200);

    await homePage.acceptCookiesIfPrompted();
    await homePage.clickNavItemByText('Contact');

    await expect(page).toHaveURL(/\/contact$/);

    await contactPage.assertBasicStructure();
  });
});
