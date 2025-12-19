require('dotenv').config()
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { getDb, migrate } = require('./db')
// get a knex instance (module provides getDb for lazy init)
const db = getDb()

// Multer upload setup (attachments)
const fs = require('fs')
const path = require('path')
const UPLOAD_DIR = path.join(__dirname, 'uploads')
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

let upload
let UPLOAD_ENABLED = true
try {
  const multer = require('multer')
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_')),
  })
  upload = multer({ storage })
} catch (err) {
  // multer isn't installed in the environment — fall back to no-op upload middleware
  // we still allow requests without files
  console.warn('multer not available — file uploads disabled (tests relying on uploads may fail)')
  // provide compatible API shape for `.any()` and `.single()` used by the app
  upload = { any: () => (req, res, next) => next(), single: () => (req, res, next) => next() }
  UPLOAD_ENABLED = false
}

const app = express()
// Keep the JSON payload small for proxy requests to avoid abuse
app.use(express.json({ limit: '250kb' }))

// Simple CORS handling for local development and API access from the Next.js frontend.
// In production consider using a stricter configuration or the `cors` package.
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000'
app.use((req, res, next) => {
  // In development, reflect the incoming Origin header when present so that
  // common dev setups (localhost/127.0.0.1/other ports) do not hit CORS issues.
  const originHeader = req.headers.origin
  const originToSet = (process.env.NODE_ENV !== 'production' && originHeader) ? originHeader : FRONTEND_ORIGIN
  res.setHeader('Access-Control-Allow-Origin', originToSet)
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')

  // Log preflight requests and origin for easier debugging
  if (req.method === 'OPTIONS') {
    console.log('CORS preflight:', { origin: originHeader, path: req.path, headers: Object.keys(req.headers) })
    return res.sendStatus(204)
  }

  next()
})

// serve uploaded files statically under /uploads
app.use('/uploads', express.static(UPLOAD_DIR))

// Development-friendly Content Security Policy: allow local dev tools / connections
// In production you should lock this down to a strict policy. We only relax here
// so requests like Chrome DevTools workspace and WebSocket connections aren't blocked.
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    // Allow same-origin resources and connections to localhost/127.0.0.1 for devtools
    res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' http: https:; connect-src 'self' http://localhost:4000 http://127.0.0.1:4000 ws://localhost:4000 ws://127.0.0.1:4000; img-src 'self' data:; frame-ancestors 'none';")
    next()
  })
}

const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10)

// Raptor mini (Preview) runtime flag + configuration
const RAPTOR_MINI_ENABLED = (process.env.RAPTOR_MINI_ENABLED || 'false').toLowerCase() === 'true'
const RAPTOR_MINI_URL = process.env.RAPTOR_MINI_URL || ''
const RAPTOR_MINI_API_KEY = process.env.RAPTOR_MINI_API_KEY || '';

// Create tables if they do not exist
(async () => {
  try {
    await migrate()
  } catch (err) {
    console.error('Migration error', err)
    console.error('\nHint: the server defaults to MySQL. Make sure a MySQL server is running and credentials in server/.env match.\n')
    console.error("If you want to use the included MySQL container, from the 'server' directory run: 'npm run db:compose' (this starts a MySQL container with user 'root' and password 'example').")
    process.exit(1)
  }
})();

// Log basic user counts to help diagnose missing credential issues on restarts
(async () => {
  try {
    const s = await db('students').count('* as cnt').first()
    const l = await db('lecturers').count('* as cnt').first()
    console.log('students count:', s && s.cnt != null ? s.cnt : 'unknown')
    console.log('lecturers count:', l && l.cnt != null ? l.cnt : 'unknown')
  } catch (e) {
    // ignore - logging should not block startup
  }
})();

// Register endpoint (supports both students and lecturers)
app.post('/register', async (req, res) => {
  const { email, password, name, class: studentClass, role, department, title } = req.body
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'email, password and name are required' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
    
    // Register lecturer in lecturers table if role is 'lecturer'
    if (role === 'lecturer') {
      const [id] = await db('lecturers').insert({
        email,
        password_hash: hashedPassword,
        name,
        department: department || null,
        title: title || null,
        created_by: null,
      })
      return res.status(201).json({ id, role: 'lecturer' })
    }
    
    // Otherwise register as student in students table
    const [id] = await db('students').insert({
      email,
      password_hash: hashedPassword,
      name,
      class: studentClass || null,
      role: role || 'student',
    })
    res.status(201).json({ id, role: role || 'student' })
  } catch (err) {
    console.error(err)
    // Handle duplicate email errors for both SQLite and MySQL
    if (err && (err.code === 'SQLITE_CONSTRAINT' || err.code === 'ER_DUP_ENTRY')) {
      return res.status(409).json({ error: 'Email already exists' })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Login endpoint (supports both students and lecturers)
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' })
  }

  try {
    // Try to find lecturer first
    let user = await db('lecturers').where({ email }).first()
    let userRole = 'lecturer'
    
    // If not a lecturer, try students table
    if (!user) {
      user = await db('students').where({ email }).first()
      userRole = user?.role || 'student'
    }
    
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign({ id: user.id, role: userRole, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    })

    res.json({ token, role: userRole })
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
    const userRole = req.user.role
    
    // Fetch from appropriate table based on role
    let user
    if (userRole === 'lecturer') {
      user = await db('lecturers').where({ id: userId }).first()
    } else {
      user = await db('students').where({ id: userId }).first()
    }
    
    if (!user) return res.status(404).json({ error: 'User not found' })
    // Do not send password_hash
    delete user.password_hash
    res.json({ user: { ...user, role: userRole } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Assignments API
app.get('/assignments', async (req, res) => {
  try {
    const list = await db('assignments').select('*').orderBy('created_at', 'desc')
    res.json(list)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch assignments' })
  }
})

// Courses API (basic listing)
app.get('/courses', async (req, res) => {
  try {
    const rows = await db('courses').select('*').orderBy('code', 'asc')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch courses' })
  }
})

app.get('/courses/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const row = await db('courses').where({ id }).first()
    if (!row) return res.status(404).json({ error: 'Course not found' })
    res.json(row)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch course' })
  }
})

app.get('/assignments/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const row = await db('assignments').where({ id }).first()
    if (!row) return res.status(404).json({ error: 'Assignment not found' })
    // If the assignment references a question_set, expand it and include questions
    if (row.question_set_id) {
      try {
        const qset = await db('question_sets').where({ id: row.question_set_id }).first()
        if (qset) {
          // normalize questions stored as JSON/text
          let qids = []
          try {
            qids = Array.isArray(qset.questions) ? qset.questions : JSON.parse(qset.questions || '[]')
          } catch (e) {
            // fallback: if it's stored as comma-separated string
            qids = typeof qset.questions === 'string' ? qset.questions.split(',').map((s) => s.trim()).filter(Boolean) : []
          }
          // determine viewer role (optional token) — lecturers may see correct answers
          let isLecturerViewer = false
          try {
            const authHeader = req.headers.authorization || ''
            const token = authHeader.replace(/^Bearer\s+/i, '')
            if (token) {
              const decoded = jwt.verify(token, JWT_SECRET)
              if (decoded && decoded.role === 'lecturer') isLecturerViewer = true
            }
          } catch (e) {
            // ignore — unauthenticated or invalid token
          }

          if (qids.length) {
            const questionRows = await db('questions').whereIn('id', qids).orderBy('id', 'asc')
            // ensure options and other json fields are parsed for convenience
            const parsed = questionRows.map((q) => {
              const parsedOptions = (() => {
                try { return q.options ? JSON.parse(q.options) : null } catch (e) { return q.options }
              })()
              const qObj = { ...q, options: parsedOptions }
              // hide correct answers from non-lecturer viewers
              if (!isLecturerViewer) delete qObj.correct_answer
              return qObj
            })
            qset.questions = parsed
          } else {
            qset.questions = []
          }
        }
        return res.json({ ...row, question_set: qset })
      } catch (err) {
        console.error('Failed to fetch question_set for assignment', err)
        // proceed to return basic row if qset fails
      }
    }
    res.json(row)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch assignment' })
  }
})

app.post('/assignments', authenticate, upload.any(), async (req, res) => {
  // only lecturers can create assignments
  if (!req.user || req.user.role !== 'lecturer') return res.status(403).json({ error: 'Forbidden' })
  const { title, description, type, course_id, due_date, submission_deadline, total_marks, instructions, attachments, created_by, question_set_id } = req.body
  if (!title) return res.status(400).json({ error: 'title required' })
  try {
    const creator = req.user && req.user.email ? req.user.email : created_by
    let filesArr = []
    if (req.files && Array.isArray(req.files) && req.files.length) {
      filesArr = (req.files || []).map((f) => ({ filename: f.filename, path: `/uploads/${f.filename}`, size: f.size, originalname: f.originalname }))
    }

    const attachmentsJson = filesArr.length ? JSON.stringify(filesArr) : attachments ? JSON.stringify(attachments) : null
    const insertObj = { title, description, type, course_id, due_date, submission_deadline, total_marks, instructions, attachments: attachmentsJson, created_by: creator }
    if (question_set_id) insertObj.question_set_id = Number(question_set_id)
    const [id] = await db('assignments').insert(insertObj)
    const created = await db('assignments').where({ id }).first()
    res.status(201).json(created)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create assignment' })
  }
})

// Allow lecturers to bulk upload assignments and/or upload a file as attachment
app.post('/assignments/upload', authenticate, upload.single('file'), async (req, res) => {
  if (!req.user || req.user.role !== 'lecturer') return res.status(403).json({ error: 'Forbidden' })
  if (!UPLOAD_ENABLED) return res.status(503).json({ error: 'file uploads disabled' })
  if (!req.file) return res.status(400).json({ error: 'file required' })

  const f = req.file
  const ext = (f.originalname || '').split('.').pop().toLowerCase()

  // CSV import (simple implementation)
  if (ext === 'csv' || ext === 'txt') {
    const content = require('fs').readFileSync(f.path, 'utf8')
    const lines = content.split(/\r?\n/).filter(Boolean)
    if (!lines.length) return res.status(400).json({ error: 'empty file' })
    const header = lines.shift().split(',').map(h => h.trim())
    const created = []
    for (const line of lines) {
      const cols = line.split(',')
      const data = {}
      for (let i = 0; i < header.length; i++) data[header[i]] = cols[i] ? cols[i].trim() : null
      // map supported columns: title, description, course_code, due_at, total_marks
      let course_id = data.course_id ? Number(data.course_id) : null
      if (!course_id && data.course_code) {
        const course = await db('courses').where({ code: data.course_code }).first()
        if (course) course_id = course.id
      }
      const [insertId] = await db('assignments').insert({ title: data.title || 'Untitled', description: data.description || null, course_id, due_date: data.due_at || null, total_marks: data.total_marks ? Number(data.total_marks) : null, created_by: req.user.email })
      // Some DB drivers may not return an insert id as expected; be defensive and fetch by id or title fallback
      let createdRow = null
      const idNum = Number(insertId)
      if (Number.isFinite(idNum) && idNum > 0) {
        createdRow = await db('assignments').where({ id: idNum }).first()
      } else {
        createdRow = await db('assignments').where({ title: data.title || 'Untitled' }).orderBy('id', 'desc').first()
      }
      created.push(createdRow)
    }
    return res.status(201).json({ created_count: created.length, created })
  }

  // XLSX / spreadsheet bulk import
  if (ext === 'xls' || ext === 'xlsx') {
    // If caller explicitly wants this to be an attachment (default), they may omit `bulk`.
    const bulkFlag = req.body && (req.body.bulk === '1' || req.body.bulk === 'true' || req.body.mode === 'bulk')
    if (!bulkFlag) {
      // treat as attachment (handled below)
    } else {
      // attempt to parse spreadsheet into rows
      let xlsx
      try {
        xlsx = require('xlsx')
      } catch (err) {
        return res.status(501).json({ error: 'xlsx parsing not available' })
      }
      try {
        const workbook = xlsx.readFile(f.path)
        const sheetName = workbook.SheetNames && workbook.SheetNames[0]
        if (!sheetName) return res.status(400).json({ error: 'empty spreadsheet' })
        const sheet = workbook.Sheets[sheetName]
        const rows = xlsx.utils.sheet_to_json(sheet, { defval: null })
        if (!rows || !rows.length) return res.status(400).json({ error: 'no rows found' })
        const created = []
        for (const row of rows) {
          // map keys similar to CSV: title, description, course_code, course_id, due_at, total_marks
          let course_id = row.course_id ? Number(row.course_id) : null
          if (!course_id && row.course_code) {
            const course = await db('courses').where({ code: row.course_code }).first()
            if (course) course_id = course.id
          }
          const [insertId] = await db('assignments').insert({ title: row.title || 'Untitled', description: row.description || null, course_id, due_date: row.due_at || null, total_marks: row.total_marks ? Number(row.total_marks) : null, created_by: req.user.email })
          let createdRow = null
          const idNum = Number(insertId)
          if (Number.isFinite(idNum) && idNum > 0) {
            createdRow = await db('assignments').where({ id: idNum }).first()
          } else {
            createdRow = await db('assignments').where({ title: row.title || 'Untitled' }).orderBy('id', 'desc').first()
          }
          created.push(createdRow)
        }
        return res.status(201).json({ created_count: created.length, created })
      } catch (err) {
        console.error('Failed to parse xlsx', err)
        return res.status(500).json({ error: 'Failed to parse spreadsheet' })
      }
    }
  }

  // If it's an Office document, create a single assignment with that file attached
  if (['doc', 'docx', 'pdf', 'xls', 'xlsx'].includes(ext)) {
    const title = req.body.title || f.originalname
    const filesArr = [{ filename: f.filename, path: `/uploads/${f.filename}`, size: f.size, originalname: f.originalname }]
    const [id] = await db('assignments').insert({ title, description: req.body.description || null, attachments: JSON.stringify(filesArr), created_by: req.user.email })
    const created = await db('assignments').where({ id }).first()
    return res.status(201).json(created)
  }

  return res.status(400).json({ error: 'unsupported file type' })
})

// Upload status endpoint (helper) — returns whether server supports file uploads
app.get('/assignments/upload', authenticate, async (req, res) => {
  res.json({ enabled: UPLOAD_ENABLED })
})

app.put('/assignments/:id', authenticate, async (req, res) => {
  // only lecturers may update assignments
  if (!req.user || req.user.role !== 'lecturer') {
    console.warn('Forbidden assignment update attempt', { path: req.path, user: req.user, authHeader: req.headers.authorization ? '[present]' : '[missing]' })
    return res.status(403).json({ error: 'Forbidden' })
  }
  const id = Number(req.params.id)
  try {
    const updates = { ...req.body }
    if (updates.attachments) updates.attachments = JSON.stringify(updates.attachments)
    await db('assignments').where({ id }).update({ ...updates, updated_at: db.fn.now() })
    const updated = await db('assignments').where({ id }).first()
    res.json(updated)
  } catch (err) {
    console.error('Failed to update assignment', { err: err && err.message ? err.message : err, path: req.path, body: req.body, headers: Object.keys(req.headers) })
    res.status(500).json({ error: 'Failed to update assignment' })
  }
})

app.delete('/assignments/:id', authenticate, async (req, res) => {
  // only lecturers may delete assignments
  if (!req.user || req.user.role !== 'lecturer') return res.status(403).json({ error: 'Forbidden' })
  const id = Number(req.params.id)
  try {
    const rows = await db('assignments').where({ id }).del()
    if (!rows) return res.status(404).json({ error: 'Assignment not found' })
    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete assignment' })
  }
})

// Questions API
app.get('/questions', async (req, res) => {
  try {
    const rows = await db('questions').select('*').orderBy('created_at', 'desc')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch questions' })
  }
})

app.get('/questions/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const row = await db('questions').where({ id }).first()
    if (!row) return res.status(404).json({ error: 'Question not found' })
    res.json(row)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch question' })
  }
})

app.post('/questions', authenticate, async (req, res) => {
  // Lecturers can create questions
  if (!req.user || req.user.role !== 'lecturer') return res.status(403).json({ error: 'Forbidden' })
  try {
    const { title, description, type, course_id, text, options, correct_answer, marks, created_by } = req.body
    if (!title) return res.status(400).json({ error: 'title is required' })
    const opts = Array.isArray(options) ? JSON.stringify(options) : options
    const creator = req.user && req.user.email ? req.user.email : created_by
    const [id] = await db('questions').insert({ title, description, type, course_id, text, options: opts, correct_answer, marks, created_by: creator })
    const created = await db('questions').where({ id }).first()
    res.status(201).json(created)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create question' })
  }
})

app.put('/questions/:id', authenticate, async (req, res) => {
  if (!req.user || req.user.role !== 'lecturer') return res.status(403).json({ error: 'Forbidden' })
  try {
    const id = Number(req.params.id)
    const updates = { ...req.body }
    if (updates.options && Array.isArray(updates.options)) updates.options = JSON.stringify(updates.options)
    await db('questions').where({ id }).update({ ...updates, updated_at: db.fn.now() })
    const updated = await db('questions').where({ id }).first()
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update question' })
  }
})

app.delete('/questions/:id', authenticate, async (req, res) => {
  if (!req.user || req.user.role !== 'lecturer') return res.status(403).json({ error: 'Forbidden' })
  try {
    const id = Number(req.params.id)
    const rows = await db('questions').where({ id }).del()
    if (!rows) return res.status(404).json({ error: 'Question not found' })
    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete question' })
  }
})

// Assignment-specific questions
app.get('/assignments/:id/questions', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const rows = await db('assignment_questions').where({ assignment_id: id }).orderBy('position', 'asc')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch assignment questions' })
  }
})

app.post('/assignments/:id/questions', authenticate, async (req, res) => {
  if (!req.user || req.user.role !== 'lecturer') return res.status(403).json({ error: 'Forbidden' })
  try {
    const assignment_id = Number(req.params.id)
    const { question_text, question_type, points, metadata, position } = req.body
    if (!question_text) return res.status(400).json({ error: 'question_text is required' })
    const meta = typeof metadata === 'object' ? JSON.stringify(metadata) : metadata
    const [id] = await db('assignment_questions').insert({ assignment_id, question_text, question_type, points, metadata: meta, position })
    const created = await db('assignment_questions').where({ id }).first()
    res.status(201).json(created)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create assignment question' })
  }
})

app.put('/assignment_questions/:id', authenticate, async (req, res) => {
  if (!req.user || req.user.role !== 'lecturer') return res.status(403).json({ error: 'Forbidden' })
  try {
    const id = Number(req.params.id)
    const updates = { ...req.body }
    if (updates.metadata && typeof updates.metadata === 'object') updates.metadata = JSON.stringify(updates.metadata)
    await db('assignment_questions').where({ id }).update({ ...updates })
    const updated = await db('assignment_questions').where({ id }).first()
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update assignment question' })
  }
})

app.delete('/assignment_questions/:id', authenticate, async (req, res) => {
  if (!req.user || req.user.role !== 'lecturer') return res.status(403).json({ error: 'Forbidden' })
  try {
    const id = Number(req.params.id)
    const rows = await db('assignment_questions').where({ id }).del()
    if (!rows) return res.status(404).json({ error: 'Assignment question not found' })
    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete assignment question' })
  }
})

// Choices for assignment questions
app.get('/assignment_questions/:id/choices', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const rows = await db('assignment_choices').where({ question_id: id }).orderBy('position', 'asc')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch choices' })
  }
})

app.post('/assignment_questions/:id/choices', authenticate, async (req, res) => {
  if (!req.user || req.user.role !== 'lecturer') return res.status(403).json({ error: 'Forbidden' })
  try {
    const qid = Number(req.params.id)
    const { choice_text, is_correct, position } = req.body
    if (!choice_text) return res.status(400).json({ error: 'choice_text is required' })
    const [id] = await db('assignment_choices').insert({ question_id: qid, choice_text, is_correct: !!is_correct, position })
    const created = await db('assignment_choices').where({ id }).first()
    res.status(201).json(created)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create choice' })
  }
})

app.put('/assignment_choices/:id', authenticate, async (req, res) => {
  if (!req.user || req.user.role !== 'lecturer') return res.status(403).json({ error: 'Forbidden' })
  try {
    const id = Number(req.params.id)
    const updates = { ...req.body }
    await db('assignment_choices').where({ id }).update({ ...updates })
    const updated = await db('assignment_choices').where({ id }).first()
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update choice' })
  }
})

app.delete('/assignment_choices/:id', authenticate, async (req, res) => {
  if (!req.user || req.user.role !== 'lecturer') return res.status(403).json({ error: 'Forbidden' })
  try {
    const id = Number(req.params.id)
    const rows = await db('assignment_choices').where({ id }).del()
    if (!rows) return res.status(404).json({ error: 'Choice not found' })
    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete choice' })
  }
})

// Submission answers
app.get('/submissions/:id/answers', authenticate, async (req, res) => {
  try {
    const id = Number(req.params.id)
    const rows = await db('submission_answers').where({ submission_id: id })
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch submission answers' })
  }
})

app.post('/submissions/:id/answers', authenticate, async (req, res) => {
  const id = Number(req.params.id)
  const { question_id, answer_text, selected_choice_id } = req.body
  if (!question_id) return res.status(400).json({ error: 'question_id required' })
  try {
    const [aid] = await db('submission_answers').insert({ submission_id: id, question_id, answer_text, selected_choice_id })
    const created = await db('submission_answers').where({ id: aid }).first()
    res.status(201).json(created)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create submission answer' })
  }
})

app.put('/submission_answers/:id', authenticate, async (req, res) => {
  const id = Number(req.params.id)
  try {
    const updates = { ...req.body }
    await db('submission_answers').where({ id }).update({ ...updates })
    const updated = await db('submission_answers').where({ id }).first()
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update submission answer' })
  }
})

// Question sets API
app.get('/question_sets', async (req, res) => {
  try {
    const rows = await db('question_sets').select('*').orderBy('created_at', 'desc')
    // expand questions for convenience (so frontends get full question objects with parsed options)
    const result = []
    // determine viewer role for optional visibility of correct answers
    let isLecturerViewerAll = false
    try {
      const authHeaderAll = req.headers.authorization || ''
      const tokenAll = authHeaderAll.replace(/^Bearer\s+/i, '')
      if (tokenAll) {
        const decodedAll = jwt.verify(tokenAll, JWT_SECRET)
        if (decodedAll && decodedAll.role === 'lecturer') isLecturerViewerAll = true
      }
    } catch (e) {
      // ignore
    }

    for (const r of rows) {
      let qids = []
      try {
        qids = Array.isArray(r.questions) ? r.questions : JSON.parse(r.questions || '[]')
      } catch (e) {
        qids = typeof r.questions === 'string' ? r.questions.split(',').map((s) => s.trim()).filter(Boolean) : []
      }
      if (qids.length) {
        const questionRows = await db('questions').whereIn('id', qids).orderBy('id', 'asc')
        const parsed = questionRows.map((q) => ({
          ...q,
          options: (() => { try { return q.options ? JSON.parse(q.options) : null } catch (e) { return q.options } })(),
          // hide correct answers for non-lecturers
          ...(isLecturerViewerAll ? {} : (() => { const obj = {}; return obj })()),
        }))
        // strip correct_answer from each question if viewer is not lecturer
        const finalParsed = parsed.map(p => {
          if (!isLecturerViewerAll && 'correct_answer' in p) {
            const np = { ...p }
            delete np.correct_answer
            return np
          }
          return p
        })
        result.push({ ...r, questions: finalParsed })
      } else {
        result.push({ ...r, questions: [] })
      }
    }
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch question sets' })
  }
})

app.get('/question_sets/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const row = await db('question_sets').where({ id }).first()
    if (!row) return res.status(404).json({ error: 'Question set not found' })
    // expand question ids into question objects with parsed options
    let qids = []
    try {
      qids = Array.isArray(row.questions) ? row.questions : JSON.parse(row.questions || '[]')
    } catch (e) {
      qids = typeof row.questions === 'string' ? row.questions.split(',').map((s) => s.trim()).filter(Boolean) : []
    }
    if (qids.length) {
      const questionRows = await db('questions').whereIn('id', qids).orderBy('id', 'asc')
      const parsed = questionRows.map((q) => ({
        ...q,
        options: (() => {
          try { return q.options ? JSON.parse(q.options) : null } catch (e) { return q.options }
        })(),
      }))
      row.questions = parsed
    } else {
      row.questions = []
    }
    res.json(row)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch question set' })
  }
})

app.post('/question_sets', authenticate, async (req, res) => {
  if (!req.user || req.user.role !== 'lecturer') return res.status(403).json({ error: 'Forbidden' })
  try {
    const { title, description, course_id, questions, total_marks, due_date, created_by } = req.body
    if (!title) return res.status(400).json({ error: 'title required' })
    const qs = Array.isArray(questions) ? JSON.stringify(questions) : questions
    const creator = req.user && req.user.email ? req.user.email : created_by
    const [id] = await db('question_sets').insert({ title, description, course_id, questions: qs, total_marks, due_date, created_by: creator })
    const created = await db('question_sets').where({ id }).first()
    res.status(201).json(created)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create question set' })
  }
})

app.put('/question_sets/:id', authenticate, async (req, res) => {
  if (!req.user || req.user.role !== 'lecturer') return res.status(403).json({ error: 'Forbidden' })
  try {
    const id = Number(req.params.id)
    const updates = { ...req.body }
    if (updates.questions && Array.isArray(updates.questions)) updates.questions = JSON.stringify(updates.questions)
    await db('question_sets').where({ id }).update({ ...updates, updated_at: db.fn.now() })
    const updated = await db('question_sets').where({ id }).first()
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update question set' })
  }
})

app.delete('/question_sets/:id', authenticate, async (req, res) => {
  if (!req.user || req.user.role !== 'lecturer') return res.status(403).json({ error: 'Forbidden' })
  try {
    const id = Number(req.params.id)
    const rows = await db('question_sets').where({ id }).del()
    if (!rows) return res.status(404).json({ error: 'Question set not found' })
    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete question set' })
  }
})

// Submissions
app.get('/assignments/:id/submissions', authenticate, async (req, res) => {
  const id = Number(req.params.id)
  try {
      const rows = await db('submissions')
        .where({ assignment_id: id })
        .leftJoin('students', 'submissions.student_id', '=', 'students.id')
        .select('submissions.*', 'students.name as student_name', 'students.email as student_email')
        .orderBy('submissions.created_at', 'desc')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch submissions' })
  }
})

// Get single submission with details
app.get('/submissions/:id', authenticate, async (req, res) => {
  const id = Number(req.params.id)
  try {
    const row = await db('submissions')
      .where({ 'submissions.id': id })
      .join('students', 'submissions.student_id', '=', 'students.id')
      .select('submissions.*', 'students.name as student_name', 'students.email as student_email')
      .first()
    if (!row) return res.status(404).json({ error: 'Submission not found' })
    
    // Parse attachments and other JSON fields
    if (row.attachments) {
      try {
        row.attachments = JSON.parse(row.attachments)
      } catch (e) {
        row.attachments = []
      }
    }
    
    res.json(row)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch submission' })
  }
})

app.post('/assignments/:id/submissions', authenticate, upload.any(), async (req, res) => {
  const id = Number(req.params.id)
  // support JSON body submission_data or file uploads
  // If a student_id is explicitly provided use it (after verifying it exists). If the authenticated user is a student use their id.
  let student_id = null
  if (req.body.student_id) {
    const maybe = await db('students').where({ id: Number(req.body.student_id) }).first()
    if (maybe) student_id = Number(req.body.student_id)
  } else if (req.user && req.user.role === 'student') {
    // only automatically assign student_id when the authenticated user is a student
    student_id = req.user.id
  }
  const submission_data = req.body.submission_data || null

  if (!submission_data && (!req.files || req.files.length === 0)) return res.status(400).json({ error: 'submission_data or at least one file required' })

  try {
    const attachments = (req.files || []).map((f) => ({ filename: f.filename, path: `/uploads/${f.filename}`, size: f.size }))

    // attempt to auto-grade if submission_data contains answers (JSON { text, answers })
    let marks = null
    let gradedFlag = false
    try {
      const parsed = typeof submission_data === 'string' ? JSON.parse(submission_data) : submission_data
      if (parsed && parsed.answers && typeof parsed.answers === 'object') {
        gradedFlag = true
        // score sum where answers match question.correct_answer
        let score = 0
        for (const [qid, ans] of Object.entries(parsed.answers)) {
          try {
            const q = await db('questions').where({ id: Number(qid) }).first()
            if (!q) continue
            const correct = q.correct_answer
            if (correct != null && String(ans).trim() === String(correct).trim()) score += Number(q.marks || 0)
          } catch (e) {
            // ignore per-question lookup errors
          }
        }
        marks = score
      }
    } catch (e) {
      // not JSON — no auto-grading
    }

    const [sid] = await db('submissions').insert({ 
      assignment_id: id, 
      student_id, 
      submission_data, 
      attachments: attachments.length ? JSON.stringify(attachments) : null, 
      graded: gradedFlag, 
      marks,
      status: 'submitted'
    })
    const created = await db('submissions').where({ id: sid }).first()
    res.status(201).json(created)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create submission' })
  }
})

// Grade a submission (lecturer only)
app.put('/submissions/:id/grade', authenticate, async (req, res) => {
  if (!req.user || req.user.role !== 'lecturer') return res.status(403).json({ error: 'Forbidden' })
  
  const id = Number(req.params.id)
  const { marks, feedback, status } = req.body
  
  if (marks === undefined && !feedback) {
    return res.status(400).json({ error: 'marks or feedback required' })
  }
  
  try {
    const updates = {
      graded: true,
      graded_at: db.fn.now(),
      graded_by: req.user.email,
      status: status || 'graded'
    }
    
    if (marks !== undefined) updates.marks = marks
    if (feedback !== undefined) updates.feedback = feedback
    
    await db('submissions').where({ id }).update(updates)
    const updated = await db('submissions').where({ id }).first()
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to grade submission' })
  }
})

// Bulk grade submissions
app.post('/assignments/:id/bulk-grade', authenticate, async (req, res) => {
  if (!req.user || req.user.role !== 'lecturer') return res.status(403).json({ error: 'Forbidden' })
  
  const { submissions } = req.body
  if (!Array.isArray(submissions)) {
    return res.status(400).json({ error: 'submissions array required' })
  }
  
  try {
    const results = []
    for (const sub of submissions) {
      const { id, marks, feedback, status } = sub
      const updates = {
        graded: true,
        graded_at: db.fn.now(),
        graded_by: req.user.email,
        status: status || 'graded'
      }
      
      if (marks !== undefined) updates.marks = marks
      if (feedback !== undefined) updates.feedback = feedback
      
      await db('submissions').where({ id }).update(updates)
      const updated = await db('submissions').where({ id }).first()
      results.push(updated)
    }
    res.json(results)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to bulk grade submissions' })
  }
})

// Get submission statistics for an assignment
app.get('/assignments/:id/submission-stats', authenticate, async (req, res) => {
  const id = Number(req.params.id)
  try {
    const assignment = await db('assignments').where({ id }).first()
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' })
    
    const submissions = await db('submissions').where({ assignment_id: id })
    const total = submissions.length
    const graded = submissions.filter(s => s.graded).length
    const pending = total - graded
    const avgMarks = submissions.length ? submissions.reduce((sum, s) => sum + (s.marks || 0), 0) / submissions.length : 0
    
    res.json({
      assignment_id: id,
      total_submissions: total,
      graded_submissions: graded,
      pending_submissions: pending,
      average_marks: avgMarks.toFixed(2),
      assignment_title: assignment.title,
      total_marks: assignment.total_marks
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch submission stats' })
  }
})

// Download submission (as JSON or file)
app.get('/submissions/:id/download', authenticate, async (req, res) => {
  const id = Number(req.params.id)
  try {
    const submission = await db('submissions').where({ id }).first()
    if (!submission) return res.status(404).json({ error: 'Submission not found' })
    
    // Return submission data as JSON for download
    res.setHeader('Content-Disposition', `attachment; filename="submission_${id}.json"`)
    res.json(submission)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to download submission' })
  }
})

// Revert submission to not graded
app.put('/submissions/:id/revert', authenticate, async (req, res) => {
  if (!req.user || req.user.role !== 'lecturer') return res.status(403).json({ error: 'Forbidden' })
  
  const id = Number(req.params.id)
  try {
    await db('submissions').where({ id }).update({
      graded: false,
      marks: null,
      feedback: null,
      graded_at: null,
      graded_by: null,
      status: 'submitted'
    })
    const updated = await db('submissions').where({ id }).first()
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to revert submission' })
  }
})

const { makeAiProxyHandler } = require('./lib/aiProxy')

// Use the centralized handler factory so tests can mount the handler directly.
app.post('/api/ai', authenticate, makeAiProxyHandler({ enabled: RAPTOR_MINI_ENABLED, url: RAPTOR_MINI_URL, apiKey: RAPTOR_MINI_API_KEY }))

// If the file is executed directly (node index.js) start the server. When required
// by tests we export `app` so the test runner can use supertest without binding a
// real TCP port.
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
    console.log(`Raptor mini enabled: ${RAPTOR_MINI_ENABLED} ${RAPTOR_MINI_URL ? '(URL configured)' : '(no URL)'}`)
  })

  // handle listen errors gracefully (e.g. EADDRINUSE) so we print a helpful message
  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Error: port ${PORT} is already in use. Another instance may be running.`)
      console.error(`If you started the server manually, stop the running process and retry. Use 'npm run server' once.`)
      process.exit(1)
    }
    // re-throw other errors so they aren't silently ignored
    console.error('Server error', err)
    process.exit(1)
  })
}

module.exports = { app, db, migrate }
