'use client'

import React, { useState, useRef, useEffect } from 'react'
import Modal from '@/components/Modal'

export default function StudentGroupsPage() {
  const groups = [
    {
      id: '1',
      name: 'Web Dev Team A',
      assignment: 'Group Web Development',
      members: 3,
      maxMembers: 5,
      status: 'active',
      joinedDate: '2024-01-15',
    },
    {
      id: '2',
      name: 'Database Project Group',
      assignment: 'Database Design',
      members: 4,
      maxMembers: 5,
      status: 'active',
      joinedDate: '2024-01-10',
    },
  ]

  const [showCreateModal, setShowCreateModal] = useState(false)
  const createRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '/' && document.activeElement !== createRef.current) {
        e.preventDefault()
        createRef.current?.focus()
      }
      if (e.key.toLowerCase() === 'n') setShowCreateModal(true)
      if (e.key === 'Escape') setShowCreateModal(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <main className="container-fluid" role="main">
      <div className="mb-3">
        <h1 className="h3 mb-1">My Groups</h1>
        <p className="text-muted mb-0">Manage your group memberships and collaborations</p>
      </div>

      <div className="row g-3">
        {groups.map((group) => (
          <div key={group.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 assignment-card shadow-sm border-0">
              <div className="card-body d-flex flex-column">
                <div className="mb-3">
                  <div className="card-title mb-1">{group.name}</div>
                  <div className="small text-muted">{group.assignment}</div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Members</span>
                    <strong className="text-dark">{group.members}/{group.maxMembers}</strong>
                  </div>
                  <div className="progress" style={{ height: 8 }}>
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{ width: `${(group.members / group.maxMembers) * 100}%` }}
                      aria-valuenow={(group.members / group.maxMembers) * 100}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${group.members} of ${group.maxMembers} group members`}
                      title={`${group.members} of ${group.maxMembers} group members`}
                    ></div>
                  </div>
                </div>

                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <span className="badge bg-success text-capitalize">{group.status}</span>
                  <button aria-label={`View details for ${group.name}`} className="btn btn-link p-0">View Details →</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && (
          <div className="text-center py-5 bg-light rounded">
          <p className="text-muted mb-4">No groups yet</p>
          <button ref={createRef} aria-label="Create or join a group" onClick={() => setShowCreateModal(true)} className="btn btn-primary">Create or Join a Group →</button>
        </div>
      )}

      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create or Join Group">
        <div>
          <input autoFocus className="form-control mb-2" placeholder="Group name" />
          <input className="form-control mb-2" placeholder="Invitation code (optional)" />
        </div>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button className="btn btn-outline-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { setShowCreateModal(false); }}>Create / Join</button>
        </div>
      </Modal>
    </main>
  )
}
