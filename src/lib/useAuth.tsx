'use client'

import { useState, useEffect } from 'react'
import { getErrorMessage } from './error'
import { useRouter } from 'next/navigation'

export default function useAuth() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  })
  const [user, setUser] = useState<any>(() => {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch (e) {
        console.error('Failed to parse user from localStorage')
        return null
      }
    }
    return null
  })

  useEffect(() => {
    if (!token) return
    // fetch current user
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) setUser(data.user)
      })
      .catch((err) => console.error(err))
  }, [token])

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) return { ok: false, error: data.error }
      localStorage.setItem('auth_token', data.token)
      setToken(data.token)

      // Fetch user profile immediately and persist to localStorage
      try {
        const meRes = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${data.token}` } })
        if (meRes.ok) {
          const meJson = await meRes.json()
          if (meJson && meJson.user) {
            localStorage.setItem('user', JSON.stringify(meJson.user))
            setUser(meJson.user)
          }
        }
      } catch (err) {
        // ignore profile fetch errors; token is set so future calls can fetch
        console.warn('Failed to fetch profile after login', err)
      }
      return { ok: true }
    } catch (err) {
      console.error(err)
      return { ok: false, error: 'Network error' }
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    router.push('/auth/login')
  }

  // Base API URL — allow override via NEXT_PUBLIC_API_URL for environments
  const BASE_API_URL = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://localhost:4000'

  const fetchWithAuth = async (input: RequestInfo, init: RequestInit = {}) => {
    const t = token || localStorage.getItem('auth_token')
    // Build URL: if a string and not absolute, prefix BASE_API_URL
    let finalInput: RequestInfo = input
    if (typeof input === 'string') {
      const s = input as string
      if (!/^https?:\/\//i.test(s)) {
        // join safely
        const base = BASE_API_URL.replace(/\/+$/, '')
        const path = s.startsWith('/') ? s : '/' + s
        finalInput = base + path
      }
    }

    const headers = new Headers(init.headers || {})
    if (t) headers.set('Authorization', `Bearer ${t}`)

    // Try multiple URL fallbacks to handle common dev issues like mixed-content (HTTPS page, HTTP backend)
    // or localhost/DNS resolution differences (localhost vs 127.0.0.1). Collect diagnostics for better error messages.
    const attempts: Array<{ url: string; error?: string }> = []
    const tried: string[] = []

    const baseStr = String(finalInput)
    if (!tried.includes(baseStr)) tried.push(baseStr)

    // If the page is served over HTTPS and the base URL is HTTP, try the HTTPS variant
    try {
      if (typeof window !== 'undefined' && window.location && window.location.protocol === 'https:') {
        if (baseStr.startsWith('http://')) {
          const httpsVariant = baseStr.replace(/^http:\/\//i, 'https://')
          if (!tried.includes(httpsVariant)) tried.push(httpsVariant)
        }
      }
    } catch (e) {
      // ignore
    }

    // Try replacing localhost with 127.0.0.1 which can sometimes resolve differently
    try {
      const alt = baseStr.replace('localhost', '127.0.0.1')
      if (alt !== baseStr && !tried.includes(alt)) tried.push(alt)
    } catch (e) {}

    // Only try a bare relative path if the API is actually served from the same origin
    // (e.g., Next.js proxying API routes), otherwise a relative URL will hit the
    // frontend origin (localhost:3000 in dev) and produce spurious 404s.
    try {
      if (typeof input === 'string' && input.startsWith('/')) {
        const pageOrigin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : null
        const apiOrigin = BASE_API_URL ? BASE_API_URL.replace(/\/+$/, '') : ''
        if (!apiOrigin || (pageOrigin && apiOrigin.startsWith(pageOrigin))) {
          if (!tried.includes(input)) tried.push(input)
        } else {
          // skip relative path to avoid hitting frontend origin by accident
          console.debug('Skipping relative-path fallback since API origin differs from page origin', { apiOrigin, pageOrigin, input })
        }
      }
    } catch (e) {}

    for (const url of tried) {
      try {
        const r = await fetch(url, { ...init, headers })
        // if we get a response back, return it (success or error status will be handled by callers)
        return r
      } catch (err: any) {
        const msg = getErrorMessage(err)
        attempts.push({ url, error: msg })
      }
    }

    // All attempts failed — log diagnostics and return a structured 502 response
    console.error('Network error contacting API — all attempts failed', { attempts })
    const body = JSON.stringify({ error: 'Network error: could not reach API', attempts })
    return new Response(body, { status: 502, statusText: 'Bad Gateway', headers: { 'Content-Type': 'application/json' } })
  }

  return { token, user, login, logout, fetchWithAuth }
}
