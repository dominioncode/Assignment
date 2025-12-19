'use client'

import React, { useState, useRef, useEffect } from 'react'
import Modal from '@/components/Modal'
import { Users, Plus, Edit, Trash2 } from 'lucide-react'

export default function LecturerGroupsPage() {
  const [groups] = React.useState([
    {
      id: '1',
      name: 'Web Dev Team A',
      assignment: 'Group Web Development',
      members: 3,
      status: 'active',
      createdDate: '2024-01-15',
    },
    {
      id: '2',
      name: 'Database Project Group',
      assignment: 'Database Design',
      members: 4,
      status: 'active',
      createdDate: '2024-01-10',
    },
  ])

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Manage Groups</h1>
          <p className="text-muted mb-0">Organize and manage student groups</p>
        </div>
        <button ref={createRef} aria-label="Create group" onClick={() => setShowCreateModal(true)} className="btn btn-primary d-flex align-items-center"><Plus size={16} className="me-2" /> Create Group</button>
      </div>

      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Group">
        <div>
          <label htmlFor="group-name" className="form-label visually-hidden">Group name</label>
          <input id="group-name" autoFocus className="form-control mb-2" placeholder="Group name" />

          <label htmlFor="group-assignment" className="form-label visually-hidden">Assignment / topic</label>
          <input id="group-assignment" className="form-control mb-2" placeholder="Assignment / topic" />
        </div>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button className="btn btn-outline-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { setShowCreateModal(false); }}>Create</button>
        </div>
      </Modal>

      <div className="row g-3">
        {groups.map((group) => (
          <div key={group.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 assignment-card shadow-sm border-0">
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between mb-3">
                  <div>
                    <h5 className="card-title mb-0">{group.name}</h5>
                    <div className="small text-muted">{group.assignment}</div>
                  </div>
                  <div className="btn-group" role="group" aria-label={`Actions for ${group.name}`}>
                    <button aria-label={`Edit ${group.name}`} className="btn btn-sm btn-outline-secondary"><Edit /></button>
                    <button aria-label={`Delete ${group.name}`} className="btn btn-sm btn-outline-danger"><Trash2 /></button>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="d-flex align-items-center mb-2">
                    <Users className="me-2" />
                    <div className="small text-muted">{group.members} Members</div>
                  </div>
                  <div className="mb-3"><span className="badge bg-success text-capitalize">{group.status}</span></div>
                  <button className="btn btn-link p-0" aria-label={`View members of ${group.name}`}>View Members →</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
