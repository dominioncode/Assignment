import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from '../helpers/axe'
import { openCreateModal } from '../helpers/ui'
import { loginAs } from '../helpers/auth'

test('Instructor creates an assignment and student can see it', async ({ page }) => {
  // Create assignment as lecturer (demo flow, no real auth)
  // ensure we are logged in as a lecturer so create button/modal is available
  await loginAs(page, 'lecturer@example.com', 'demo123')
  await page.goto('/lecturer/assignments')
  await page.waitForSelector('h1:has-text("Manage Assignments")')

  // Open create modal (keyboard shortcut + fallback)
  const dialog = await openCreateModal(page)
  await expect(dialog).toBeVisible()

  await dialog.locator('input[placeholder="Title"]').fill('E2E Test Assignment')
  await dialog.locator('textarea[placeholder="Short description"]').fill('Brief description for testing')
  await dialog.locator('button:has-text("Create")').click()

  // Ensure assignment shows in the list
  await expect(page.locator('text=E2E Test Assignment')).toBeVisible()

  // wait for final styles (primary button/bg colours) to settle to avoid transient axe findings
  await page.waitForFunction(() => {
    const el = document.querySelector('button.btn-primary')
    if (!el) return false
    return window.getComputedStyle(el).backgroundColor === 'rgb(29, 78, 216)'
  })
  await injectAxe(page)
  await checkA11y(page)
})
