exports.seed = async function (knex) {
  // Deletes ALL existing entries and inserts demo users
  await knex('students').del()
  const bcrypt = require('bcryptjs')
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10)
  const users = [
    { email: 'demo@example.com', password: 'demo123', name: 'Demo Student', role: 'student' },
    { email: 'lecturer@example.com', password: 'demo123', name: 'Demo Lecturer', role: 'lecturer' },
  ]

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, saltRounds)
    await knex('students').insert({ email: u.email, password_hash: hash, name: u.name, class: null, role: u.role })
  }
}
