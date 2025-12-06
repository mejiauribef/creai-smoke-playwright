import { test, expect } from '../../src/fixtures/pomFixtures';

test.describe('Home - Mobile Smoke', () => {
  test.skip(({ isMobile }) => !isMobile, 'This test suite is for mobile only');

  test.beforeEach(async ({ homePage }) => {
    await homePage.goto('/');
    await homePage.acceptCookiesIfPrompted();
  });

  test('Smoke: Logo y Hero visibles', async ({ homePage }) => {
    await expect(homePage.logo, 'Logo debe ser visible').toBeVisible();
    await expect(homePage.heroTitle, 'Hero title debe ser visible').toBeVisible();
    
    await expect(homePage.heroTitle).toBeInViewport();
  });

  test('Menú hamburguesa: funcionamiento y navegación', async ({ homePage, page }) => {
    await expect(homePage.navMenuButton, 'Botón hamburguesa debe ser visible').toBeVisible();
    
    const firstLink = homePage.navLinks.first();
    await expect(firstLink, 'Links del menú no deben ser visibles inicialmente').not.toBeVisible();

    const menuIcon = homePage.navMenuButton.locator('.menu-icon1');
    await menuIcon.click({ force: true });

    await expect(homePage.navMenuButton).toHaveClass(/w--open/);

    await expect(homePage.mobileNavOverlay).toBeVisible();
    
    await expect(homePage.navLinks.first()).toBeVisible();

    await homePage.mobileMenuContact.click();

    await expect(page).toHaveURL(/.*\/contact/);
  });
});
