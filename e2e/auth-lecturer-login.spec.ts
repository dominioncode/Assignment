import { test, expect } from '@playwright/test'

// e2e: register a new lecturer via the UI and login

test('can register and login as lecturer via UI', async ({ page }) => {
  await page.goto('http://localhost:3000/auth/register')

  await page.fill('input[name="name"]', 'E2E Lecturer')
  const email = `e2e_lecturer_${Date.now()}@example.com`
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', 'password')

  // select Lecturer
  await page.selectOption('select[name="role"]', 'lecturer')

  await page.click('button:has-text("Register")')

  // after register, login should happen automatically and redirect
  await page.waitForURL('**/lecturer/assignments', { timeout: 5000 })
  await expect(page).toHaveURL(/\/lecturer\/assignments/)
})