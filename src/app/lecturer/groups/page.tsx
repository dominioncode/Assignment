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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2">Manage Groups</h1>
          <p className="text-gray-600">Organize and manage student groups</p>
        </div>
        <button className="flex items-center space-x-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors">
          <Plus size={20} />
          <span>Create Group</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-dark">{group.name}</h3>
                <p className="text-sm text-gray-600">{group.assignment}</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit size={18} className="text-blue-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Trash2 size={18} className="text-red-600" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Users size={18} className="text-gray-600" />
                <span className="text-sm text-gray-600">{group.members} Members</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  {group.status}
                </span>
              </div>
              <button className="w-full mt-3 text-primary hover:text-secondary font-semibold text-sm py-2 hover:bg-gray-50 rounded-lg transition-colors">
                View Members →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
