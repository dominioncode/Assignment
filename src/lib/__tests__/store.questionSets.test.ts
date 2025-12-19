import { describe, test, expect, beforeEach } from 'vitest'
import { useAppStore } from '../store'

// reset store between tests
beforeEach(() => {
  // reset to default seed data by re-importing store file (it's module-scoped)
  // Not straightforward to fully reset zustand in tests; use setState to clean
  useAppStore.setState({
    questionSets: [],
  })
})

describe('App store questionSets', () => {
  test('add/update/delete question set works', () => {
    const id = 'qset-1'
    const qs = { id, title: 'Test Set', description: 'desc', courseId: 'CS101', questions: [], totalMarks: 10 }
    useAppStore.getState().addQuestionSet(qs as any)
    const found = useAppStore.getState().questionSets.find((s) => s.id === id)
    expect(found).toBeTruthy()

    useAppStore.getState().updateQuestionSet(id, { title: 'New Title' })
    const updated = useAppStore.getState().questionSets.find((s) => s.id === id)
    expect(updated?.title).toBe('New Title')

    useAppStore.getState().deleteQuestionSet(id)
    const removed = useAppStore.getState().questionSets.find((s) => s.id === id)
    expect(removed).toBeUndefined()
  })
})
