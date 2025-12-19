import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'email and password are required' }, { status: 400 })
  }

  try {
    const bcryptModule = await import('bcryptjs')
    const bcrypt = bcryptModule.default || bcryptModule
    const jwtModule: any = await import('jsonwebtoken')
    const jwt = jwtModule.default || jwtModule
    const knexModule = await import('../../../../../server/db')
    const db = knexModule.getDb()

    // Try to find lecturer first
    let user = await db('lecturers').where({ email }).first()
    let userRole = 'lecturer'

    // If not a lecturer, try students table
    if (!user) {
      user = await db('students').where({ email }).first()
      userRole = user?.role || 'student'
    }

    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const JWT_SECRET = process.env.JWT_SECRET || 'secret_key'
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

    const token = jwt.sign({ id: user.id, role: userRole, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    })

    return NextResponse.json({ token, role: userRole })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
