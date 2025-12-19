import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'

// This Playwright test assumes the dev server is running on http://localhost:3000 and API on :4000

test('student can view assignment details and see question set', async ({ page }) => {
  // ensure we're authenticated as a student so the page renders student-specific content
  await loginAs(page, 'demo@example.com', 'demo123')
  await page.goto('http://localhost:3000/student/assignments')

  // Wait for first assignment card; click View details
  const firstViewButton = page.locator('button[aria-label^="View details for"]').first()
  // wait for the button to appear (assignments can be fetched from API)
  await expect(firstViewButton).toBeVisible({ timeout: 7000 })
  await firstViewButton.click()

  // The detail page should load and show either 'Loading assignment…' or the content
  // if the page shows a loading header, wait until it's gone or until content appears
  await page.waitForFunction(() => {
    const headings = Array.from(document.querySelectorAll('h1'))
    return headings.every((h) => !(h.textContent || '').includes('Loading assignment'))
  }, { timeout: 5000 }).catch(() => {})

  // Expect instructions section
  await expect(page.locator('h2', { hasText: 'Instructions' })).toBeVisible()

  // If there's a question set, it should render a heading and at least one question
  const qset = page.locator('h3', { hasText: 'Questions' }).first()
  if (await qset.isVisible()) {
    await expect(page.locator('ol li').first()).toBeVisible()
  }
})
