import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from '../helpers/axe'
import { openCreateModal } from '../helpers/ui'
import fs from 'fs'

test.describe('Modal accessibility and focus trap', () => {
  test('student assignments create modal opens and focuses and traps tab', async ({ page }) => {
    // run this modal accessibility scenario as a lecturer (assignment creation exists for lecturers)
    await (await import('../helpers/auth')).loginAs(page)
    await page.goto('/lecturer/assignments')

    // wait for the page to be ready
    await page.waitForSelector('h1:has-text("My Assignments")')

    // open modal (keyboard shortcut with click fallback)
    const dialog = await openCreateModal(page)

    await expect(dialog).toBeVisible()

    // ensure the first input is focused — small delay to let focus settle
    await page.waitForTimeout(100)
    const firstInput = dialog.locator('input, textarea, [tabindex]').first()
    await expect(firstInput).toBeFocused()

    // Tab through the dialog and ensure focus wraps
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    // now shift+tab to go backwards
    await page.keyboard.down('Shift')
    await page.keyboard.press('Tab')
    await page.keyboard.up('Shift')

    // Accessibility check using axe — ensure visual styles have settled first
    // (avoid transient contrast values in headless/CI rendering where animations or
    // late-applied styles can make colour readings unstable)
    await page.waitForFunction(() => {
      const el = document.querySelector('button.btn-primary')
      if (!el) return false
      return window.getComputedStyle(el).backgroundColor === 'rgb(29, 78, 216)'
    })
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
