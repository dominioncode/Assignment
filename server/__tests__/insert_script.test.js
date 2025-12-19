const assert = require('assert')
const path = require('path')
const { execFileSync } = require('child_process')
const { getDb, migrate } = require('../db')

describe('insert_student script', function () {
  this.timeout(5000)
  let db

  before(async function () {
    db = getDb()
    await migrate()
    // ensure clean state for test email
    await db('students').where({ email: 'script_test@example.com' }).del()
  })

  after(async function () {
    // clean up any test records
    await db('students').where({ email: 'script_test@example.com' }).del()
  })

  it('inserts a student via CLI', async function () {
    // run the script
    execFileSync(process.execPath, [path.join(__dirname, '..', 'scripts', 'insert_student.js'), '--email=script_test@example.com', '--password=abc123', '--name=ScriptTest', '--class=TS1'], { stdio: 'inherit' })

    const row = await db('students').where({ email: 'script_test@example.com' }).first()
    assert(row, 'Expected a row to be inserted')
    assert.strictEqual(row.name, 'ScriptTest')
    assert.strictEqual(row.class, 'TS1')
  })
})
