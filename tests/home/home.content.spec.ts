import { test, expect } from '../../src/fixtures/pomFixtures';

test.describe('Home - Content & Core Business Validation', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
    await homePage.acceptCookiesIfPrompted();
  });

  test('2.1. Home – Servicios principales presentes y completos', async ({ homePage }) => {
    await expect(homePage.servicesSection).toBeVisible();

    const expectedServices = [
      'Holistic AI Strategy',
      'Custom Solutions Factory',
      'Talent as a Service',
    ];

    for (const service of expectedServices) {
      await expect(homePage.serviceTabs.filter({ hasText: service })).toBeVisible();
    }

    const count = await homePage.serviceTabs.count();
    expect(count).toBeGreaterThanOrEqual(3);

    for (let i = 0; i < count; i++) {
      const tab = homePage.serviceTabs.nth(i);
      const title = await tab.locator('h3').innerText();

      if (expectedServices.some((s) => title.includes(s))) {
        await tab.click();

        await expect(
          homePage.servicesSection.getByRole('link', { name: 'Discover' }).first(),
        ).toBeVisible();
      }
    }
  });

  test('2.1. Home – Success stories listadas', async ({ homePage }) => {
    await homePage.successStoriesSlider.scrollIntoViewIfNeeded();
    await expect(homePage.successStoriesSlider).toBeVisible();

    const slides = homePage.successStorySlides;
    await expect(slides.first()).toBeVisible();

    const expectedClients = ['Vensure', 'Viajes Anita'];

    for (const client of expectedClients) {
      await expect(homePage.successStoriesSlider.getByText(client).first()).toBeVisible();
    }

    await expect(
      homePage.successStoriesSlider.getByRole('link', { name: 'Read more' }).first(),
    ).toBeVisible();

    const firstStoryLink = homePage.successStoriesSlider
      .getByRole('link', { name: 'Read more' })
      .first();
    const href = await firstStoryLink.getAttribute('href');
    expect(href).toContain('/success-stories/');
  });

  test('2.2. Home – FAQ accordion básico', async ({ homePage }) => {
    await homePage.faqSection.scrollIntoViewIfNeeded();
    await expect(homePage.faqSection).toBeVisible();

    const questions = homePage.faqQuestions;
    const count = await questions.count();
    expect(count).toBeGreaterThan(0);

    const firstQuestion = questions.first();
    await firstQuestion.click();

    const answerText = homePage.faqAnswers.first();
    await expect(answerText).toBeVisible();
  });

  test('2.2. Home – Knowledge hub / Latest insights', async ({ homePage }) => {
    const isHidden = await homePage.insightsSection
      .getAttribute('class')
      .then((c) => c?.includes('hide'));
    if (isHidden) {
      test.skip(true, 'La sección Latest Insights está oculta en el HTML actual (clase "hide").');
      return;
    }

    await homePage.insightsSection.scrollIntoViewIfNeeded();
    await expect(homePage.insightsSection).toBeVisible();

    const expectedPosts = [
      'Hybrid intelligence vs. AI agent-washing',
      'How Virtual Agents Work',
      'Enhance Your Customer Experience',
    ];

    for (const post of expectedPosts) {
      await expect(homePage.insightCards.getByText(post, { exact: false })).toBeVisible();
    }

    const firstCard = homePage.insightCards.first();
    await expect(firstCard.getByRole('link', { name: 'Read more' })).toBeVisible();
  });

  test('2.2. Home – Newsletter subscription', async ({ homePage }) => {
    if (await homePage.newsletterCta.isVisible()) {
      await homePage.openNewsletterModal();
    }

    await expect(homePage.newsletterModal).toBeVisible();

    await expect(homePage.newsletterEmailInput).toBeVisible();
    await expect(homePage.newsletterTermsLabel).toBeVisible();

    await homePage.newsletterEmailInput.fill('test@example.com');
    await homePage.newsletterSubmit.click();

    const successMessage = homePage.newsletterModal.locator('.w-form-done');
    await expect(successMessage).not.toBeVisible();

    await homePage.toggleNewsletterTerms();
  });
});
