import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AssignmentCard from '../AssignmentCard'
import { describe, test, expect, vi } from 'vitest'

const sample = {
  id: 'a1',
  title: 'Test Assignment',
  description: 'Test desc',
  type: 'individual',
  courseId: 'CS101',
  dueDate: new Date(),
  submissionDeadline: new Date(),
  totalMarks: 10,
  instructions: 'Do this',
  attachments: [],
  createdBy: 'lecturer-1',
}

describe('AssignmentCard', () => {
  test('calls onClick when View Details is clicked and does not double fire', async () => {
    const handler = vi.fn()
    render(<AssignmentCard assignment={sample as any} onClick={handler} />)

    const btn = screen.getByRole('button', { name: /View details for Test Assignment/i })
    await userEvent.click(btn)
    expect(handler).toHaveBeenCalledTimes(1)
  })

  test('clicking the card body also triggers onClick', async () => {
    const handler = vi.fn()
    const { container } = render(<AssignmentCard assignment={sample as any} onClick={handler} />)

    // click on the card area (container has .card)
    const card = container.querySelector('.card') as HTMLElement
    await userEvent.click(card)
    expect(handler).toHaveBeenCalledTimes(1)
  })
})
