'use client'

import React from 'react'
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

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Manage Groups</h1>
          <p className="text-muted mb-0">Organize and manage student groups</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center"><Plus size={16} className="me-2" /> Create Group</button>
      </div>

      <div className="row g-3">
        {groups.map((group) => (
          <div key={group.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between mb-3">
                  <div>
                    <h5 className="card-title mb-0">{group.name}</h5>
                    <div className="small text-muted">{group.assignment}</div>
                  </div>
                  <div className="btn-group">
                    <button className="btn btn-sm btn-outline-secondary"><Edit /></button>
                    <button className="btn btn-sm btn-outline-danger"><Trash2 /></button>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="d-flex align-items-center mb-2">
                    <Users className="me-2" />
                    <div className="small text-muted">{group.members} Members</div>
                  </div>
                  <div className="mb-3"><span className="badge bg-success text-capitalize">{group.status}</span></div>
                  <button className="btn btn-link p-0">View Members →</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
