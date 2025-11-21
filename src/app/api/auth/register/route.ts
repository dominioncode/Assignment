import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, password, name, class: studentClass, role } = await req.json()
  if (!email || !password || !name) {
    return NextResponse.json({ error: 'email, password and name are required' }, { status: 400 })
  }

  try {
    const bcrypt = await import('bcrypt')
    const knexModule = await import('../../../../server/db')
    const db = knexModule.db
    const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10)

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
    const [id] = await db('students').insert({
      email,
      password_hash: hashedPassword,
      name,
      class: studentClass || null,
      role: role || 'student',
    })

    return NextResponse.json({ id }, { status: 201 })
  } catch (err: any) {
    console.error(err)
    if (err && err.code === 'SQLITE_CONSTRAINT') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
