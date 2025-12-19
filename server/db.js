const path = require('path')
const dotenv = require('dotenv')

// load server/.env specifically to keep DB credentials scoped to server
dotenv.config({ path: path.join(__dirname, '.env') })

// prefer direct DB env vars for production+dev — default to MySQL for this project
const DB_CLIENT = process.env.DB_CLIENT || process.env.DATABASE_CLIENT || 'mysql2'

const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost'
const MYSQL_PORT = parseInt(process.env.MYSQL_PORT || '3306', 10)
const MYSQL_USER = process.env.MYSQL_USER || 'root'
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || ''
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'assignment_dev'

const SQLITE_FILE = process.env.DATABASE_FILE || path.join(__dirname, 'dev.sqlite3')

let _db = null

function createDb() {
  // require knex lazily so Next.js build doesn't attempt to resolve optional
  // dialect adapters (oracledb, pg-query-stream, etc.) during webpack bundling.
  // use `eval('require')` so bundlers can't statically analyze the dependency
  // and attempt to include optional native drivers.
  const req = eval('require')
  const knex = req('knex')

  if (DB_CLIENT === 'mysql2' || DB_CLIENT === 'mysql') {
    if (!MYSQL_PASSWORD) {
      console.warn('DB_CLIENT is set to mysql2 but MYSQL_PASSWORD is not provided — connection may fail')
    }
    return knex({
      client: 'mysql2',
      connection: {
        host: MYSQL_HOST,
        port: MYSQL_PORT,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE,
      },
    })
  }

  // default to sqlite3 only when explicitly selected — MySQL is the default
  return knex({
    client: 'sqlite3',
    connection: {
      filename: SQLITE_FILE,
    },
    useNullAsDefault: true,
  })
}

function getDb() {
  if (!_db) _db = createDb()
  return _db
}

// Ensure students table exists
async function migrate() {
  const db = getDb()
  try {
    // Students table
    const studentsExists = await db.schema.hasTable('students')
    if (!studentsExists) {
      await db.schema.createTable('students', (table) => {
        table.increments('id').primary()
        table.string('email').notNullable().unique()
        table.string('password_hash').notNullable()
        table.string('name').notNullable()
        table.string('class')
        table.string('role').notNullable().defaultTo('student')
        table.timestamps(true, true)
      })
      console.log('Created students table')
    }

    // Lecturers table (separate from students)
    const lecturersExists = await db.schema.hasTable('lecturers')
    if (!lecturersExists) {
      await db.schema.createTable('lecturers', (table) => {
        table.increments('id').primary()
        table.string('email').notNullable().unique()
        table.string('password_hash').notNullable()
        table.string('name').notNullable()
        table.string('department')
        table.string('title') // e.g., "Associate Professor"
        table.text('bio')
        table.string('office_location')
        table.string('phone_number')
        table.string('created_by') // who created this lecturer account
        table.timestamps(true, true)
      })
      console.log('Created lecturers table')
    }

    // Courses table (stores course metadata)
    const coursesExists = await db.schema.hasTable('courses')
    if (!coursesExists) {
      await db.schema.createTable('courses', (table) => {
        table.increments('id').primary()
        table.string('external_id').unique().nullable()
        table.string('code').notNullable().unique()
        table.string('name').notNullable()
        table.text('description')
        table.string('lecturer')
        table.string('semester')
        table.integer('year')
        table.integer('credits')
        table.integer('max_students')
        table.string('department')
        table.timestamps(true, true)
      })
      console.log('Created courses table')
    }

    // Assignments table
    const assignmentsExists = await db.schema.hasTable('assignments')
    if (!assignmentsExists) {
      await db.schema.createTable('assignments', (table) => {
        table.increments('id').primary()
        table.string('external_id').unique().nullable()
        table.string('title').notNullable()
        table.text('description')
        table.string('type').notNullable().defaultTo('individual')
        table.integer('course_id').unsigned().references('id').inTable('courses').onDelete('SET NULL').nullable()
        table.dateTime('due_date')
        table.dateTime('submission_deadline')
        table.integer('total_marks')
        table.text('instructions')
        table.text('attachments')
        // allow assignments to optionally reference a question set (nullable integer)
        table.integer('question_set_id').unsigned().nullable()
        table.string('created_by')
        table.timestamps(true, true)
      })
      console.log('Created assignments table')
    }
    // ensure question_set_id column exists on assignments (nullable integer)
    const assignmentsHasQuestionSet = await db.schema.hasColumn('assignments', 'question_set_id')
    if (!assignmentsHasQuestionSet) {
      await db.schema.alterTable('assignments', (table) => {
        table.integer('question_set_id').unsigned().nullable()
      })
      console.log('Added question_set_id column to assignments table')
    }

    // Submissions table
    const submissionsExists = await db.schema.hasTable('submissions')
    if (!submissionsExists) {
      await db.schema.createTable('submissions', (table) => {
        table.increments('id').primary()
        table.integer('assignment_id').unsigned().notNullable().references('id').inTable('assignments').onDelete('CASCADE')
        table.integer('student_id').unsigned().references('id').inTable('students').onDelete('SET NULL').nullable()
        table.text('submission_data')
        table.text('attachments')
        table.integer('marks')
        table.boolean('graded').defaultTo(false)
        table.text('feedback')
        table.dateTime('graded_at')
        table.string('graded_by')
        table.enum('status', ['pending', 'submitted', 'graded', 'late']).defaultTo('pending')
        table.timestamps(true, true)
      })
      console.log('Created submissions table')
    }
    // ensure attachments column exists on submissions (json/text)
    const submissionsHasAttachments = await db.schema.hasColumn('submissions', 'attachments')
    if (!submissionsHasAttachments) {
      await db.schema.alterTable('submissions', (table) => {
        table.text('attachments')
      })
      console.log('Added attachments column to submissions table')
    }
    // ensure feedback column exists
    const submissionsHasFeedback = await db.schema.hasColumn('submissions', 'feedback')
    if (!submissionsHasFeedback) {
      await db.schema.alterTable('submissions', (table) => {
        table.text('feedback')
      })
      console.log('Added feedback column to submissions table')
    }
    // ensure graded_at column exists
    const submissionsHasGradedAt = await db.schema.hasColumn('submissions', 'graded_at')
    if (!submissionsHasGradedAt) {
      await db.schema.alterTable('submissions', (table) => {
        table.dateTime('graded_at')
      })
      console.log('Added graded_at column to submissions table')
    }
    // ensure graded_by column exists
    const submissionsHasGradedBy = await db.schema.hasColumn('submissions', 'graded_by')
    if (!submissionsHasGradedBy) {
      await db.schema.alterTable('submissions', (table) => {
        table.string('graded_by')
      })
      console.log('Added graded_by column to submissions table')
    }
    // ensure status column exists
    const submissionsHasStatus = await db.schema.hasColumn('submissions', 'status')
    if (!submissionsHasStatus) {
      await db.schema.alterTable('submissions', (table) => {
        table.enum('status', ['pending', 'submitted', 'graded', 'late']).defaultTo('pending')
      })
      console.log('Added status column to submissions table')
    }

    // Questions table
    const questionsExists = await db.schema.hasTable('questions')
    if (!questionsExists) {
      await db.schema.createTable('questions', (table) => {
        table.increments('id').primary()
        table.string('external_id').unique().nullable()
        table.string('title').notNullable()
        table.text('description')
        table.string('type')
        table.integer('course_id').unsigned().references('id').inTable('courses').onDelete('SET NULL').nullable()
        table.text('text')
        table.text('options')
        table.text('correct_answer')
        table.integer('marks')
        table.string('created_by')
        table.timestamps(true, true)
      })
      console.log('Created questions table')
    }

    // Question sets table (optional grouping of questions)
    const qsetsExists = await db.schema.hasTable('question_sets')
    if (!qsetsExists) {
      await db.schema.createTable('question_sets', (table) => {
        table.increments('id').primary()
        table.string('title').notNullable()
        table.text('description')
        table.integer('course_id').unsigned().references('id').inTable('courses').onDelete('SET NULL').nullable()
        table.text('questions') // store question ids as JSON array
        table.integer('total_marks')
        table.dateTime('due_date')
        table.string('created_by')
        table.timestamps(true, true)
      })
      console.log('Created question_sets table')
    }

    // Assignment questions (per-assignment granular questions)
    const assignmentQuestionsExists = await db.schema.hasTable('assignment_questions')
    if (!assignmentQuestionsExists) {
      await db.schema.createTable('assignment_questions', (table) => {
        table.increments('id').primary()
        table.integer('assignment_id').unsigned().notNullable().references('id').inTable('assignments').onDelete('CASCADE')
        table.text('question_text').notNullable()
        table.enu('question_type', ['mcq', 'short_answer', 'essay', 'file_upload']).notNullable().defaultTo('short_answer')
        table.decimal('points', 8, 2).notNullable().defaultTo(0)
        // metadata for options like time limit, shuffle, etc.
        if (typeof table.json === 'function') {
          table.json('metadata')
        } else {
          table.text('metadata')
        }
        table.integer('position').notNullable().defaultTo(0)
        table.timestamps(true, true)
      })
      console.log('Created assignment_questions table')
    }

    // Assignment choices for MCQs
    const assignmentChoicesExists = await db.schema.hasTable('assignment_choices')
    if (!assignmentChoicesExists) {
      await db.schema.createTable('assignment_choices', (table) => {
        table.increments('id').primary()
        table.integer('question_id').unsigned().notNullable().references('id').inTable('assignment_questions').onDelete('CASCADE')
        table.string('choice_text', 1000).notNullable()
        table.boolean('is_correct').notNullable().defaultTo(false)
        table.integer('position').notNullable().defaultTo(0)
      })
      console.log('Created assignment_choices table')
    }

    // Submission answers per question
    const submissionAnswersExists = await db.schema.hasTable('submission_answers')
    if (!submissionAnswersExists) {
      await db.schema.createTable('submission_answers', (table) => {
        table.increments('id').primary()
        table.integer('submission_id').unsigned().notNullable().references('id').inTable('submissions').onDelete('CASCADE')
        table.integer('question_id').unsigned().notNullable().references('id').inTable('assignment_questions').onDelete('CASCADE')
        table.text('answer_text')
        table.integer('selected_choice_id').unsigned().nullable().references('id').inTable('assignment_choices').onDelete('SET NULL')
        table.decimal('points_awarded', 8, 2).nullable()
      })
      console.log('Created submission_answers table')
    }

    // Submission files (for file upload questions)
    const submissionFilesExists = await db.schema.hasTable('submission_files')
    if (!submissionFilesExists) {
      await db.schema.createTable('submission_files', (table) => {
        table.increments('id').primary()
        table.integer('submission_id').unsigned().notNullable().references('id').inTable('submissions').onDelete('CASCADE')
        table.string('file_path', 1000).notNullable()
        table.string('file_name', 255).notNullable()
        table.timestamps(true, true)
      })
      console.log('Created submission_files table')
    }

    // Assignment recipients: optional assignment -> student mapping
    const recipientsExists = await db.schema.hasTable('assignment_recipients')
    if (!recipientsExists) {
      await db.schema.createTable('assignment_recipients', (table) => {
        table.increments('id').primary()
        table.integer('assignment_id').unsigned().notNullable().references('id').inTable('assignments').onDelete('CASCADE')
        table.integer('student_id').unsigned().notNullable().references('id').inTable('students').onDelete('CASCADE')
        table.timestamps(true, true)
      })
      console.log('Created assignment_recipients table')
    }

    // Optional helper view for assignment stats
    try {
      const viewSQL = DB_CLIENT === 'sqlite3'
        ? `CREATE VIEW IF NOT EXISTS vw_assignment_stats AS
        SELECT a.id AS assignment_id, a.title, COUNT(s.id) AS submission_count, AVG(s.marks) AS average_grade
        FROM assignments a
        LEFT JOIN submissions s ON s.assignment_id = a.id
        GROUP BY a.id`
        : `CREATE OR REPLACE VIEW vw_assignment_stats AS
        SELECT a.id AS assignment_id, a.title, COUNT(s.id) AS submission_count, AVG(s.marks) AS average_grade
        FROM assignments a
        LEFT JOIN submissions s ON s.assignment_id = a.id
        GROUP BY a.id`
      await db.raw(viewSQL)
      console.log('Created/updated view vw_assignment_stats')
    } catch (e) {
      // ignore view creation errors but log them for debugging
      console.warn('Could not create vw_assignment_stats view:', e && e.message ? e.message : e)
    }
  } catch (err) {
    console.error('Database migration error — check DB_CLIENT and database connectivity:', err && err.message ? err.message : err)
    throw err
  }
}

module.exports = { getDb, migrate }
