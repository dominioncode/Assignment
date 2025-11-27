#!/usr/bin/env node
const { spawn, execSync } = require('node:child_process')
const path = require('path')
// use root knexfile and ensure server/.env is loaded by knexfile

function runKnex(args) {
  return new Promise((resolve, reject) => {
    try {
      // execSync is more reliable cross-platform for one-shot CLI commands
      const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx'
      const full = `${cmd} knex ${args.join(' ')}`
      execSync(full, { stdio: 'inherit' })
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

;(async () => {
  try {
    // run migrations using root knexfile, environment default is development
    await runKnex(['migrate:latest', '--knexfile', path.join(process.cwd(), 'knexfile.js'), '--env', 'development'])
    console.log('Migrations applied')
  } catch (err) {
    console.error('Migration failed:', err.message)
    process.exit(1)
  }
})()
