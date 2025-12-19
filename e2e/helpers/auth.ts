import type { Page } from '@playwright/test'

export async function loginAs(page: Page, email = 'lecturer@example.com', password = 'demo123') {
  // Attempt to login via backend auth endpoint and place token in localStorage.
  // We write the token both using addInitScript (for future navigations) and directly
  // into the current page's localStorage so callers don't need to force a reload.
  const base = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000'
  // prefer the Next app API route (works without a separate backend process); fall back
  // to the backend login endpoint when configured
  const appLoginUrl = new URL('/api/auth/login', base).toString()
  const fallbackLoginUrl = process.env.E2E_AUTH_URL || 'http://localhost:4000/login'

  // try the app route first
  let res = await page.request.post(appLoginUrl, { data: { email, password } })
  if (!res.ok()) {
    // fallback to the backend server login path
    res = await page.request.post(fallbackLoginUrl, { data: { email, password } })
  }
  if (!res.ok()) {
    const text = await res.text().catch(() => '')
    throw new Error(`login failed for ${email} (status ${res.status}) ${text}`)
  }

  const body = await res.json()
  const token = body.token
  if (!token) throw new Error('no token received from login')

  // ensure subsequent navigations get the token
  await page.addInitScript((t: string) => {
    // eslint-disable-next-line no-undef
    localStorage.setItem('auth_token', t)
  }, token)

  // Also set it on the currently-loaded page so tests don't need to navigate away
  try {
    await page.evaluate((t: string) => localStorage.setItem('auth_token', t), token)
  } catch (e) {
    // ignore eval issues if page context isn't available yet
  }

  // If we're not already at base URL, navigate there so pages pick up the token
  if (page.url().startsWith(base) === false) await page.goto(base)

  return token
}

export default { loginAs }
