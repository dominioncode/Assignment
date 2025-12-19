'use client'

import React, { useEffect, useState } from 'react'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import KOMU_CONFIG from '@/config/komu.config'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check localStorage for user
    const checkUser = () => {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          setUser(JSON.parse(userStr))
        } catch (e) {
          console.error('Failed to parse user from localStorage')
        }
      } else {
        setUser(null)
      }
    }
    
    checkUser()
    
    // Listen for storage changes (logout from another tab, etc.)
    window.addEventListener('storage', checkUser)
    
    // Also check periodically in case localStorage changes from this tab
    const interval = setInterval(checkUser, 500)
    
    return () => {
      window.removeEventListener('storage', checkUser)
      clearInterval(interval)
    }
  }, [])

  // show placeholder while mounting to avoid layout shift
  if (!mounted) return <div style={{ height: '60px' }} />

  const isAdmin = Boolean(
    user && (
      user.role === 'admin' || (Array.isArray(user.roles) && user.roles.includes('admin'))
    )
  )

  const handleLogout = () => {
    try {
      // Remove the auth token and user profile (use consistent key name)
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      setUser(null)
      // Use a more reliable redirect method
      window.location.replace(KOMU_CONFIG.authRoutes.login)
    } catch (err) {
      console.error('Logout error:', err)
      // Fallback redirect
      window.location.href = KOMU_CONFIG.authRoutes.login
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom mb-4" style={{ minHeight: '60px' }}>
      <div className="container-fluid">
        <div className="d-flex align-items-center gap-3">
          <span className="navbar-brand mb-0 h1">{KOMU_CONFIG.appName}</span>
        </div>
        <div className="ms-auto d-flex align-items-center gap-3">
          <Link href={KOMU_CONFIG.aboutRoute} className="btn btn-link">About</Link>
          <Link href={KOMU_CONFIG.supportRoute} className="btn btn-link">Support</Link>

          {isAdmin && (
            <Link href={'/admin'} className="btn btn-link">Admin</Link>
          )}

          <span className="text-muted" style={{ fontSize: '14px' }}>
            {user ? (user.name || user.email) : 'Guest'}
          </span>

          {user ? (
            <button
              aria-label="Logout"
              onClick={handleLogout}
              className="btn btn-outline-secondary btn-sm d-flex align-items-center"
              title="Logout"
              style={{ whiteSpace: 'nowrap' }}
            >
              <LogOut size={16} className="me-2" /> Logout
            </button>
          ) : (
            <Link href={KOMU_CONFIG.authRoutes.login} className="btn btn-primary btn-sm">Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
