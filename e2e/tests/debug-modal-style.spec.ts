import { test } from '@playwright/test'

test('debug modal computed styles', async ({ page }) => {
  // login as lecturer to ensure create modal is available
    // ensure we have a lecturer session so the create button is visible on this page
    await (await import('../helpers/auth')).loginAs(page)
  await page.goto('/lecturer/assignments')
  // open the create modal (lecturer view uses aria-label="Create assignment")
  await page.click('button[aria-label="Create assignment"]')
  // wait for dialog to be visible
  const dialog = page.locator('div[role="dialog"]')
  await dialog.waitFor({ state: 'visible' })

  const placeholderColor = await page.$eval('input[placeholder="Title"]', (el) => {
    // read computed style for placeholder pseudo-element
    // @ts-ignore - DOM getComputedStyle supports pseudoElement arg in browser
    return window.getComputedStyle(el, '::placeholder').color
  })

  const cancelColor = await page.$eval('button.btn-outline-secondary', (el) => {
    return window.getComputedStyle(el).color
  })

  const createBg = await page.$eval('button.btn-primary', (el) => {
    return window.getComputedStyle(el).backgroundColor
  })

  console.log('placeholderColor=', placeholderColor)
  console.log('cancelColor=', cancelColor)
  console.log('createBg=', createBg)
})
