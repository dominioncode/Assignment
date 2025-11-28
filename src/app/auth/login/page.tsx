'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, Mail, Lock, LogIn, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import useAuth from '@/lib/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState('student')

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      setRole(params.get('role') || 'student')
    } catch (err) {
      // fallback
      setRole('student')
    }
  }, [])

  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!email || !password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    try {
      const result = await login(email, password)
      if (!result.ok) {
        setError(result.error || 'Login failed')
        setIsLoading(false)
        return
      }

      // Redirect based on role
      if (role === 'student') router.push('/student/assignments')
      else router.push('/lecturer/assignments')
    } catch (err) {
      console.error(err)
      setError('Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex">
      {/* Left Side - Branding */}
      <div className="d-none d-lg-flex col-lg-6 brand-gradient align-items-center justify-content-center p-5">
        <div className="text-center">
          <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
            <BookOpen size={48} className="text-white" />
            <h1 className="fs-1 fw-bold">StudyHub</h1>
          </div>
          <p className="fs-5 text-white-50 mb-3">Assignment & Study Management Platform</p>
          <p className="text-white-50">Streamline academic collaboration between students and lecturers</p>

          {/* Features List */}
          <div className="mt-4 d-grid gap-2 text-start" style={{ maxWidth: 420 }}>
            <div className="d-flex align-items-start gap-2">
              <div className="rounded-circle bg-white" style={{ width: 8, height: 8, marginTop: 6 }}></div>
              <p className="mb-0 text-white-90">Manage assignments and deadlines efficiently</p>
            </div>
            <div className="d-flex align-items-start gap-2">
              <div className="rounded-circle bg-white" style={{ width: 8, height: 8, marginTop: 6 }}></div>
              <p className="mb-0 text-white-90">Coordinate group projects seamlessly</p>
            </div>
            <div className="d-flex align-items-start gap-2">
              <div className="rounded-circle bg-white" style={{ width: 8, height: 8, marginTop: 6 }}></div>
              <p className="mb-0 text-white-90">Track your academic progress and grades</p>
            </div>
            <div className="d-flex align-items-start gap-2">
              <div className="rounded-circle bg-white" style={{ width: 8, height: 8, marginTop: 6 }}></div>
              <p className="mb-0 text-white-90">Share and access study materials</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-4 bg-light">
        <div className="w-100" style={{ maxWidth: 420 }}>
          <div className="text-center mb-4">
            <h2 className="h4 fw-bold text-dark mb-1">Welcome Back</h2>
            <p className="text-muted">Sign in as {role === 'student' ? 'Student' : 'Lecturer'}</p>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-start">
              <AlertCircle size={20} className="flex-shrink-0 me-2" />
              <div className="small mb-0">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-3">
              <label className="form-label small fw-semibold">Email Address</label>
              <div className="input-group">
                <span className="input-group-text"><Mail size={18} /></span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-3">
              <label className="form-label small fw-semibold">Password</label>
              <div className="input-group">
                <span className="input-group-text"><Lock size={18} /></span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="d-flex align-items-center justify-content-between small mb-3">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="remember" disabled={isLoading} />
                <label className="form-check-label" htmlFor="remember">Remember me</label>
              </div>
              <button type="button" className="btn btn-link p-0" disabled={isLoading}>Forgot password?</button>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isLoading} className="btn btn-primary w-100 mb-3">
              <span className="d-inline-flex align-items-center">
                <LogIn size={18} className="me-2" />
                <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="d-flex align-items-center my-4">
            <hr className="flex-grow-1" />
            <span className="px-3 text-muted small">Demo Credentials</span>
            <hr className="flex-grow-1" />
          </div>

          {/* Demo Info */}
          <div className="card bg-light border mb-3 p-3">
            <p className="small fw-semibold mb-2">Try demo login:</p>
            <ul className="small mb-0">
              <li>Email: <code className="bg-white px-2 py-1 rounded">demo@example.com</code></li>
              <li>Password: <code className="bg-white px-2 py-1 rounded">demo123</code></li>
            </ul>
          </div>

          {/* Role Switch */}
          <div className="text-center small text-muted">
            Not a {role}?{' '}
            <Link href={`/auth/login?role=${role === 'student' ? 'lecturer' : 'student'}`} className="text-primary fw-semibold">
              Sign in as {role === 'student' ? 'Lecturer' : 'Student'}
            </Link>
          </div>

          {/* Register Link */}
          <div className="text-center mt-2">
            <Link href="/auth/register" className="text-primary small fw-semibold">Create an account</Link>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-3">
            <Link href="/" className="text-muted small">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
