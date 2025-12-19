'use client'

import React, { useEffect, useState } from 'react'
import { Download, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import useAuth from '@/lib/useAuth'

interface Submission {
  id: number
  assignment_id: number
  student_id: number
  student_name: string
  student_email: string
  marks?: number
  feedback?: string
  graded: boolean
  status: 'pending' | 'submitted' | 'graded' | 'late'
  created_at: string
  graded_at?: string
}

interface Assignment {
  id: number
  title: string
  total_marks: number
  due_date: string
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'graded'>('all')
  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<number>>(new Set())
  const [gradingSubmission, setGradingSubmission] = useState<number | null>(null)
  const [gradingData, setGradingData] = useState({ marks: '', feedback: '' })
  const [stats, setStats] = useState<any>(null)

  const { user, fetchWithAuth } = useAuth()
  
  const queryParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const assignmentId = queryParams.get('assignmentId') || '1'

  useEffect(() => {
    loadSubmissions()
    loadStats()
  }, [assignmentId])

  const loadSubmissions = async () => {
    try {
      const res = await fetchWithAuth(
        `/assignments/${assignmentId}/submissions`
      )
      if (!res.ok) throw new Error('Failed to fetch submissions')
      const data = await res.json()
      setSubmissions(data)

      // Load assignment details
      const assignRes = await fetchWithAuth(
        `/assignments/${assignmentId}`
      )
      if (assignRes.ok) {
        const assignData = await assignRes.json()
        setAssignment(assignData)
      }
    } catch (err) {
      console.error('Error loading submissions:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const res = await fetchWithAuth(
        `/assignments/${assignmentId}/submission-stats`
      )
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (err) {
      console.error('Error loading stats:', err)
    }
  }

  const handleGradeSubmission = async (submissionId: number) => {
    try {
      if (!gradingData.marks && !gradingData.feedback) {
        alert('Enter marks or feedback')
        return
      }

      const res = await fetchWithAuth(
        `/submissions/${submissionId}/grade`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            marks: gradingData.marks ? Number(gradingData.marks) : undefined,
            feedback: gradingData.feedback,
            status: 'graded'
          })
        }
      )

      if (!res.ok) throw new Error('Failed to grade submission')
      
      setGradingSubmission(null)
      setGradingData({ marks: '', feedback: '' })
      loadSubmissions()
      loadStats()
    } catch (err) {
      console.error('Error grading:', err)
      alert('Failed to grade submission')
    }
  }

  const toggleSubmissionSelect = (id: number) => {
    const newSet = new Set(selectedSubmissions)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedSubmissions(newSet)
  }

  const getStatusBadge = (status: string, graded: boolean) => {
    if (graded) {
      return (
        <span className="badge bg-success">
          <CheckCircle size={14} className="me-1" /> Graded
        </span>
      )
    }
    if (status === 'late') {
      return (
        <span className="badge bg-warning">
          <AlertCircle size={14} className="me-1" /> Late
        </span>
      )
    }
    return (
      <span className="badge bg-info">
        <Clock size={14} className="me-1" /> Pending
      </span>
    )
  }

  const filteredSubmissions = submissions.filter(s => {
    if (filter === 'pending') return !s.graded
    if (filter === 'graded') return s.graded
    return true
  })

  if (loading) {
    return (
      <main className="container-lg py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container-lg py-5">
        {/* Header */}
        <div className="mb-5">
          <Link href="/lecturer/assignments" className="btn btn-outline-secondary btn-sm mb-3">
            ← Back to Assignments
          </Link>
          <h1 className="display-5 fw-bold mb-2">
            {assignment?.title || 'Assignment'}
          </h1>
          <p className="text-muted fs-5">Manage student submissions and grades</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="row g-3 mb-5">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                <div className="card-body p-4 text-center">
                  <div className="text-muted small mb-2">Total Submissions</div>
                  <div className="h3 fw-bold text-primary mb-0">{stats.total_submissions}</div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                <div className="card-body p-4 text-center">
                  <div className="text-muted small mb-2">Graded</div>
                  <div className="h3 fw-bold text-success mb-0">{stats.graded_submissions}</div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                <div className="card-body p-4 text-center">
                  <div className="text-muted small mb-2">Pending</div>
                  <div className="h3 fw-bold text-warning mb-0">{stats.pending_submissions}</div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                <div className="card-body p-4 text-center">
                  <div className="text-muted small mb-2">Average Marks</div>
                  <div className="h3 fw-bold text-info mb-0">{stats.average_marks}/{assignment?.total_marks}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="card mb-4 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="card-body p-4">
            <div className="btn-group" role="group">
              <input type="radio" className="btn-check" name="filter" id="filter-all" checked={filter === 'all'} onChange={() => setFilter('all')} />
              <label className="btn btn-outline-primary" htmlFor="filter-all">All</label>

              <input type="radio" className="btn-check" name="filter" id="filter-pending" checked={filter === 'pending'} onChange={() => setFilter('pending')} />
              <label className="btn btn-outline-primary" htmlFor="filter-pending">Pending</label>

              <input type="radio" className="btn-check" name="filter" id="filter-graded" checked={filter === 'graded'} onChange={() => setFilter('graded')} />
              <label className="btn btn-outline-primary" htmlFor="filter-graded">Graded</label>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="card border-0 shadow-lg" style={{ borderRadius: '12px', overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="fw-bold">Student</th>
                  <th className="fw-bold">Submitted</th>
                  <th className="fw-bold text-center">Status</th>
                  <th className="fw-bold text-center">Marks</th>
                  <th className="fw-bold">Feedback</th>
                  <th className="fw-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5">
                      <div className="text-muted">
                        <p className="mb-0">No submissions found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map(sub => (
                    <tr key={sub.id}>
                      <td>
                        <div className="fw-semibold text-dark">{sub.student_name}</div>
                        <div className="small text-muted">{sub.student_email}</div>
                      </td>
                      <td>
                        <div className="small">
                          {new Date(sub.created_at).toLocaleDateString()}
                          <br />
                          <span className="text-muted">{new Date(sub.created_at).toLocaleTimeString()}</span>
                        </div>
                      </td>
                      <td className="text-center">
                        {getStatusBadge(sub.status, sub.graded)}
                      </td>
                      <td className="text-center">
                        <div className="fw-semibold text-dark">
                          {sub.marks !== null ? `${sub.marks}/${assignment?.total_marks}` : '—'}
                        </div>
                      </td>
                      <td>
                        <div className="small text-muted text-truncate" style={{ maxWidth: '200px' }}>
                          {sub.feedback || '—'}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm" role="group">
                          <button
                            className="btn btn-outline-primary"
                            title="View/Grade"
                            onClick={() => {
                              if (gradingSubmission === sub.id) {
                                setGradingSubmission(null)
                              } else {
                                setGradingSubmission(sub.id)
                                setGradingData({
                                  marks: sub.marks?.toString() || '',
                                  feedback: sub.feedback || ''
                                })
                              }
                            }}
                          >
                            <MessageSquare size={16} />
                          </button>
                          <button className="btn btn-outline-secondary" title="Download">
                            <Download size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grading Modal (Inline) */}
        {gradingSubmission && (
          <div className="card mt-4 border-0 shadow-lg" style={{ borderRadius: '12px' }}>
            <div className="card-header bg-light p-4" style={{ borderRadius: '12px 12px 0 0' }}>
              <h3 className="card-title h5 mb-0 fw-bold">
                Grade Submission
              </h3>
            </div>
            <div className="card-body p-4">
              <div className="mb-3">
                <label htmlFor="grade-marks" className="form-label fw-semibold">
                  Marks (out of {assignment?.total_marks})
                </label>
                <input
                  id="grade-marks"
                  type="number"
                  className="form-control form-control-lg"
                  value={gradingData.marks}
                  onChange={e => setGradingData({ ...gradingData, marks: e.target.value })}
                  placeholder="Enter marks"
                  max={assignment?.total_marks}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="grade-feedback" className="form-label fw-semibold">
                  Feedback
                </label>
                <textarea
                  id="grade-feedback"
                  className="form-control form-control-lg"
                  rows={4}
                  value={gradingData.feedback}
                  onChange={e => setGradingData({ ...gradingData, feedback: e.target.value })}
                  placeholder="Provide constructive feedback for the student..."
                />
              </div>

              <div className="d-flex gap-2 justify-content-end">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setGradingSubmission(null)
                    setGradingData({ marks: '', feedback: '' })
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleGradeSubmission(gradingSubmission)}
                >
                  Save Grade
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
