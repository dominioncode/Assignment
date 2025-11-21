'use client'

import React from 'react'

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

  return (
    <div className="container-fluid">
      <div className="mb-3">
        <h1 className="h3 mb-1">My Groups</h1>
        <p className="text-muted mb-0">Manage your group memberships and collaborations</p>
      </div>

      <div className="row g-3">
        {groups.map((group) => (
          <div key={group.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <div className="mb-3">
                  <h5 className="card-title mb-1">{group.name}</h5>
                  <div className="small text-muted">{group.assignment}</div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Members</span>
                    <strong className="text-dark">{group.members}/{group.maxMembers}</strong>
                  </div>
                  <div className="progress" style={{ height: 8 }}>
                    <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${(group.members / group.maxMembers) * 100}%` }} aria-valuenow={(group.members / group.maxMembers) * 100} aria-valuemin={0} aria-valuemax={100}></div>
                  </div>
                </div>

                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <span className="badge bg-success text-capitalize">{group.status}</span>
                  <button className="btn btn-link p-0">View Details →</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="text-center py-5 bg-light rounded">
          <p className="text-muted mb-4">No groups yet</p>
          <button className="btn btn-primary">Create or Join a Group →</button>
        </div>
      )}
    </div>
  )
}
