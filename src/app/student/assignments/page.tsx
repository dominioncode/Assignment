'use client'

import React, { useState } from 'react'
import { Search, Filter, Plus } from 'lucide-react'
import AssignmentCard from '@/components/AssignmentCard'
import type { Assignment } from '@/lib/types'

export default function StudentAssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'individual' | 'group' | 'study'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'submitted' | 'graded'>(
    'all'
  )

  // Sample data - will be replaced with store data
  const assignments: Assignment[] = [
    {
      id: '1',
      title: 'Database Design Project',
      description: 'Design a relational database for an e-commerce system',
      type: 'individual',
      courseId: 'CS101',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      submissionDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      totalMarks: 100,
      instructions: 'Submit ERD and SQL queries',
      attachments: [],
      createdBy: 'DR001',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Group Web Development',
      description: 'Build a responsive web application',
      type: 'group',
      courseId: 'CS102',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      submissionDeadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      totalMarks: 50,
      instructions: 'Deploy on GitHub Pages',
      attachments: [],
      createdBy: 'DR002',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || assignment.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">My Assignments</h1>
        <p className="text-gray-600">Track and manage all your course assignments</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Types</option>
              <option value="individual">Individual</option>
              <option value="group">Group</option>
              <option value="study">Study</option>
            </select>
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assignment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 text-lg">No assignments found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
