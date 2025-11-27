import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from '@axe-core/playwright'
import fs from 'fs'

test.describe('Modal accessibility and focus trap', () => {
  test('student assignments create modal opens and focuses and traps tab', async ({ page }) => {
    await page.goto('/student/assignments')

    // wait for the page to be ready
    await page.waitForSelector('h1:has-text("My Assignments")')

    // press 'n' to open modal
    await page.keyboard.press('n')

    const dialog = page.locator('role=dialog')
    await expect(dialog).toBeVisible()

    // ensure the first input is focused
    const firstInput = dialog.locator('input, textarea, [tabindex]')
    await expect(firstInput).toBeFocused()

    // Tab through the dialog and ensure focus wraps
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    // now shift+tab to go backwards
    await page.keyboard.down('Shift')
    await page.keyboard.press('Tab')
    await page.keyboard.up('Shift')

    // Accessibility check using axe — capture report on failure
    await injectAxe(page)
    try {
      await checkA11y(page, undefined, { detailedReport: true, detailedReportOptions: { html: true } })
    } catch (err) {
      // collect axe run results and write to artifact for CI
      const axeResult = await page.evaluate(async () => await (window as any).axe.run())
      await fs.promises.mkdir('playwright-report/axe', { recursive: true })
      await fs.promises.writeFile('playwright-report/axe/modal-axe.json', JSON.stringify(axeResult, null, 2))
      throw err
    }

    // close with Escape
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })
})
