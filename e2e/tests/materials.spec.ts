import { test, expect } from '@playwright/test'
import { loginAs } from '../helpers/auth'
import { injectAxe, checkA11y } from '../helpers/axe'
import { openCreateModal } from '../helpers/ui'
import fs from 'fs'

test('Materials upload modal opens and passes accessibility checks', async ({ page }) => {
  // must be a lecturer to upload materials
  await loginAs(page)
  await page.goto('/lecturer/materials')
  await page.waitForSelector('h1:has-text("Study Materials")')

  // open modal (keyboard shortcut + fallback)
  const dialog = await openCreateModal(page)
  await expect(dialog).toBeVisible()

  // ensure form elements exist
  await expect(dialog.locator('input[placeholder="Title"]')).toBeVisible()
  await expect(dialog.locator('input[type="file"]')).toBeVisible()

  // run accessibility check — record axe report on failure
  // wait for final styles to be applied to primary button and placeholders
  await page.waitForFunction(() => {
    const el = document.querySelector('button.btn-primary')
    if (!el) return false
    return window.getComputedStyle(el).backgroundColor === 'rgb(29, 78, 216)'
  })
  await injectAxe(page)
  try {
    await checkA11y(page, undefined, { detailedReport: true })
  } catch (err) {
    const axeResult = await page.evaluate(async () => await (window as any).axe.run())
    await fs.promises.mkdir('playwright-report/axe', { recursive: true })
    await fs.promises.writeFile('playwright-report/axe/materials-axe.json', JSON.stringify(axeResult, null, 2))
    throw err
  }

  // close modal
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})
