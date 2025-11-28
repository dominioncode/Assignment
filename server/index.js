require('dotenv').config()
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { db, migrate } = require('./db')

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10)

// Create tables if they do not exist
migrate().catch((err) => {
  console.error('Migration error', err)
  process.exit(1)
})

// Register endpoint
app.post('/register', async (req, res) => {
  const { email, password, name, class: studentClass, role } = req.body
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'email, password and name are required' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
    const [id] = await db('students').insert({
      email,
      password_hash: hashedPassword,
      name,
      class: studentClass || null,
      role: role || 'student',
    })
    res.status(201).json({ id })
  } catch (err) {
    console.error(err)
    // Handle duplicate email errors for both SQLite and MySQL
    if (err && (err.code === 'SQLITE_CONSTRAINT' || err.code === 'ER_DUP_ENTRY')) {
      return res.status(409).json({ error: 'Email already exists' })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' })
  }

  try {
    const user = await db('students').where({ email }).first()
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    })

    res.json({ token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Middleware to authenticate JWT
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.replace(/^Bearer\s+/i, '')
  if (!token) return res.status(401).json({ error: 'Missing token' })

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(403).json({ error: 'Unauthorized' })
  }
}

// Protected route example
app.get('/me', authenticate, async (req, res) => {
  try {
    const userId = req.user.id
    const user = await db('students').where({ id: userId }).first()
    if (!user) return res.status(404).json({ error: 'User not found' })
    // Do not send password_hash
    delete user.password_hash
    res.json({ user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
