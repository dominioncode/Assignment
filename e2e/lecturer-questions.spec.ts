import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth'

// Verify lecturer questions page shows questions when selecting CS105/CS106

test('lecturer sees questions for CS105 when selected', async ({ page }) => {
  // ensure we are authenticated as a lecturer so lecturer-only UI is visible
  await loginAs(page)
  await page.goto('http://localhost:3000/lecturer/questions')

  // ensure course select exists
  const select = page.locator('select.form-select')
  await expect(select).toBeVisible()

  // choose CS105 option
  await select.selectOption({ label: /CS105/ })
  // wait for UI to update and for any question cards to render
  await page.waitForSelector('.card .card-body .card-title, .card .card-body h6', { timeout: 2000 })

  // The page should display at least one question card when questions exist
  const questionCard = page.locator('.card .card-body .card-title, .card .card-body h6').first()
  await expect(questionCard).toBeVisible()
})
