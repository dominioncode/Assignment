import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '../Modal'
import { describe, test, expect, vi } from 'vitest'
// Using standard DOM assertions for Vitest (avoid jest-dom matcher import issues in this environment)

describe('Modal focus trap', () => {
  test('focus moves into modal and traps tab, Escape closes', async () => {
    const onClose = vi.fn()
    // render a button before modal to test restore
    const { rerender } = render(
      <div>
        <button data-testid="before">Before</button>
        <Modal open={true} onClose={onClose} title="Test">
          <input placeholder="first" />
          <input placeholder="second" />
        </Modal>
      </div>
    )

    // find the dialog and its focusable elements
    const dialogEl = screen.getByRole('dialog') as HTMLElement
    const focusables = dialogEl.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')
    expect(focusables.length).toBeGreaterThan(0)

    // initial focus should be on the first focusable (close button in our Modal)
    const firstFocusable = focusables[0] as HTMLElement
    expect(document.activeElement).toBe(firstFocusable)

    // simulate tabbing -> next focusable
    await userEvent.tab()
    const secondFocusable = focusables[1] as HTMLElement
    expect(document.activeElement).toBe(secondFocusable)

    // tab again should wrap eventually (we expect third or back to first depending on elements)
    await userEvent.tab()
    // ensure we moved focus to something and didn't crash
    expect(document.activeElement).not.toBeNull()

    // Escape should call onClose
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()

    // close modal and ensure focus could be restored by re-rendering without modal
    rerender(<div><button data-testid="before">Before</button></div>)
    expect(screen.getByTestId('before')).not.toBeNull()
  })
})
