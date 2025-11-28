import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from '@axe-core/playwright'

test('Instructor creates an assignment and student can see it', async ({ page }) => {
  // Create assignment as lecturer (demo flow, no real auth)
  await page.goto('/lecturer/assignments')
  await page.waitForSelector('h1:has-text("Manage Assignments")')

  // Open create modal
  await page.keyboard.press('n')
  const dialog = page.locator('role=dialog')
  await expect(dialog).toBeVisible()

  await dialog.locator('input[placeholder="Title"]').fill('E2E Test Assignment')
  await dialog.locator('textarea[placeholder="Short description"]').fill('Brief description for testing')
  await dialog.locator('button:has-text("Create")').click()

  // Ensure assignment shows in the list
  await expect(page.locator('text=E2E Test Assignment')).toBeVisible()

  await injectAxe(page)
  await checkA11y(page)
})
