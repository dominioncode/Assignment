#!/usr/bin/env node
const { execSync } = require('child_process')

function run(cmd) {
  console.log('> ' + cmd)
  execSync(cmd, { stdio: 'inherit', cwd: process.cwd() })
}

const readline = require('readline')

async function confirmAndRun() {
  // safety: ask for confirmation when using a database that could be production
  const client = process.env.DB_CLIENT || process.env.DATABASE_CLIENT || 'mysql2'
  if (client === 'mysql2' || client === 'mysql') {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    const answer = await new Promise((res) => rl.question('This will DROP the MySQL database and erase data. Type "YES" to continue: ', res))
    rl.close()
    if (answer !== 'YES') {
      console.log('Aborted db:reset (confirmation not provided).')
      process.exit(0)
    }
  }

  try {
    // drop database or remove sqlite file
    run(process.platform === 'win32' ? 'npm.cmd run db:drop' : 'npm run db:drop')

    // recreate/migrate/seed
    run(process.platform === 'win32' ? 'npm.cmd run db:setup' : 'npm run db:setup')

    console.log('Database reset complete')
    process.exit(0)
  } catch (err) {
    console.error('db:reset failed', err.message || err)
    process.exit(1)
  }
}

confirmAndRun()
