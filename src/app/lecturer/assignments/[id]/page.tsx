'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Edit, Trash2, Save, X } from 'lucide-react'
import Link from 'next/link'
import useAuth from '@/lib/useAuth'

export default function AssignmentDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { user, fetchWithAuth } = useAuth()
  const [assignment, setAssignment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<any[]>([])
  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<any>(null)
  
  const [questionTitle, setQuestionTitle] = useState('')
  const [questionType, setQuestionType] = useState('essay')
  const [questionText, setQuestionText] = useState('')
  const [questionMarks, setQuestionMarks] = useState('10')
  const [questionOptions, setQuestionOptions] = useState('Option 1\nOption 2\nOption 3')
  const [correctAnswer, setCorrectAnswer] = useState('')

  useEffect(() => {
    loadAssignment()
  }, [id])

  const loadAssignment = async () => {
    try {
      setLoading(true)
      const res = await (fetchWithAuth ? fetchWithAuth(`/assignments/${id}`) : fetch(`/assignments/${id}`))
      if (!res.ok) throw new Error('Failed to load assignment')
      const data = await res.json()
      setAssignment(data)
      
      // Load associated questions if any
      if (data.question_set && data.question_set.questions) {
        setQuestions(data.question_set.questions)
      }
    } catch (err) {
      console.error('Failed to load assignment:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveQuestion = async () => {
    if (!questionTitle.trim() || !questionText.trim()) {
      alert('Please fill in title and question text')
      return
    }

    try {
      let payload: any = {
        title: questionTitle,
        type: questionType,
        text: questionText,
        marks: parseInt(questionMarks) || 10,
        correct_answer: correctAnswer || null,
        course_id: assignment.course_id || null
      }

      if (questionType === 'multiple_choice' && questionOptions) {
        payload.options = questionOptions.split('\n').filter(o => o.trim())
      }

      let res
      if (editingQuestion) {
        // Update existing question
          res = await (fetchWithAuth 
            ? fetchWithAuth(`/questions/${editingQuestion.id}`, { 
              method: 'PUT', 
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify(payload) 
            }) 
          : fetch(`/questions/${editingQuestion.id}`, { 
              method: 'PUT', 
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify(payload) 
            }))
        
        if (res.ok) {
          const updated = await res.json()
          setQuestions(questions.map(q => q.id === updated.id ? updated : q))
          setEditingQuestion(null)
          resetQuestionForm()
        }
      } else {
        // Create new question
        res = await (fetchWithAuth 
          ? fetchWithAuth('/questions', { 
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify(payload) 
            }) 
          : fetch('/questions', { 
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify(payload) 
            }))
        
        if (res.ok) {
          const created = await res.json()
          setQuestions([...questions, created])
          resetQuestionForm()
        }
      }
    } catch (err) {
      console.error('Error saving question:', err)
      alert('Failed to save question')
    }
  }

  const handleDeleteQuestion = async (qid: string) => {
    if (!confirm('Delete this question?')) return

    try {
      const res = await (fetchWithAuth 
          ? fetchWithAuth(`/questions/${qid}`, { method: 'DELETE' }) 
          : fetch(`/questions/${qid}`, { method: 'DELETE' }))
      
      if (res.ok || res.status === 204) {
        setQuestions(questions.filter(q => q.id !== qid))
      } else {
        alert('Failed to delete question')
      }
    } catch (err) {
      console.error('Error deleting question:', err)
      alert('Failed to delete question')
    }
  }

  const resetQuestionForm = () => {
    setQuestionTitle('')
    setQuestionType('essay')
    setQuestionText('')
    setQuestionMarks('10')
    setQuestionOptions('Option 1\nOption 2\nOption 3')
    setCorrectAnswer('')
    setShowAddQuestion(false)
  }

  const startEditQuestion = (q: any) => {
    setEditingQuestion(q)
    setQuestionTitle(q.title || '')
    setQuestionType(q.type || 'essay')
    setQuestionText(q.text || '')
    setQuestionMarks(q.marks || '10')
    if (Array.isArray(q.options)) {
      setQuestionOptions(q.options.join('\n'))
    } else if (typeof q.options === 'string') {
      setQuestionOptions(q.options)
    }
    setCorrectAnswer(q.correct_answer || '')
    setShowAddQuestion(true)
  }

  if (loading) {
    return (
      <main className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-lg py-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!assignment) {
    return (
      <main className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container-lg py-5">
          <div className="alert alert-danger">Assignment not found</div>
          <Link href="/lecturer/assignments" className="btn btn-primary">Back to Assignments</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container-lg py-5">
        {/* Header */}
        <div className="mb-4">
          <Link href="/lecturer/assignments" className="btn btn-link text-primary mb-3 d-flex align-items-center gap-2">
            <ArrowLeft size={18} /> Back to Assignments
          </Link>
          <h1 className="display-5 fw-bold mb-2">{assignment.title}</h1>
          <p className="text-muted fs-5">{assignment.description}</p>
        </div>

        {/* Assignment Details Card */}
        <div className="card mb-4 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="card-body p-4">
            <div className="row g-4">
              <div className="col-md-3">
                <div className="small text-muted mb-1">Type</div>
                <div className="fw-semibold">{assignment.type?.charAt(0).toUpperCase() + assignment.type?.slice(1) || 'Individual'}</div>
              </div>
              <div className="col-md-3">
                <div className="small text-muted mb-1">Total Marks</div>
                <div className="fw-semibold">{assignment.total_marks || 0}</div>
              </div>
              <div className="col-md-3">
                <div className="small text-muted mb-1">Due Date</div>
                <div className="fw-semibold">
                  {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'Not set'}
                </div>
              </div>
              <div className="col-md-3">
                <div className="small text-muted mb-1">Created By</div>
                <div className="fw-semibold">{assignment.created_by || 'System'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="card border-0 shadow-lg" style={{ borderRadius: '12px', overflow: 'hidden' }}>
          <div className="card-header bg-gradient p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="h5 mb-0 text-white fw-bold">Questions ({questions.length})</h3>
              <button 
                className="btn btn-sm btn-light d-flex align-items-center gap-2"
                onClick={() => {
                  setEditingQuestion(null)
                  resetQuestionForm()
                  setShowAddQuestion(true)
                }}
              >
                <Plus size={16} /> Add Question
              </button>
            </div>
          </div>

          {/* Add/Edit Question Form */}
          {showAddQuestion && (
            <div className="card-body p-4 border-bottom" style={{ backgroundColor: '#f8f9fa' }}>
              <h5 className="mb-3">{editingQuestion ? 'Edit Question' : 'Add New Question'}</h5>
              
              <div className="mb-3">
                <label className="form-label">Question Title</label>
                <input 
                  type="text" 
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  className="form-control"
                  placeholder="e.g., Explain the concept of inheritance"
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Question Type</label>
                  <select 
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                    className="form-select"
                  >
                    <option value="essay">Essay</option>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="short_answer">Short Answer</option>
                    <option value="true_false">True/False</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Marks</label>
                  <input 
                    type="number" 
                    value={questionMarks}
                    onChange={(e) => setQuestionMarks(e.target.value)}
                    className="form-control"
                    min="1"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Question Text</label>
                <textarea 
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="form-control"
                  rows={4}
                  placeholder="Enter the question or problem statement"
                />
              </div>

              {(questionType === 'multiple_choice' || questionType === 'true_false') && (
                <div className="mb-3">
                  <label className="form-label">Options (one per line)</label>
                  <textarea 
                    value={questionOptions}
                    onChange={(e) => setQuestionOptions(e.target.value)}
                    className="form-control"
                    rows={3}
                  />
                </div>
              )}

              {(questionType === 'multiple_choice' || questionType === 'short_answer' || questionType === 'true_false') && (
                <div className="mb-3">
                  <label className="form-label">Correct Answer</label>
                  <input 
                    type="text" 
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    className="form-control"
                    placeholder="Enter the correct answer"
                  />
                </div>
              )}

              <div className="d-flex gap-2">
                <button 
                  className="btn btn-primary d-flex align-items-center gap-2"
                  onClick={handleSaveQuestion}
                >
                  <Save size={16} /> Save Question
                </button>
                <button 
                  className="btn btn-outline-secondary d-flex align-items-center gap-2"
                  onClick={resetQuestionForm}
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          )}

          {/* Questions List */}
          <div className="card-body p-4">
            {questions.length === 0 ? (
              <div className="text-center py-5">
                <div className="text-muted">
                  <p style={{ fontSize: '48px' }}>❓</p>
                  <p>No questions added yet. Click "Add Question" to get started.</p>
                </div>
              </div>
            ) : (
              <div className="row g-3">
                {questions.map((q, idx) => (
                  <div key={q.id} className="col-12">
                    <div className="card border-1" style={{ borderColor: '#e0e0e0', borderRadius: '8px' }}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="flex-grow-1">
                            <h6 className="mb-1">Q{idx + 1}: {q.title}</h6>
                            <div className="small text-muted mb-2">
                              <span className="badge bg-light text-dark me-2">{q.type?.replace('_', ' ')}</span>
                              <span className="badge bg-info text-white">{q.marks} marks</span>
                            </div>
                          </div>
                          <div className="d-flex gap-2">
                            <button 
                              className="btn btn-sm btn-outline-warning"
                              onClick={() => startEditQuestion(q)}
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteQuestion(q.id)}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="mb-2">{q.text}</p>
                        {q.options && Array.isArray(q.options) && q.options.length > 0 && (
                          <div className="small mb-2">
                            <strong>Options:</strong>
                            <ul className="mb-0 mt-1">
                              {q.options.map((opt: string, i: number) => (
                                <li key={i}>{opt}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {q.correct_answer && (
                          <div className="small text-success">
                            <strong>Correct Answer:</strong> {q.correct_answer}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Total Questions Summary */}
        <div className="row g-3 mt-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-gradient p-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <div className="text-white small fw-semibold">Total Questions</div>
              </div>
              <div className="card-body p-3 text-center">
                <div className="h3 fw-bold text-primary mb-0">{questions.length}</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-gradient p-3" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                <div className="text-white small fw-semibold">Total Marks</div>
              </div>
              <div className="card-body p-3 text-center">
                <div className="h3 fw-bold text-danger mb-0">
                  {questions.reduce((sum, q) => sum + (q.marks || 0), 0)}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-gradient p-3" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                <div className="text-white small fw-semibold">Assignment Total</div>
              </div>
              <div className="card-body p-3 text-center">
                <div className="h3 fw-bold text-info mb-0">{assignment.total_marks || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
