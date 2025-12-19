import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LecturerQuestionSetsPage from '../page'

describe('Lecturer question sets page', () => {
  it('renders header', () => {
    render(<LecturerQuestionSetsPage />)
    expect(screen.getByText(/Question Sets/i)).toBeTruthy()
  })
})
