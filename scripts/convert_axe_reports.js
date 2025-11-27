const fs = require('fs')
const path = require('path')

const inDir = path.resolve(process.cwd(), 'playwright-report', 'axe')
const outDir = path.resolve(process.cwd(), 'playwright-report', 'axe-html')

if (!fs.existsSync(inDir)) {
  console.log('No axe reports found in', inDir)
  process.exit(0)
}

fs.mkdirSync(outDir, { recursive: true })

const files = fs.readdirSync(inDir).filter((f) => f.endsWith('.json'))
for (const file of files) {
  const json = JSON.parse(fs.readFileSync(path.join(inDir, file), 'utf8'))
  const title = json?.url || file
  const rows = (json.violations || []).map((v) => `
    <section style="margin-bottom:24px;border:1px solid #eee;padding:12px;border-radius:8px">
      <h3>${v.id} — ${v.help}</h3>
      <p>${v.description}</p>
      <h4>Impact: ${v.impact}</h4>
      <ul>${v.nodes.map(n => `<li><strong>Target:</strong> ${n.target.join(', ')}<br/><strong>Summary:</strong> ${n.failureSummary || ''}</li>`).join('')}</ul>
    </section>
  `).join('\n')

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:Inter,system-ui,Segoe UI,Arial;margin:24px;}</style></head><body><h1>axe report - ${title}</h1>${rows}</body></html>`
  fs.writeFileSync(path.join(outDir, file.replace('.json', '.html')), html, 'utf8')
  console.log('wrote', file)
}

console.log('axe -> html conversion done')
