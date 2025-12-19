import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { POST } from '../register/route'
import { getDb } from '../../../../../server/db'

let db: any

beforeAll(async () => {
  db = getDb()
  // Ensure tables exist and use a transaction to isolate test changes
  await db.migrate.latest()
})

afterAll(async () => {
  // nothing to cleanup here; real tests should rollback changes
})

describe('API /api/auth/register (route)', () => {
  it('should create a lecturer in lecturers table when role=lecturer', async () => {
    const payload = { email: `test_lect_${Date.now()}@example.com`, password: 'password', name: 'T Lecturer', role: 'lecturer' }
    const req = new Request('http://localhost/api/auth/register', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })

    const res = await POST(req as any)
    const json = await res.json()
    expect(res.status).toBe(201)
    expect(json.role).toBe('lecturer')

    const lecturer = await db('lecturers').where({ email: payload.email }).first()
    expect(lecturer).toBeTruthy()
    expect(lecturer.name).toBe(payload.name)

    // cleanup
    await db('lecturers').where({ email: payload.email }).del()
  })
})
