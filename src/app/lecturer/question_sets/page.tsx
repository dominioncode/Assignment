'use client'

export const dynamic = 'force-dynamic'

import React, { useState } from 'react'
import { useAppStore } from '@/lib/store'
import useAuth from '@/lib/useAuth'
import DashboardLayout from '@/components/DashboardLayout'
import { generateId } from '@/lib/utils'

export default function LecturerQuestionSetsPage() {
  const store = useAppStore()
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const currentUser = {
    id: 'lecturer-001',
    name: 'Dr. Sarah Smith',
    email: 'sarah.smith@university.edu',
    role: 'lecturer' as const,
    department: 'Computer Science',
  }

  const [courses, setCourses] = useState<any[]>(store.courses)
  const [questionSets, setQuestionSets] = useState<any[]>([])
  const { fetchWithAuth } = useAuth()

  const [form, setForm] = useState({ title: '', description: '', questions: [] as string[], totalMarks: 0 })

  React.useEffect(() => {
    async function load() {
      // try load courses + question sets from API, otherwise fall back to store
      try {
        const cRes = await (fetchWithAuth ? fetchWithAuth('/courses') : fetch('/courses'))
        if (cRes && cRes.ok) setCourses(await cRes.json())
      } catch (e) {
        // keep store.courses
      }

      try {
        const res = await (fetchWithAuth ? fetchWithAuth('/question_sets') : fetch('/question_sets'))
        if (res && res.ok) {
          const rows = await res.json()
          const parsed = rows.map((r:any) => ({
            ...r,
            courseId: r.course_id ? String(r.course_id) : r.course_id,
            questions: r.questions ? (typeof r.questions === 'string' ? JSON.parse(r.questions) : r.questions) : [],
            totalMarks: r.total_marks || r.totalMarks || 0,
          }))
          setQuestionSets(parsed)
        }
      } catch (e) {
        // fallback to store
        setQuestionSets(selectedCourse ? store.getQuestionSetsByCourse(selectedCourse) : store.questionSets)
      }
    }
    load()
  }, [])

  const handleAdd = () => {
    setEditingId(null)
    setForm({ title: '', description: '', questions: [], totalMarks: 0 })
    setShowForm(true)
  }

  const handleEdit = (qs: any) => {
    setEditingId(qs.id)
    setForm({ title: qs.title || '', description: qs.description || '', questions: qs.questions || [], totalMarks: qs.totalMarks || 0 })
    setShowForm(true)
  }

  const handleSave = () => {
    if (!selectedCourse || !form.title) {
      alert('Please select a course and provide a title')
      return
    }

    if (!fetchWithAuth) {
      if (editingId) store.updateQuestionSet(editingId, { ...form })
      else {
        const newSet = {
          id: generateId(),
          title: form.title,
          description: form.description,
          courseId: selectedCourse,
          questions: form.questions,
          totalMarks: form.totalMarks,
          createdBy: currentUser.id,
          dueDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        store.addQuestionSet(newSet)
      }
    } else {
      ;(async () => {
        try {
              const payload: any = {
            title: form.title,
            description: form.description,
            course_id: Number(selectedCourse),
            questions: form.questions,
            total_marks: form.totalMarks,
                // due_date omitted when not set (most sets won't include this in the simple UI)
            created_by: currentUser.email,
          }

          if (editingId) {
            const res = await fetchWithAuth(`/question_sets/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
            if (res && res.ok) {
              const updated = await res.json()
              const normalized = { ...updated, courseId: updated.course_id ? String(updated.course_id) : updated.course_id, questions: updated.questions ? (typeof updated.questions === 'string' ? JSON.parse(updated.questions) : updated.questions) : [] }
              setQuestionSets((s) => s.map((q) => (String(q.id) === String(normalized.id) ? normalized : q)))
            } else {
              let errMsg = `Failed to save question set (status ${res ? res.status : 'no response'})`
              try { const b = await (res ? res.json() : Promise.resolve(null)); if (b && b.error) errMsg = `Failed to save question set: ${b.error}` } catch (e) {}
              if (res && res.status === 502) {
                try {
                  const b = await res.json()
                  const attempts = b && b.attempts ? b.attempts : []
                  const lines = attempts.map((a:any) => `${a.url}: ${a.error}`).join('\n') || 'No attempts recorded'
                  alert(`Failed to reach backend. Attempts:\n${lines}\n\nStart the API server: cd server ; npm run dev`)
                  return
                } catch (e) {
                  errMsg = `Failed to reach backend. Check API at ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`
                }
              }
              alert(errMsg)
            }
          } else {
            const res = await fetchWithAuth('/question_sets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
            if (res && res.ok) {
              const created = await res.json()
              const normalized = { ...created, courseId: created.course_id ? String(created.course_id) : created.course_id, questions: created.questions ? (typeof created.questions === 'string' ? JSON.parse(created.questions) : created.questions) : [] }
              setQuestionSets((s) => [normalized, ...s])
            } else {
              let errMsg = `Failed to create question set (status ${res ? res.status : 'no response'})`
              try { const b = await (res ? res.json() : Promise.resolve(null)); if (b && b.error) errMsg = `Failed to create question set: ${b.error}` } catch (e) {}
              if (res && res.status === 502) errMsg = `Failed to reach backend. Check API at ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}`
              alert(errMsg)
            }
          }
        } catch (err) {
          console.error('question set save failed', err)
        }
      })()
    }

    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this question set?')) return
    if (!fetchWithAuth) {
      store.deleteQuestionSet(id)
      setQuestionSets((s) => s.filter((q) => String(q.id) !== String(id)))
      return
    }

    ;(async () => {
      try {
        const res = await fetchWithAuth(`/question_sets/${id}`, { method: 'DELETE' })
        if (res && (res.status === 204 || res.ok)) setQuestionSets((s) => s.filter((q) => String(q.id) !== String(id)))
        else alert('Failed to delete')
      } catch (err) {
        alert('Failed to delete (offline)')
      }
    })()
  }

  // list filtered by currently selected course
  const displayedSets = selectedCourse ? questionSets.filter((qs) => String(qs.courseId) === String(selectedCourse)) : []

  return (
    <DashboardLayout user={currentUser}>
      <div className="container-fluid py-4">
        <div className="row mb-4">
          <div className="col-md-6">
            <h1 className="h3">Question Sets</h1>
          </div>
          <div className="col-md-6 text-end">
            <button className="btn btn-primary" onClick={handleAdd}>
              + Add Question Set
            </button>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Select Course</label>
            <select className="form-select" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
              <option value="">-- Select a Course --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showForm && (
          <div className="card mb-4 border-primary">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">{editingId ? 'Edit Question Set' : 'Create Question Set'}</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>

              <div className="mb-3">
                <label className="form-label">Description (optional)</label>
                <input className="form-control" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>

              <div className="mb-3">
                <label className="form-label">Question IDs (comma separated)</label>
                <textarea className="form-control" value={form.questions.join(',')} onChange={(e) => setForm({ ...form, questions: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} />
              </div>

              <div className="mb-3">
                <label className="form-label">Total Marks</label>
                <input type="number" className="form-control" value={form.totalMarks} onChange={(e) => setForm({ ...form, totalMarks: parseInt(e.target.value || '0') })} />
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-success" onClick={handleSave}>Save</button>
                <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="row">
          {selectedCourse ? (
            displayedSets.length ? (
              displayedSets.map((qs) => (
                <div key={qs.id} className="col-md-6 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="card-title mb-1">{qs.title}</h6>
                          <small className="text-muted">{qs.description}</small>
                        </div>
                        <span className="badge bg-info">{qs.totalMarks} marks</span>
                      </div>

                      <p className="card-text">Questions: {Array.isArray(qs.questions) ? qs.questions.join(', ') : qs.questions}</p>

                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-warning" onClick={() => handleEdit(qs)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(qs.id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="alert alert-info">No question sets for this course yet.</div>
              </div>
            )
          ) : (
            <div className="col-12">
              <div className="alert alert-warning">Select a course to manage question sets.</div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
