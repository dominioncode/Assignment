const Mocha = require('mocha')
const path = require('path')

async function run() {
  const mocha = new Mocha({ timeout: 5000, reporter: 'spec' })
  const testDir = path.join(__dirname, '..', '__tests__')

  const fs = require('fs')
  const files = fs.readdirSync(testDir).filter((f) => f.endsWith('.test.js'))
  files.forEach((f) => mocha.addFile(path.join(testDir, f)))

  mocha.run((failures) => {
    if (failures) {
      console.error(`Tests failed: ${failures}`)
      process.exit(1)
    } else {
      console.log('All tests passed')
      process.exit(0)
    }
  })
}

run().catch((e) => { console.error(e); process.exit(2) })
