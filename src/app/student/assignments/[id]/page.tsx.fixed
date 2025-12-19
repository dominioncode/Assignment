"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import useAuth from '@/lib/useAuth'

export default function AssignmentDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, fetchWithAuth } = useAuth()
  const [assignment, setAssignment] = useState<any | null>(null)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [text, setText] = useState('')
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string,string>>({})
  const [files, setFiles] = useState<FileList | null>(null)
  const [status, setStatus] = useState<'idle'|'submitting'|'success'|'error'>('idle')

  useEffect(() => {
    async function load() {
      try {
        const url = `/assignments/${id}`
        const res = fetchWithAuth ? await fetchWithAuth(url) : await fetch(url)
        if (!res.ok) throw new Error('not found')
        const json = await res.json()
        setAssignment(json)
      } catch (err) {
        console.error('Failed to load assignment:', err)
      }

      try {
        const url2 = `/assignments/${id}/submissions`
        const res2 = fetchWithAuth ? await fetchWithAuth(url2) : await fetch(url2)
        if (res2.ok) setSubmissions(await res2.json())
      } catch (err) {
        console.error('Failed to load submissions:', err)
      }
    }
    if (id) load()
  }, [id, fetchWithAuth])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return alert('Sign in to submit')
    setStatus('submitting')
    try {
      const form = new FormData()
      // include text and selected answers together
      const payload = { text, answers: selectedAnswers }
      form.append('submission_data', JSON.stringify(payload))
      form.append('student_id', String(user.id || ''))
      if (files) {
        Array.from(files).forEach((f) => form.append('file', f))
      }
      const res = await (fetchWithAuth ? fetchWithAuth(`/assignments/${id}/submissions`, { method: 'POST', body: form }) : fetch(`/assignments/${id}/submissions`, { method: 'POST', body: form }))
      if (!res.ok) throw new Error('submit failed')
      setStatus('success')
      router.back()
    } catch (err) {
      console.error(err)
      setStatus('error')
      alert('Submission failed')
    }
  }

  if (!assignment) return <div className="container py-5">Loading assignment…</div>

  return (
    <main className="container py-4">
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h4 mb-0">{assignment.title}</h1>
          <div className="small text-muted">{assignment.description}</div>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => router.back()}>Back</button>
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="card p-3 mb-3">
            <h2 className="h6">Instructions</h2>
            <div className="small text-muted mb-2">{assignment.instructions}</div>
            <div className="small text-muted">Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleString() : 'N/A'}</div>
          </div>

          {/* Display question set and questions if available */}
          {assignment.question_set && Array.isArray(assignment.question_set.questions) && (
            <div className="card p-3 mb-3">
              <h3 className="h6 mb-2">{assignment.question_set.title || 'Questions'}</h3>
              <div className="small text-muted mb-3">{assignment.question_set.description}</div>
              <ol className="mb-0">
                {assignment.question_set.questions.map((q:any, idx:number) => (
                  <li key={q.id} className="mb-2">
                    <div className="fw-semibold">{q.title}</div>
                    <div className="small text-muted mb-1">{q.text}</div>
                    {Array.isArray(q.options) && q.options.length > 0 && (
                      <div className="mb-1">
                        {q.options.map((opt:any, i:number) => {
                          const checked = String(selectedAnswers[String(q.id)]) === String(opt)
                          return (
                            <div key={i} className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name={`q-${q.id}`}
                                id={`q-${q.id}-opt-${i}`}
                                value={opt}
                                checked={checked}
                                onChange={() => setSelectedAnswers((s) => ({ ...s, [String(q.id)]: opt }))}
                              />
                              <label className="form-check-label" htmlFor={`q-${q.id}-opt-${i}`}>{opt}</label>
                            </div>
                          )
                        })}
                      </div>
                    )}
                    <div className="small text-muted">Marks: {q.marks || 0}</div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="card p-3 mb-3">
            <h3 className="h6 mb-2">Submit your work</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className="form-control" placeholder="Write submission text or add links" />
              </div>
              <div className="mb-2">
                <label className="form-label">Attachments</label>
                <input type="file" multiple onChange={(e) => setFiles(e.target.files)} className="form-control" />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>{status === 'submitting' ? 'Submitting…' : 'Submit'}</button>
              </div>
            </form>
          </div>

          <div className="card p-3">
            <h3 className="h6 mb-2">Submissions</h3>
            {submissions.length === 0 ? <div className="text-muted">No submissions yet</div> : (
              <ul className="list-group list-group-flush">
                {submissions.map((s) => (
                  <li key={s.id} className="list-group-item">
                    <div className="small d-flex justify-content-between align-items-center">
                      <div className="small text-muted">Submitted at: {new Date(s.created_at).toLocaleString()}</div>
                      <div>
                        {s.graded ? <span className="badge bg-success me-2">Graded</span> : <span className="badge bg-secondary me-2">Ungraded</span>}
                        {s.marks != null ? <small className="text-muted">Score: {s.marks}</small> : null}
                      </div>
                    </div>
                    <div>
                      {(() => {
                        try {
                          const parsed = JSON.parse(s.submission_data)
                          return (
                            <div>
                              {parsed.text && <div className="mb-1">{parsed.text}</div>}
                              {parsed.answers && typeof parsed.answers === 'object' && (
                                <div className="small text-muted">
                                  <strong>Answers:</strong>
                                  <ul className="mb-0">
                                    {Object.entries(parsed.answers).map(([qid, ans]) => (
                                      <li key={qid}><small>{qid}: {String(ans)}</small></li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )
                        } catch (e) {
                          return s.submission_data
                        }
                      })()}
                    </div>
                    {s.attachments ? (
                      <div className="mt-1 small">
                        Attachments: {JSON.parse(s.attachments).map((a:any)=> <div key={a.filename}><a href={a.path} target="_blank" rel="noreferrer">{a.filename}</a></div>)}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <aside className="col-lg-4">
          <div className="card p-3">
            <div className="small text-muted">Course</div>
            <div className="fw-semibold">{assignment.course_id || '—'}</div>
            <div className="small text-muted mt-2">Total marks: {assignment.total_marks || '—'}</div>
          </div>
        </aside>
      </div>
    </main>
  )
}
