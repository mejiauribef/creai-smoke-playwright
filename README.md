# Creai Smoke & Regression Testing Framework

This repository contains an automated testing framework for [Creai.mx](https://www.creai.mx/es-mx) built with **Playwright** and **TypeScript**. It is designed to perform smoke testing, content validation, and regression testing across Desktop and Mobile environments.

## 🚀 Features

- **Page Object Model (POM):** Modular and reusable page objects located in `src/pages`.
- **Custom Fixtures:** Dependency injection for Page Objects via `pomFixtures` for cleaner test files.
- **Multi-Environment Support:** Pre-configured projects for **Desktop Chrome** and **Mobile (Pixel 7)**.
- **Robust Handling:**
  - Automatic Cookie Banner acceptance.
  - Mobile Hamburger Menu interaction handling.
  - Dynamic content validation (Services, Success Stories, FAQs).
- **Clean Code:** Optimized for readability and maintenance.

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **npm** (usually installed with Node.js)

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd creai-smoke-playwright
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

## 📂 Project Structure

```
creai-smoke-playwright/
├── src/
│   ├── fixtures/
│   │   └── pomFixtures.ts    # Custom test fixtures (dependency injection)
│   └── pages/
│       ├── HomePage.ts       # Page Object for Home Page
│       └── ContactPage.ts    # Page Object for Contact Page
├── tests/
│   ├── contact/
│   │   └── contact.validation.spec.ts  # Contact form validation tests
│   └── home/
│       ├── home.content.spec.ts        # Content verification (Services, FAQ, etc.)
│       ├── home.mobile.spec.ts         # Mobile-specific tests (Hamburger menu)
│       └── home.smoke.spec.ts          # Basic smoke tests (Load, HTTP 200, Critical elements)
├── playwright.config.ts      # Main Playwright configuration
├── package.json              # Scripts and dependencies
└── README.md                 # Project documentation
```

## ⚙️ Configuration

The framework is configured in `playwright.config.ts`:
- **Base URL:** `https://www.creai.mx/es-mx`
- **Timeouts:** 30s global timeout, 5s expect timeout.
- **Projects:**
  - `chromium-desktop`: Standard Desktop Chrome viewport.
  - `chromium-mobile`: Emulates a **Pixel 7** device.

## ▶️ Running Tests

### Run All Tests
Executes all tests across all configured projects (Desktop & Mobile).
```bash
npm test
# or
npx playwright test
```

### Run Specific Project
To run tests only for Desktop or Mobile:
```bash
npx playwright test --project=chromium-desktop
npx playwright test --project=chromium-mobile
```

### Run Specific Test File
```bash
npx playwright test tests/home/home.mobile.spec.ts
```

### Run in UI Mode (Interactive)
Opens the Playwright UI runner for debugging and time-traveling.
```bash
npm run test:ui
```

### Run in Headed Mode
Watch the browser execute actions in real-time.
```bash
npm run test:headed
```

## 📊 Reporting

After the test run completes, an HTML report is generated automatically.

To view the report manually:
```bash
npm run report
```

## 🧩 Key Components

### Page Objects
Located in `src/pages/`. These classes encapsulate the logic and locators for specific pages.
- **HomePage:** Handles navigation, cookie banner, hero section, services tabs, success stories slider, FAQ, and newsletter.
- **ContactPage:** Handles the contact form, input validation, and terms checkbox interaction.

### Fixtures
Located in `src/fixtures/pomFixtures.ts`.
We extend the base `test` object to include our Page Objects (`homePage`, `contactPage`) and a helper flag `isMobile`. This allows tests to request these objects directly in the arguments.

**Example Usage:**
```typescript
import { test, expect } from '../../src/fixtures/pomFixtures';

test('Example Test', async ({ homePage, isMobile }) => {
  await homePage.goto();
  if (isMobile) {
    // Mobile specific logic
  }
  await expect(homePage.heroTitle).toBeVisible();
});
```

## 📱 Mobile Testing Strategy
The framework specifically handles mobile responsiveness:
- **Viewport:** Emulated Pixel 7.
- **Navigation:** Handles the "Hamburger Menu" interaction which is only visible on mobile.
- **Locators:** Uses robust locators that work across breakpoints or specific mobile locators when necessary.

