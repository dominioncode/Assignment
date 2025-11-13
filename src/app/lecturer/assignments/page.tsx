'use client'

import React, { useState } from 'react'
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react'

export default function LecturerAssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'individual' | 'group' | 'study'>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const assignments = [
    {
      id: '1',
      title: 'Database Design Project',
      type: 'individual',
      courseCode: 'CS101',
      courseName: 'Database Systems',
      totalMarks: 100,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      submissions: 25,
      graded: 18,
    },
    {
      id: '2',
      title: 'Group Web Development',
      type: 'group',
      courseCode: 'CS102',
      courseName: 'Web Development',
      totalMarks: 50,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      submissions: 8,
      graded: 3,
    },
  ]

  const filteredAssignments = assignments.filter(
    (a) => (filterType === 'all' || a.type === filterType) &&
      (a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.courseCode.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2">Manage Assignments</h1>
          <p className="text-gray-600">Create and manage course assignments</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <Plus size={20} />
          <span>Create Assignment</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Types</option>
            <option value="individual">Individual</option>
            <option value="group">Group</option>
            <option value="study">Study</option>
          </select>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-sm text-gray-700">Title</th>
              <th className="text-left px-6 py-3 font-semibold text-sm text-gray-700">Course</th>
              <th className="text-left px-6 py-3 font-semibold text-sm text-gray-700">Type</th>
              <th className="text-center px-6 py-3 font-semibold text-sm text-gray-700">Marks</th>
              <th className="text-center px-6 py-3 font-semibold text-sm text-gray-700">Submissions</th>
              <th className="text-center px-6 py-3 font-semibold text-sm text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssignments.map((assignment, index) => (
              <tr key={assignment.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-dark">{assignment.title}</p>
                    <p className="text-sm text-gray-600">Due: {assignment.dueDate.toLocaleDateString()}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <p className="font-semibold">{assignment.courseCode}</p>
                  <p className="text-gray-600">{assignment.courseName}</p>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">
                    {assignment.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-center text-dark font-semibold">
                  {assignment.totalMarks}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <div>
                    <p className="font-semibold text-dark">{assignment.submissions}</p>
                    <p className="text-gray-600">{assignment.graded} graded</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                      <Eye size={18} className="text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                      <Edit size={18} className="text-green-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Delete">
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-semibold">Total Assignments</p>
          <p className="text-3xl font-bold text-dark mt-2">{filteredAssignments.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-semibold">Total Submissions</p>
          <p className="text-3xl font-bold text-dark mt-2">
            {filteredAssignments.reduce((sum, a) => sum + a.submissions, 0)}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-semibold">Pending Review</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {filteredAssignments.reduce((sum, a) => sum + (a.submissions - a.graded), 0)}
          </p>
        </div>
      </div>
    </div>
  )
}
