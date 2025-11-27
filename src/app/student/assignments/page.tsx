'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, Filter, Plus } from 'lucide-react'
import AssignmentCard from '@/components/AssignmentCard'
import Modal from '@/components/Modal'
import type { Assignment } from '@/lib/types'

export default function StudentAssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const searchRef = useRef<HTMLInputElement | null>(null)
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

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // focus search with '/'
      if (e.key === '/' && document.activeElement !== searchRef.current) {
        e.preventDefault()
        searchRef.current?.focus()
      }
      // open create modal with 'n'
      if (e.key.toLowerCase() === 'n') {
        setShowCreateModal(true)
      }
      // close with Escape
      if (e.key === 'Escape') setShowCreateModal(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="container-fluid">
      <div className="mb-3">
        <h1 className="h3 mb-1">My Assignments</h1>
        <p className="text-muted mb-0">Track and manage all your course assignments</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6 d-flex align-items-center gap-2">
              <div className="input-group">
                <span className="input-group-text bg-white"><Search size={18} /></span>
                <input ref={searchRef} aria-label="Search assignments" type="text" placeholder="Search assignments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-control form-control-lg" />
              </div>
              <button aria-label="Create new assignment" onClick={() => setShowCreateModal(true)} className="btn btn-primary ms-2 d-none d-md-inline-flex align-items-center"><Plus size={14} className="me-2"/>New</button>
            </div>
            <div className="col-md-3">
              <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)} className="form-select">
                <option value="all">All Types</option>
                <option value="individual">Individual</option>
                <option value="group">Group</option>
                <option value="study">Study</option>
              </select>
            </div>
            <div className="col-md-3">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)} className="form-select">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="submitted">Submitted</option>
                <option value="graded">Graded</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Assignment">
        <div className="mb-2">
          <input className="form-control mb-2" placeholder="Title" />
          <textarea className="form-control" placeholder="Short description" />
        </div>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button className="btn btn-outline-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { setShowCreateModal(false); /* no-op for demo */ }}>Create</button>
        </div>
      </Modal>

      {/* Assignment Cards */}
      <div className="row g-3">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="col-12 col-md-6 col-lg-4">
              <AssignmentCard assignment={assignment} />
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted lead">No assignments found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
