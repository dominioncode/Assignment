import { NextResponse } from 'next/server'

async function verifyToken(token: string | undefined) {
  if (!token) return null
  try {
    const jwt: any = await import('jsonwebtoken')
    const JWT_SECRET = process.env.JWT_SECRET || 'secret_key'
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  } catch (err) {
    return null
  }
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/i, '')
  const decoded: any = await verifyToken(token)
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const knexModule = await import('../../../../../server/db')
    const db = knexModule.getDb()
    // Fetch from appropriate table based on role
    let user: any
    if (decoded.role === 'lecturer') {
      user = await db('lecturers').where({ id: decoded.id }).first()
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
      delete user.password_hash
      return NextResponse.json({ user: { ...user, role: 'lecturer' } })
    }

    user = await db('students').where({ id: decoded.id }).first()
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    delete user.password_hash
    return NextResponse.json({ user: { ...user, role: user.role || 'student' } })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
