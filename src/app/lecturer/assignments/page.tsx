'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Filter, Edit, Trash2, Eye, X } from 'lucide-react'
import Modal from '@/components/Modal'
import useAuth from '@/lib/useAuth'
import { getErrorMessage } from '@/lib/error'
import Link from 'next/link'

export default function LecturerAssignmentsPage() {
  const router = useRouter()
  const { user, fetchWithAuth } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'individual' | 'group' | 'study'>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const searchRef = useRef<HTMLInputElement | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [editingAssignment, setEditingAssignment] = useState<any>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editType, setEditType] = useState('')
  const [editMarks, setEditMarks] = useState('')
  const [editDueDate, setEditDueDate] = useState('')
  const [assignments, setAssignments] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  // Protect this page for lecturers only
  useEffect(() => {
    if (!user) return // Wait for auth to load
    if (user.role !== 'lecturer') {
      router.push('/student/assignments')
      return
    }
    setIsLoading(false)
  }, [user, router])

  // Load assignments and courses
  useEffect(() => {
    if (isLoading) return // Don't load until auth check completes
    
    // load assignments from backend. fall back to sample data if server not reachable
    async function loadAssignments() {
      try {
        const res = fetchWithAuth ? await fetchWithAuth('/assignments') : await fetch('/assignments')
        if (!res.ok) throw new Error('no server')
        const json = await res.json()
        // convert date strings to Date where appropriate
        const parsed = json.map((a: any) => ({ ...a, due_date: a.due_date ? new Date(a.due_date) : null, submission_deadline: a.submission_deadline ? new Date(a.submission_deadline) : null }))
        setAssignments(parsed)
        return
      } catch (err) {
        // fallback sample data
        setAssignments([
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
        ])
      }
    }

    loadAssignments()

    // load courses
    async function loadCourses() {
      try {
        const res = fetchWithAuth ? await fetchWithAuth('/courses') : await fetch('/courses')
        if (!res.ok) throw new Error('no server')
        const json = await res.json()
        setCourses(json)
      } catch (err) {
        console.warn('Failed to load courses')
      }
    }

    loadCourses()
  }, [isLoading, fetchWithAuth])

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '/' && document.activeElement !== searchRef.current) {
        e.preventDefault()
        searchRef.current?.focus()
      }
      if (e.key.toLowerCase() === 'n' && user && user.role === 'lecturer') setShowCreateModal(true)
      if (e.key === 'Escape') {
        // No create modal available; Escape does nothing here
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [user])

  if (isLoading) return <div className="container py-5"><p>Loading...</p></div>
  if (user?.role !== 'lecturer') return null

  const questionBank: {
    id: string
    topic: string
    course: string
    summary: string
    items: { id: string; topicLabel: string; question: string; answer: string }[]
  }[] = [
    {
      id: 'qg1',
      topic: 'Algorithms',
      course: 'Computer Science — Algorithms',
      summary: 'Classic algorithm questions (complexity and approaches)',
      items: [
        {
          id: 'q1',
          topicLabel: 'Sorting / Complexity',
          question: 'Explain the average and worst-case time complexity of Quicksort and why it differs.',
          answer:
            'Quicksort has average-case O(n log n) time because a random pivot typically splits the array into two balanced halves; however its worst-case is O(n^2) when pivots are chosen poorly (e.g., already sorted input with a bad pivot strategy). Randomised pivot selection or median-of-three reduces the chance of worst-case and leads to expected O(n log n).',
        },
      ],
    },
    {
      id: 'qg2',
      topic: 'Data Structures',
      course: 'Computer Science — Data Structures',
      summary: 'Fundamental data structure operations and trade-offs',
      items: [
        {
          id: 'q2',
          topicLabel: 'Trees / Traversal',
          question: 'Describe the difference between inorder, preorder and postorder traversal of a binary tree and when each is useful.',
          answer:
            'Inorder visits left subtree → node → right subtree and is useful to retrieve sorted order for binary search trees. Preorder visits node → left → right and is used to copy or serialize tree structure. Postorder visits left → right → node and is useful when deleting or freeing nodes because children are handled before the parent.',
        },
      ],
    },
    {
      id: 'qg3',
      topic: 'Operating Systems',
      course: 'Computer Science — Operating Systems',
      summary: 'Concurrency primitives and process coordination',
      items: [
        {
          id: 'q3',
          topicLabel: 'Synchronization',
          question: 'What is a race condition and how do mutexes and semaphores prevent them?',
          answer:
            'A race condition occurs when two or more threads access shared data and try to modify it concurrently leading to unpredictable results. Mutexes provide exclusive access (one thread at a time) by locking critical sections, while semaphores can allow multiple resource holders up to a limit. Both coordinate access to shared resources and avoid concurrent conflicting modifications.',
        },
      ],
    },
    {
      id: 'qg4',
      topic: 'Databases',
      course: 'Computer Science — Databases',
      summary: 'Relational models, normal forms and transactions',
      items: [
        {
          id: 'q4',
          topicLabel: 'Normalization',
          question: 'What is database normalization (e.g., 1NF, 2NF, 3NF) and why is it important?',
          answer:
            'Normalization is the process of organizing data to reduce redundancy and dependency. 1NF removes repeating groups, 2NF ensures each non-key attribute depends on the whole primary key (removes partial dependency), and 3NF removes transitive dependencies. Normalization improves data integrity and reduces update anomalies.',
        },
      ],
    },
    {
      id: 'qg5',
      topic: 'Computer Networks',
      course: 'Computer Science — Networking',
      summary: 'Transport layer design and behavior',
      items: [
        {
          id: 'q5',
          topicLabel: 'TCP vs UDP',
          question: 'Compare TCP and UDP — when should each be used?',
          answer:
            'TCP is connection-oriented with reliable ordered delivery and congestion control, suitable for web pages, file transfers and anything that needs reliability. UDP is connectionless and low-overhead with no built-in reliability, used for live audio/video streaming, DNS queries and other low-latency or application-managed reliability scenarios.',
        },
      ],
    },
    {
      id: 'qg6',
      topic: 'Software Engineering',
      course: 'Computer Science — Software Engineering',
      summary: 'Design principles and maintainability',
      items: [
        {
          id: 'q6',
          topicLabel: 'Design Principles',
          question: 'What are the SOLID design principles and why do they matter?',
          answer:
            'SOLID are five design principles that help create maintainable object-oriented software: Single responsibility, Open/closed, Liskov substitution, Interface segregation, and Dependency inversion. They promote separation of concerns, extensibility, testability and more robust design.',
        },
      ],
    },
  ]

  const filteredAssignments = assignments.filter(
    (a) => (filterType === 'all' || a.type === filterType) &&
      (a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.courseCode.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <main className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container-lg py-5">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-start mb-5">
          <div>
            <h1 className="display-5 fw-bold mb-2">Manage Assignments</h1>
            <p className="text-muted fs-5 mb-0">Create, manage, and grade course assignments seamlessly</p>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <button aria-label="Create assignment" onClick={() => setShowCreateModal(true)} className="btn btn-primary btn-lg d-flex align-items-center" hidden={!(user && user.role === 'lecturer')} style={{ boxShadow: '0 2px 8px rgba(13, 110, 253, 0.3)' }}>
              <Plus size={20} className="me-2" /> Create Assignment
            </button>
          </div>
        </div>
      {/* Create modal placed near page header so it overlays consistently */}
      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Assignment" dialogClassName="assignment-modal">
        <div className="mb-2">
          <label htmlFor="create-title" className="form-label visually-hidden">Title</label>
          <input id="create-title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="form-control mb-2" placeholder="Title" />

          <label htmlFor="create-desc" className="form-label visually-hidden">Short description</label>
          <textarea id="create-desc" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="form-control" placeholder="Short description" />
        </div>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button className="btn btn-outline-secondary" onClick={() => setShowCreateModal(false)} disabled={isCreating}>Cancel</button>
          <button className="btn btn-primary" onClick={async () => {
            // client-side guard: ensure only lecturers attempt to create
            if (!user || user.role !== 'lecturer') { alert('Only lecturers can create assignments'); setShowCreateModal(false); return }
            if (newTitle.trim().length === 0) { alert('Assignment title is required'); return }
            
            setIsCreating(true)
            try {
              const payload = { title: newTitle, description: newDescription, type: 'individual', created_by: user.email }
              const res = await fetchWithAuth('/assignments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
              
              if (!res.ok) {
                let errMsg = `Failed to create assignment (status ${res.status})`
                try {
                  const errJson = await res.json()
                  if (errJson && errJson.error) errMsg = errJson.error
                } catch (e) {}
                alert(errMsg)
                return
              }
              
              const created = await res.json()
              // normalize date fields
              created.dueDate = created.due_date ? new Date(created.due_date) : null
              setAssignments((s) => [created, ...s])
              alert('Assignment created successfully!')
              setNewTitle('')
              setNewDescription('')
              setShowCreateModal(false)
            } catch (err: any) {
              console.error('Error creating assignment:', err)
              const msg = getErrorMessage(err)
              alert(`Failed to create assignment: ${msg}`)
            } finally {
              setIsCreating(false)
            }
          }} disabled={isCreating || newTitle.trim().length === 0}>
            {isCreating ? 'Creating...' : 'Create'}
          </button>
        </div>
      </Modal>

      {/* Edit Assignment Modal */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title={`Edit Assignment: ${editTitle}`} dialogClassName="assignment-modal">
        <div className="mb-3">
          <label htmlFor="edit-title" className="form-label">Title</label>
          <input id="edit-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="form-control mb-2" placeholder="Title" />

          <label htmlFor="edit-desc" className="form-label">Description</label>
          <textarea id="edit-desc" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="form-control mb-2" placeholder="Description" rows={3} />

          <label htmlFor="edit-type" className="form-label">Type</label>
          <select id="edit-type" value={editType} onChange={(e) => setEditType(e.target.value)} className="form-select mb-2">
            <option value="individual">Individual</option>
            <option value="group">Group</option>
            <option value="study">Study</option>
          </select>

          <label htmlFor="edit-marks" className="form-label">Total Marks</label>
          <input id="edit-marks" type="number" value={editMarks} onChange={(e) => setEditMarks(e.target.value)} className="form-control mb-2" placeholder="Total marks" />

          <label htmlFor="edit-due-date" className="form-label">Due Date</label>
          <input id="edit-due-date" type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} className="form-control mb-2" />
        </div>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button className="btn btn-outline-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={async () => {
            if (!editingAssignment) return
              try {
              const payload = {
                title: editTitle,
                description: editDescription,
                type: editType,
                total_marks: parseInt(editMarks) || 0,
                due_date: editDueDate || null
              }
              const res = await (fetchWithAuth ? fetchWithAuth(`/assignments/${editingAssignment.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }) : fetch(`/assignments/${editingAssignment.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }))
              if (res.ok) {
                const updated = await res.json()
                updated.dueDate = updated.due_date ? new Date(updated.due_date) : null
                setAssignments((s) => s.map((a) => (a.id === updated.id ? updated : a)))
                setShowEditModal(false)
              } else {
                // try to extract server-provided error message
                let errMsg = `Update failed (status ${res.status})`
                try {
                  const body = await res.json()
                  if (body && body.error) errMsg = `Update failed: ${body.error}`
                } catch (e) {
                  // ignore JSON parse errors
                }
                // network wrapper returns status 502 for connection errors — show attempts details
                if (res.status === 502) {
                  try {
                    const body = await res.json()
                    const attempts = body && body.attempts ? body.attempts : []
                    const lines = attempts.map((a:any) => `${a.url}: ${a.error}`).join('\n') || 'No attempts recorded'
                    alert(`Update failed: Could not reach backend. Attempts:\n${lines}\n\nStart the API server (from the 'server' folder):\n  cd server ; npm run dev`)
                    return
                  } catch (e) {
                    errMsg = `Update failed: Could not reach backend. Check the API server at ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`
                  }
                }
                alert(errMsg)
              }
            } catch (err: any) {
              // network / CORS / offline error — surface the message to help debugging
              console.error('Update request failed', err)
              const msg = getErrorMessage(err)
              alert('Update failed (network or CORS error): ' + msg)
            }
          }}>Save Changes</button>
        </div>
      </Modal>
      {/* Sample CS Question Bank */}
      <div className="card mb-5 border-0 shadow-lg" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <div className="card-header bg-gradient p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="h5 mb-1 text-white fw-bold">Sample CS Question Bank</h2>
              <div className="small text-light">Common Computer Science questions and model answers grouped by topic</div>
            </div>
          </div>
        </div>
        <div className="card-body p-4">
          <div className="accordion" id="csQuestionBank">
            {/** Render question groups */}
            {questionBank.map((qg, i) => (
              <div className="accordion-item border-0 mb-3" key={qg.id} style={{ borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
                <h2 className="accordion-header" id={`heading-${qg.id}`}>
                  <button
                    className={`accordion-button ${i !== 0 ? 'collapsed' : ''}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${qg.id}`}
                    aria-expanded={i === 0 ? 'true' : 'false'}
                    aria-controls={`collapse-${qg.id}`}
                    style={{ backgroundColor: '#f8f9fa', fontWeight: '600' }}
                  >
                    <div className="d-flex flex-column">
                      <strong>{qg.topic} — {qg.course}</strong>
                      <small className="text-muted">{qg.summary}</small>
                    </div>
                  </button>
                </h2>
                <div id={`collapse-${qg.id}`} className={`accordion-collapse collapse ${i === 0 ? 'show' : ''}`} aria-labelledby={`heading-${qg.id}`} data-bs-parent="#csQuestionBank">
                  <div className="accordion-body p-4" style={{ backgroundColor: '#fff' }}>
                    {qg.items.map((qa) => (
                      <div className="mb-4" key={qa.id}>
                        <div className="fw-semibold text-dark mb-2">📌 {qa.question}</div>
                        <div className="small text-info mb-2" style={{ fontWeight: '500' }}>Topic: {qa.topicLabel}</div>
                        <div className="border-start border-5 rounded p-3" style={{ backgroundColor: '#e7f3ff', borderColor: '#0d6efd' }}>
                          <span className="small fw-semibold text-secondary">Answer: </span>
                          <span className="small">{qa.answer}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card mb-5 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-white border-end-0"><Search size={20} className="text-muted" /></span>
                <input ref={searchRef} aria-label="Search assignments" type="text" placeholder="Search assignments by title or course code..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-control form-control-lg border-start-0" style={{ borderRadius: '0 8px 8px 0' }} />
              </div>
            </div>
            <div className="col-md-4">
              <select aria-label="Filter assignments by type" value={filterType} onChange={(e) => setFilterType(e.target.value as any)} className="form-select form-select-lg" style={{ borderRadius: '8px' }}>
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
      <div className="card mb-5 border-0 shadow-lg" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <div className="card-header bg-light p-4 border-bottom">
          <h3 className="h5 mb-0 fw-bold text-dark">Assignments</h3>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle" style={{ backgroundColor: '#fff' }}>
            <thead className="table-light">
              <tr>
                <th className="fw-bold">Title</th>
                <th className="fw-bold">Course</th>
                <th className="fw-bold">Type</th>
                <th className="text-center fw-bold">Marks</th>
                <th className="text-center fw-bold">Submissions</th>
                <th className="text-center fw-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5">
                    <div className="text-muted">
                      <p className="mb-1" style={{ fontSize: '48px' }}>📋</p>
                      <p className="mb-0">No assignments found. Create one to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((assignment) => (
                  <tr key={assignment.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td>
                      <div>
                        <div className="fw-semibold text-dark">{assignment.title}</div>
                        <div className="small text-muted">📅 Due: {assignment.dueDate?.toLocaleDateString() ?? 'Not set'}</div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{assignment.courseCode}</div>
                      <div className="small text-muted">{assignment.courseName}</div>
                    </td>
                    <td>
                      <span className={`badge ${assignment.type === 'individual' ? 'bg-primary' : assignment.type === 'group' ? 'bg-success' : 'bg-warning'}`} style={{ fontSize: '12px', padding: '6px 10px', borderRadius: '20px' }}>
                        {assignment.type.charAt(0).toUpperCase() + assignment.type.slice(1)}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="fw-bold text-dark">{assignment.totalMarks}</div>
                    </td>
                    <td className="text-center">
                      <div className="fw-semibold text-dark">{assignment.submissions}</div>
                      <div className="small text-muted">{assignment.graded} graded</div>
                    </td>
                    <td className="text-center">
                      <div className="btn-group" role="group" aria-label={`Actions for ${assignment.title}`}>
                        <Link href={`/lecturer/assignments/${assignment.id}`} className="btn btn-sm btn-outline-primary" title="View" aria-label={`View ${assignment.title}`}><Eye size={16} /></Link>
                        <button className="btn btn-sm btn-outline-success" title="Edit" aria-label={`Edit ${assignment.title}`} onClick={() => {
                          setEditingAssignment(assignment)
                          setEditTitle(assignment.title)
                          setEditDescription(assignment.description || '')
                          setEditType(assignment.type || 'individual')
                          setEditMarks(assignment.total_marks || assignment.totalMarks || '')
                          setEditDueDate(assignment.due_date ? assignment.due_date.split('T')[0] : assignment.dueDate ? assignment.dueDate.toISOString().split('T')[0] : '')
                          setShowEditModal(true)
                        }}><Edit size={16} /></button>
                        <button className="btn btn-sm btn-outline-danger" title="Delete" aria-label={`Delete ${assignment.title}`} onClick={async () => {
                          if (!confirm('Delete this assignment?')) return
                          try {
                            const res = await (fetchWithAuth ? fetchWithAuth(`/assignments/${assignment.id}`, { method: 'DELETE' }) : fetch(`/assignments/${assignment.id}`, { method: 'DELETE' }))
                            if (res.status === 204 || res.status === 200) {
                              setAssignments((s) => s.filter((a) => a.id !== assignment.id))
                            } else {
                              alert('Delete failed')
                            }
                          } catch (err) {
                            alert('Delete failed (offline)')
                          }
                        }}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <div className="card-header bg-gradient p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <div className="text-white small fw-semibold">Total Assignments</div>
            </div>
            <div className="card-body p-4 text-center">
              <div className="h2 fw-bold text-primary mb-0">{filteredAssignments.length}</div>
              <small className="text-muted">Across all courses</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <div className="card-header bg-gradient p-4" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <div className="text-white small fw-semibold">Total Submissions</div>
            </div>
            <div className="card-body p-4 text-center">
              <div className="h2 fw-bold text-danger mb-0">{filteredAssignments.reduce((sum, a) => sum + a.submissions, 0)}</div>
              <small className="text-muted">From all students</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <div className="card-header bg-gradient p-4" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              <div className="text-white small fw-semibold">Pending Review</div>
            </div>
            <div className="card-body p-4 text-center">
              <div className="h2 fw-bold text-info mb-0">{filteredAssignments.reduce((sum, a) => sum + (a.submissions - a.graded), 0)}</div>
              <small className="text-muted">Need your attention</small>
            </div>
          </div>
        </div>
      </div>
      </div>
    </main>
  )
}

