import { test, expect } from '../../src/fixtures/pomFixtures';

test.describe('Home - smoke (desktop)', () => {
  test('debe cargar con HTTP 200, sin errores de consola y mostrar elementos clave', async ({
    homePage,
    isMobile,
  }) => {
    const consoleErrors = await homePage.getConsoleErrorsDuring(async () => {
      const response = await homePage.goto('/');
      expect(response, 'response de la home no debe ser null').not.toBeNull();
      expect(response!.status(), 'status HTTP de la home').toBe(200);
    });

    expect(consoleErrors, 'errores de consola en la carga inicial').toEqual([]);

    await expect(homePage.logo, 'logo visible').toBeVisible();
    await expect(homePage.heroTitle, 'título principal del hero visible').toBeVisible();

    if (!isMobile) {
      await expect(homePage.primaryCta, 'CTA principal visible').toBeVisible();
    }

    await expect(
      homePage.servicesSectionTitle,
      'sección de servicios/soluciones visible',
    ).toBeVisible();

    await expect(
      homePage.successStoriesSectionTitle,
      'sección de casos de éxito visible',
    ).toBeVisible();

    await expect(homePage.faqSectionTitle, 'sección de FAQs visible').toBeVisible();
  });
});
