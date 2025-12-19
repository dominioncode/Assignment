import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, password, name, class: studentClass, role } = await req.json()
  if (!email || !password || !name) {
    return NextResponse.json({ error: 'email, password and name are required' }, { status: 400 })
  }

  try {
    const bcryptModule = await import('bcryptjs')
    const bcrypt = bcryptModule.default || bcryptModule
    const knexModule = await import('../../../../../server/db')
    const db = knexModule.getDb()
    const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10)

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
    // If role is lecturer, insert into `lecturers` table
    if (role === 'lecturer') {
      const [id] = await db('lecturers').insert({
        email,
        password_hash: hashedPassword,
        name,
        department: null,
        title: null,
        created_by: null,
      })
      return NextResponse.json({ id, role: 'lecturer' }, { status: 201 })
    }

    const [id] = await db('students').insert({
      email,
      password_hash: hashedPassword,
      name,
      class: studentClass || null,
      role: role || 'student',
    })

    return NextResponse.json({ id, role: role || 'student' }, { status: 201 })
  } catch (err: any) {
    console.error(err)
    // support both sqlite and mysql duplicate key errors
    if (err && (err.code === 'SQLITE_CONSTRAINT' || err.code === 'ER_DUP_ENTRY')) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
