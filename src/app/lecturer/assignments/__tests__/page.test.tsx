import React from 'react'
import { render, screen } from '@testing-library/react'
import { expect } from 'vitest'
import matchers from '@testing-library/jest-dom/matchers'

// register the jest-dom matchers with Vitest's expect
expect.extend(matchers)

let LecturerAssignmentsPage: any

describe('LecturerAssignmentsPage access control', () => {
  afterEach(() => vi.resetModules())

  it('shows Create Assignment button for lecturer', async () => {
    vi.doMock('@/lib/useAuth', () => ({ default: () => ({ user: { id: 'u1', email: 't@x', role: 'lecturer' }, fetchWithAuth: undefined }) }))
    LecturerAssignmentsPage = (await import('../page')).default
    render(<LecturerAssignmentsPage />)
    const btn = await screen.findByLabelText(/Create assignment/i)
    expect(btn).toBeInTheDocument()
    expect(btn).toBeVisible()
  })

  it('hides Create Assignment button for non-lecturer', async () => {
    vi.doMock('@/lib/useAuth', () => ({ default: () => ({ user: { id: 'u2', email: 's@x', role: 'student' }, fetchWithAuth: undefined }) }))
    LecturerAssignmentsPage = (await import('../page')).default
    render(<LecturerAssignmentsPage />)
    const btn = screen.queryByLabelText(/Create assignment/i)
    // when hidden via the "hidden" attribute, it is still present but not visible; the page hides it, so assert it's not visible
    if (btn) expect(btn).not.toBeVisible()
    else expect(btn).toBeNull()
  })
})
