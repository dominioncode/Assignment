'use client'

import useAuth from '@/lib/useAuth'

export default function ProfileWidget() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className="card mb-3">
      <div className="card-body d-flex align-items-center justify-content-between">
        <div>
          <h6 className="mb-0">{user.name}</h6>
          <small className="text-muted">{user.email}</small>
        </div>
        <div>
          <button className="btn btn-outline-secondary btn-sm" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
