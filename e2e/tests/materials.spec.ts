import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from '@axe-core/playwright'
import fs from 'fs'

test('Materials upload modal opens and passes accessibility checks', async ({ page }) => {
  await page.goto('/lecturer/materials')
  await page.waitForSelector('h1:has-text("Study Materials")')

  // open via 'n' keyboard shortcut
  await page.keyboard.press('n')

  const dialog = page.locator('role=dialog')
  await expect(dialog).toBeVisible()

  // ensure form elements exist
  await expect(dialog.locator('input[placeholder="Title"]')).toBeVisible()
  await expect(dialog.locator('input[type="file"]')).toBeVisible()

  // run accessibility check — record axe report on failure
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
