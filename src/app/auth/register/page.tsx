'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuth from '@/lib/useAuth'

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [studentClass, setStudentClass] = useState('')
  const [role, setRole] = useState<'student'|'lecturer'>('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, class: studentClass, role }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Registration failed')
        setLoading(false)
        return
      }

      // Auto-login after register
      const loginResult = await login(email, password)
      if (loginResult.ok) {
        if (role === 'lecturer') router.push('/lecturer/assignments')
        else router.push('/student/assignments')
      } else {
        setError('Registered but login failed — please login manually.')
      }
    } catch (err) {
      console.error(err)
      setError('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="mb-4">Register</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input name="name" placeholder="Full name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input name="email" placeholder="you@example.com" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Class (optional)</label>
                  <input name="class" placeholder="e.g., Year 1" className="form-control" value={studentClass} onChange={(e) => setStudentClass(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select name="role" className="form-select" value={role} onChange={(e) => setRole(e.target.value as any)}>
                    <option value="student">Student</option>
                    <option value="lecturer">Lecturer</option>
                  </select>
                  <div className="form-text small">Select <strong>Lecturer</strong> when creating instructor accounts (demo uses <code>lecturer@example.com</code>).</div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input name="password" placeholder="••••••••" type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
