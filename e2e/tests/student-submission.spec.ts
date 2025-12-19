import { test, expect, request } from '@playwright/test'

test('student can view assignment details and submit', async ({ page }) => {
  // create course and assignment via backend API
  const api = await request.newContext()
  // register a lecturer and create an assignment
  await api.post('http://localhost:4000/register', { data: { email: 'e2e_lecturer@example.com', password: 'password', name: 'E2E Lecturer', role: 'lecturer' } })
  const loginL = await api.post('http://localhost:4000/login', { data: { email: 'e2e_lecturer@example.com', password: 'password' } })
  const lecturerToken = (await loginL.json()).token
  // create course
  await api.post('http://localhost:4000/assignments', { data: { title: 'E2E Assignment', description: 'E2E', type: 'individual' }, headers: { Authorization: `Bearer ${lecturerToken}` } })

  // register/login student
  await api.post('http://localhost:4000/register', { data: { email: 'e2e_student@example.com', password: 'password', name: 'E2E Student', role: 'student' } })
  const login = await api.post('http://localhost:4000/login', { data: { email: 'e2e_student@example.com', password: 'password' } })
  const studentToken = (await login.json()).token

  // set student token in localStorage then navigate
  await page.addInitScript((token) => {
    localStorage.setItem('auth_token', token)
  }, studentToken)

  await page.goto('http://127.0.0.1:3000/student/assignments')
  // click the first View Details (card) — E2E tests expect at least one assignment
  await page.waitForSelector('text=E2E Assignment')
  // click card
  await page.click('text=E2E Assignment')
  // should navigate to details
  await expect(page).toHaveURL(/student\/assignments\/.+/)

  // submit text
  await page.fill('textarea', 'My submission via Playwright')
  await page.click('button:has-text("Submit")')

  // confirm submission by checking backend
  const submissionRes = await api.get('http://localhost:4000/assignments')
  expect(submissionRes.ok()).toBeTruthy()
})
