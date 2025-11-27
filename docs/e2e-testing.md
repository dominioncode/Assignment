End-to-end & accessibility tests (Playwright)
=============================================

This project includes Playwright E2E tests with accessibility checks (axe) to catch regressions.

Run locally:

1. Install dev dependencies (includes Playwright test runner):

   npm install

2. Build (recommended) and run tests:

   npm run build
   npx playwright install
   npm run test:e2e

Notes:
- Tests expect the site to be available at http://127.0.0.1:3000 which Playwright will start automatically via the configured webServer in `playwright.config.ts`.
- Tests include an accessibility check via `@axe-core/playwright` — failures will surface in the test output.
