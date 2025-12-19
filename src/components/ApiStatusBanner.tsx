"use client"

import React, { useEffect, useState } from 'react'
import useAuth from '@/lib/useAuth'

export default function ApiStatusBanner() {
  const { fetchWithAuth } = useAuth()
  const [reachable, setReachable] = useState<boolean | null>(null)
  const [attempts, setAttempts] = useState<Array<{ url: string; error?: string }>>([])
  const [loading, setLoading] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const check = async () => {
    setLoading(true)
    setDismissed(false)
    try {
      const res = fetchWithAuth ? await fetchWithAuth('/assignments') : await fetch('/assignments')
      if (res && res.ok) {
        setReachable(true)
        setAttempts([])
      } else if (res && res.status === 502) {
        try {
          const b = await res.json()
          setAttempts(b.attempts || [])
        } catch (e) {
          setAttempts([])
        }
        setReachable(false)
      } else {
        setReachable(false)
      }
    } catch (e) {
      setReachable(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    check()
  }, [])

  if (dismissed || reachable === null || reachable === true) return null

  const lines = attempts.map((a) => `${a.url}: ${a.error || 'failed'}`).join('\n') || 'No attempts recorded'

  return (
    <div className="alert alert-danger d-flex justify-content-between align-items-start" role="alert">
      <div>
        <strong>API unreachable</strong>
        <div className="small">Could not reach backend API. Attempts:</div>
        <pre style={{ whiteSpace: 'pre-wrap', margin: '0.5rem 0' }}>{lines}</pre>
        <div className="small">To fix: start the API server (from the <code>server</code> folder): <code>cd server ; npm run dev</code></div>
      </div>
      <div className="d-flex flex-column ms-3">
        <button className="btn btn-sm btn-outline-light mb-2" onClick={check} disabled={loading}>
          {loading ? 'Checking…' : 'Retry'}
        </button>
        <button className="btn btn-sm btn-light" onClick={() => setDismissed(true)}>Dismiss</button>
      </div>
    </div>
  )
}
