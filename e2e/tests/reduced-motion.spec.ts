import { test, expect } from '@playwright/test'

test('Reduced-motion toggle toggles class on html element', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('header')

  // find the reduced motion toggle button
  const toggle = page.locator('button[title^="Reduced motion"]')
  await expect(toggle).toBeVisible()

  // read initial state (may be present or not)
  const before = await page.evaluate(() => document.documentElement.classList.contains('reduce-motion'))

  // click toggle
  await toggle.click()

  const after = await page.evaluate(() => document.documentElement.classList.contains('reduce-motion'))
  // Expect a state change
  expect(after).toBe(!before)

  // click again to toggle back
  await toggle.click()
  const finalState = await page.evaluate(() => document.documentElement.classList.contains('reduce-motion'))
  expect(finalState).toBe(before)
})
