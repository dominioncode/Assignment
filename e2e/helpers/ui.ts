import type { Page, Locator } from '@playwright/test'

// Try to open the modal with the keyboard shortcut first, then fall back to
// clicking common 'create' buttons if the dialog doesn't appear.
export async function openCreateModal(page: Page, timeout = 8000): Promise<Locator> {
  const dialog = page.locator('role=dialog')

  // attempt keyboard shortcut first
  await page.keyboard.press('n')
  try {
    await dialog.waitFor({ state: 'visible', timeout })
    return dialog
  } catch (err) {
    // fallback: try a few likely selectors for a create/new button
    const candidates = [
      'button[aria-label="Create new assignment"]',
      'button[aria-label="Create assignment"]',
      'button[aria-label="Create or join a group"]',
      'button[aria-label="Create group"]',
      'button[aria-label*="Create"]',
      'button:has-text("New")',
      'button:has-text("Create Assignment")',
      'button:has-text("Create")',
    ]

    for (const s of candidates) {
      const el = page.locator(s).first()
      if ((await el.count()) > 0 && await el.isVisible()) {
        await el.click()
        await dialog.waitFor({ state: 'visible', timeout })
        return dialog
      }
    }

    // give up — let the caller handle the failure
    throw new Error('modal did not open via keyboard and no create button was found')
  }
}

export default { openCreateModal }
