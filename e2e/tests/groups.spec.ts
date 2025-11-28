import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from '@axe-core/playwright'
import fs from 'fs'

test('Lecturer create group modal opens and accessible', async ({ page }) => {
  await page.goto('/lecturer/groups')
  await page.waitForSelector('h1:has-text("Manage Groups")')

  // open via create button
  await page.locator('button:has-text("Create Group")').click()

  const dialog = page.locator('role=dialog')
  await expect(dialog).toBeVisible()

  // focus should be inside the modal
  await expect(dialog.locator('input[placeholder="Group name"]')).toBeVisible()

  await injectAxe(page)
  try {
    await checkA11y(page)
  } catch (err) {
    const axeResult = await page.evaluate(async () => await (window as any).axe.run())
    await fs.promises.mkdir('playwright-report/axe', { recursive: true })
    await fs.promises.writeFile('playwright-report/axe/groups-lecturer-axe.json', JSON.stringify(axeResult, null, 2))
    throw err
  }

  // close
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})

test('Student create/join group modal opens with keyboard shortcut n', async ({ page }) => {
  await page.goto('/student/groups')
  await page.waitForSelector('h1:has-text("My Groups")')

  await page.keyboard.press('n')

  const dialog = page.locator('role=dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('input[placeholder="Group name"]')).toBeVisible()

  await injectAxe(page)
  try {
    await checkA11y(page)
  } catch (err) {
    const axeResult = await page.evaluate(async () => await (window as any).axe.run())
    await fs.promises.mkdir('playwright-report/axe', { recursive: true })
    await fs.promises.writeFile('playwright-report/axe/groups-student-axe.json', JSON.stringify(axeResult, null, 2))
    throw err
  }
})
