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
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Manage Assignments</h1>
          <p className="text-muted mb-0">Create and manage course assignments</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary d-flex align-items-center">
          <Plus size={18} className="me-2" /> Create Assignment
        </button>
      </div>

      {/* Search and Filter */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white"><Search size={18} /></span>
                <input type="text" placeholder="Search assignments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-control" />
              </div>
            </div>
            <div className="col-md-4">
              <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)} className="form-select">
                <option value="all">All Types</option>
                <option value="individual">Individual</option>
                <option value="group">Group</option>
                <option value="study">Study</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="card mb-4">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Course</th>
                <th>Type</th>
                <th className="text-center">Marks</th>
                <th className="text-center">Submissions</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td>
                    <div>
                      <div className="fw-semibold">{assignment.title}</div>
                      <div className="small text-muted">Due: {assignment.dueDate.toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td>
                    <div className="fw-semibold">{assignment.courseCode}</div>
                    <div className="small text-muted">{assignment.courseName}</div>
                  </td>
                  <td>
                    <span className="badge bg-primary text-capitalize">{assignment.type}</span>
                  </td>
                  <td className="text-center fw-semibold">{assignment.totalMarks}</td>
                  <td className="text-center">
                    <div className="fw-semibold">{assignment.submissions}</div>
                    <div className="small text-muted">{assignment.graded} graded</div>
                  </td>
                  <td className="text-center">
                    <div className="btn-group" role="group">
                      <button className="btn btn-sm btn-outline-primary" title="View"><Eye /></button>
                      <button className="btn btn-sm btn-outline-success" title="Edit"><Edit /></button>
                      <button className="btn btn-sm btn-outline-danger" title="Delete"><Trash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card p-3">
            <div className="small text-muted">Total Assignments</div>
            <div className="h4 mt-2">{filteredAssignments.length}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3">
            <div className="small text-muted">Total Submissions</div>
            <div className="h4 mt-2">{filteredAssignments.reduce((sum, a) => sum + a.submissions, 0)}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3">
            <div className="small text-muted">Pending Review</div>
            <div className="h4 mt-2 text-danger">{filteredAssignments.reduce((sum, a) => sum + (a.submissions - a.graded), 0)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

