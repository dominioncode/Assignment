'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function useAuth() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  })
  const [user, setUser] = useState<any>(null)

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
      return { ok: true }
    } catch (err) {
      console.error(err)
      return { ok: false, error: 'Network error' }
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setToken(null)
    setUser(null)
    router.push('/auth/login')
  }

  const fetchWithAuth = async (input: RequestInfo, init: RequestInit = {}) => {
    const t = token || localStorage.getItem('auth_token')
    const headers = new Headers(init.headers || {})
    if (t) headers.set('Authorization', `Bearer ${t}`)
    return fetch(input, { ...init, headers })
  }

  return { token, user, login, logout, fetchWithAuth }
}
