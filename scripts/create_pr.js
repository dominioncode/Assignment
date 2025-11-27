const https = require('https')
const child_process = require('child_process')
const fs = require('fs')

function getRemoteOrigin() {
  try {
    const out = child_process.execSync('git config --get remote.origin.url').toString().trim()
    return out
  } catch (err) {
    return null
  }
}

function parseRepo(remoteUrl) {
  // support git@github.com:owner/repo.git or https://github.com/owner/repo.git
  if (!remoteUrl) return null
  let m = remoteUrl.match(/[:/]([^/]+)\/([^/]+)(?:.git)?$/)
  if (!m) return null
  return { owner: m[1], repo: m[2].replace(/\.git$/, '') }
}

async function createPR(token, title, head, base, body) {
  const repoUrl = getRemoteOrigin()
  const repo = parseRepo(repoUrl)
  if (!repo) {
    throw new Error('Unable to detect repo remote origin')
  }

  const postData = JSON.stringify({ title, head, base, body })

  const options = {
    hostname: 'api.github.com',
    path: `/repos/${repo.owner}/${repo.repo}/pulls`,
    method: 'POST',
    headers: {
      'User-Agent': 'assignment-ci-script',
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  }

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (c) => data += c)
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data))
        } else {
          reject(new Error(`GitHub API returned ${res.statusCode}: ${data}`))
        }
      })
    })

    req.on('error', (err) => reject(err))
    req.write(postData)
    req.end()
  })
}

async function main() {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    console.error('GITHUB_TOKEN not found; set it in your environment and try again')
    process.exit(2)
  }

  const head = process.argv[2] || 'bootstrap-admin-redesign'
  const base = process.argv[3] || 'main'
  const title = process.argv[4] || 'UI polish + E2E accessibility + CI improvements'
  const bodyFile = process.argv[5] || 'docs/pr-ui-polish.md'
  let body = ''
  if (fs.existsSync(bodyFile)) body = fs.readFileSync(bodyFile, 'utf8')

  try {
    const result = await createPR(token, title, head, base, body)
    console.log('PR created:', result.html_url)
  } catch (err) {
    console.error('Failed creating PR:', err.message)
    process.exit(1)
  }
}

main()
