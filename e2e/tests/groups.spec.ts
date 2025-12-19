import { test, expect } from '@playwright/test'
import { loginAs } from '../helpers/auth'
import { injectAxe, checkA11y } from '../helpers/axe'
import { openCreateModal } from '../helpers/ui'
import fs from 'fs'

test('Lecturer create group modal opens and accessible', async ({ page }) => {
  // login as lecturer so the create button is visible
  await loginAs(page)
  await page.goto('/lecturer/groups')
  await page.waitForSelector('h1:has-text("Manage Groups")')

  // open via create button
  await page.locator('button:has-text("Create Group")').click()

  const dialog = page.locator('role=dialog')
  await expect(dialog).toBeVisible()

  // focus should be inside the modal
  await expect(dialog.locator('input[placeholder="Group name"]')).toBeVisible()

  // wait for final styles to settle (avoid transient/animated colours in headless environments)
  await page.waitForFunction(() => {
    const el = document.querySelector('button.btn-primary')
    if (!el) return false
    return window.getComputedStyle(el).backgroundColor === 'rgb(29, 78, 216)'
  })
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

  const dialog = await openCreateModal(page)
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('input[placeholder="Group name"]')).toBeVisible()

  await page.waitForFunction(() => {
    const el = document.querySelector('button.btn-primary')
    if (!el) return false
    return window.getComputedStyle(el).backgroundColor === 'rgb(29, 78, 216)'
  })
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
