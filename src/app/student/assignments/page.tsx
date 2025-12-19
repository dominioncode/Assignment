'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuth from '@/lib/useAuth'
import { Search, Filter } from 'lucide-react'
import AssignmentCard from '@/components/AssignmentCard'
import type { Assignment } from '@/lib/types'

export default function StudentAssignmentsPage() {
  const router = useRouter()
  const { user, fetchWithAuth } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const searchRef = useRef<HTMLInputElement | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'individual' | 'group' | 'study'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'submitted' | 'graded'>(
    'all'
  )
  const [assignments, setAssignments] = useState<Assignment[]>([])

  // Protect this page for students only; redirect lecturers to their assignments page
  useEffect(() => {
    if (!user) return // Wait for auth to load
    if (user.role === 'lecturer') {
      router.push('/lecturer/assignments')
      return
    }
    setIsLoading(false)
  }, [user, router])

  // Load assignments
  useEffect(() => {
    if (isLoading) return // Don't load until auth check completes
    
    async function loadAssignments() {
      try {
        const res = await fetch('/assignments')
        if (!res.ok) throw new Error('no server')
        const json = await res.json()
        const parsed = json.map((a:any) => ({ ...a, dueDate: a.due_date ? new Date(a.due_date) : null, submissionDeadline: a.submission_deadline ? new Date(a.submission_deadline) : null }))
        setAssignments(parsed)
        return
      } catch (err) {
        // fallback sample data
        setAssignments([
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
        ])
      }
    }

    loadAssignments()
  }, [isLoading])

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // focus search with '/'
      if (e.key === '/' && document.activeElement !== searchRef.current) {
        e.preventDefault()
        searchRef.current?.focus()
      }
      // key handlers for search/escape only (create handled on lecturer pages)
      // close with Escape (no creation modal on this page)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (isLoading) return <div className="container py-5"><p>Loading...</p></div>
  if (user?.role === 'lecturer') return null

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || assignment.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <main className="container-fluid" role="main">
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
              {/* Assignment creation belongs in the lecturer UI only */}
            </div>
            <div className="col-md-3">
              <select aria-label="Filter assignments by type" value={filterType} onChange={(e) => setFilterType(e.target.value as any)} className="form-select">
                <option value="all">All Types</option>
                <option value="individual">Individual</option>
                <option value="group">Group</option>
                <option value="study">Study</option>
              </select>
            </div>
            <div className="col-md-3">
              <select aria-label="Filter assignments by status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)} className="form-select">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="submitted">Submitted</option>
                <option value="graded">Graded</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* Create modal removed from student page — only lecturers create assignments */}

      {/* Assignment Cards */}
      <div className="row g-3">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => (
              <div key={assignment.id} className="col-12 col-md-6 col-lg-4">
              <AssignmentCard assignment={assignment} onClick={() => router.push(`/student/assignments/${assignment.id}`)} />
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted lead">No assignments found matching your criteria</p>
          </div>
        )}
      </div>
    </main>
  )
}
