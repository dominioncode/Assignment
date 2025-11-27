import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'email and password are required' }, { status: 400 })
  }

  try {
    const bcrypt = await import('bcryptjs')
    const jwt: any = await import('jsonwebtoken')
    const knexModule = await import('../../../../../server/db')
    const db = knexModule.getDb()

    const user = await db('students').where({ email }).first()
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const JWT_SECRET = process.env.JWT_SECRET || 'secret_key'
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    })

    return NextResponse.json({ token })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
