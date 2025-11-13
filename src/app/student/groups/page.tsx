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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">My Groups</h1>
        <p className="text-gray-600">Manage your group memberships and collaborations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-dark">{group.name}</h3>
              <p className="text-sm text-gray-600">{group.assignment}</p>
            </div>

            <div className="mb-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Members</span>
                <span className="font-semibold text-dark">{group.members}/{group.maxMembers}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${(group.members / group.maxMembers) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                {group.status}
              </span>
              <button className="text-primary hover:text-secondary font-semibold text-sm">
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No groups yet</p>
          <button className="text-primary hover:text-secondary font-semibold">
            Create or Join a Group →
          </button>
        </div>
      )}
    </div>
  )
}
