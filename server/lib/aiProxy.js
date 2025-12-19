const fetch = global.fetch || require('node-fetch')

function makeAiProxyHandler({ enabled, url, apiKey } = {}) {
  return async function aiProxyHandler(req, res) {
    if (!enabled) {
      return res.status(501).json({ error: 'RAPTOR_MINI_DISABLED', message: 'Raptor mini is not enabled on this server' })
    }

    if (!url) {
      return res.status(500).json({ error: 'RAPTOR_MINI_URL_NOT_CONFIGURED' })
    }

    try {
      const body = req.body
      if (!body || typeof body !== 'object') {
        return res.status(400).json({ error: 'INVALID_PAYLOAD', message: 'Request body must be a JSON object' })
      }

      const hasInput = typeof body.input === 'string' && body.input.trim().length > 0
      const hasMessages = Array.isArray(body.messages) && body.messages.length > 0
      if (!hasInput && !hasMessages) {
        return res.status(400).json({ error: 'MISSING_INPUT', message: 'Request must include `input` (string) or `messages` (non-empty array)' })
      }

      const safePayload = {}
      const allowed = ['model', 'input', 'messages', 'temperature', 'max_tokens', 'top_p', 'stream']
      for (const k of allowed) {
        if (Object.prototype.hasOwnProperty.call(body, k)) safePayload[k] = body[k]
      }

      if (typeof safePayload.temperature === 'number') {
        safePayload.temperature = Math.min(Math.max(safePayload.temperature, 0), 2)
      }
      if (typeof safePayload.max_tokens === 'number') {
        safePayload.max_tokens = Math.min(Math.max(safePayload.max_tokens, 0), 2048)
      }

      const headers = { 'Content-Type': 'application/json' }
      if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`

      const upstream = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(safePayload),
      })

      const contentType = upstream.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        let json = await upstream.json()
        function stripSecrets(obj) {
          if (!obj || (typeof obj !== 'object')) return obj
          if (Array.isArray(obj)) return obj.map(stripSecrets)
          const out = {}
          for (const [key, val] of Object.entries(obj)) {
            const k = String(key).toLowerCase()
            if (k.includes('key') || k.includes('token') || k.includes('secret') || k.includes('password') || k.includes('authorization')) {
              continue
            }
            out[key] = stripSecrets(val)
          }
          return out
        }
        json = stripSecrets(json)
        return res.status(upstream.status).json(json)
      }

      const text = await upstream.text()
      res.status(upstream.status).send(text)
    } catch (err) {
      console.error('Raptor mini proxy error:', err)
      res.status(502).json({ error: 'RAPTOR_PROXY_ERROR', details: err.message || String(err) })
    }
  }
}

module.exports = { makeAiProxyHandler }
