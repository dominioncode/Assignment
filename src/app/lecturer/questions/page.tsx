'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Question, QuestionType } from '@/lib/types'
import DashboardLayout from '@/components/DashboardLayout'
import { generateId } from '@/lib/utils'

const questionTypes: QuestionType[] = ['multiple-choice', 'short-answer', 'essay', 'true-false', 'fill-blank']

export default function LecturerQuestionsPage() {
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

  // Form state
  const [formData, setFormData] = useState<Partial<Question>>({
    type: 'multiple-choice',
    marks: 5,
    options: ['', '', '', ''],
  })

  const courses = store.courses
  const questions = selectedCourse ? store.getQuestionsByCourse(selectedCourse) : []

  const handleAddQuestion = () => {
    setEditingId(null)
    setFormData({
      type: 'multiple-choice',
      marks: 5,
      options: ['', '', '', ''],
    })
    setShowForm(true)
  }

  const handleEditQuestion = (question: Question) => {
    setEditingId(question.id)
    setFormData(question)
    setShowForm(true)
  }

  const handleSaveQuestion = () => {
    if (!selectedCourse || !formData.text || !formData.title) {
      alert('Please fill all required fields')
      return
    }

    if (editingId) {
      store.updateQuestion(editingId, formData)
    } else {
      const newQuestion: Question = {
        id: generateId(),
        title: formData.title!,
        description: formData.description || '',
        type: formData.type || 'multiple-choice',
        courseId: selectedCourse,
        text: formData.text!,
        options: formData.options,
        correctAnswer: formData.correctAnswer,
        marks: formData.marks || 5,
        createdBy: 'lecturer-001', // Should be from auth context
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      store.addQuestion(newQuestion)
    }

    setShowForm(false)
    setFormData({ type: 'multiple-choice', marks: 5, options: ['', '', '', ''] })
  }

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      store.deleteQuestion(id)
    }
  }

  return (
    <DashboardLayout user={currentUser}>
      <div className="container-fluid py-4">
        <div className="row mb-4">
          <div className="col-md-6">
            <h1 className="h3">Question Management</h1>
          </div>
          <div className="col-md-6 text-end">
            <button className="btn btn-primary" onClick={handleAddQuestion}>
              + Add Question
            </button>
          </div>
        </div>

        {/* Course Selector */}
        <div className="row mb-4">
          <div className="col-md-4">
            <label className="form-label">Select Course</label>
            <select
              className="form-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">-- Select a Course --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-8">
            {selectedCourse && (
              <div className="alert alert-info">
                <strong>Total Questions:</strong> {questions.length}
              </div>
            )}
          </div>
        </div>

        {/* Question Form Modal */}
        {showForm && (
          <div className="card mb-4 border-primary">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">{editingId ? 'Edit Question' : 'Add New Question'}</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Question Title *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Python Variables"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Question Description</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Question Type *</label>
                  <select
                    className="form-select"
                    value={formData.type || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as QuestionType })
                    }
                  >
                    {questionTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.replace('-', ' ').toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Marks *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.marks || 5}
                    onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) })}
                    min="1"
                    max="100"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Question Text *</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={formData.text || ''}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="Enter the question"
                />
              </div>

              {(formData.type === 'multiple-choice' || formData.type === 'true-false') && (
                <div className="mb-3">
                  <label className="form-label">Options</label>
                  {formData.options?.map((option, index) => (
                    <div key={index} className="input-group mb-2">
                      <span className="input-group-text">{String.fromCharCode(65 + index)}</span>
                      <input
                        type="text"
                        className="form-control"
                        value={option || ''}
                        onChange={(e) => {
                          const newOptions = [...(formData.options || [])]
                          newOptions[index] = e.target.value
                          setFormData({ ...formData, options: newOptions })
                        }}
                        placeholder={`Option ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {(formData.type === 'multiple-choice' ||
                formData.type === 'true-false' ||
                formData.type === 'fill-blank') && (
                <div className="mb-3">
                  <label className="form-label">Correct Answer *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.correctAnswer || ''}
                    onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                    placeholder="Enter the correct answer"
                  />
                </div>
              )}

              <div className="d-flex gap-2">
                <button className="btn btn-success" onClick={handleSaveQuestion}>
                  Save Question
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Questions List */}
        <div className="row">
          {selectedCourse ? (
            questions.length > 0 ? (
              questions.map((question) => (
                <div key={question.id} className="col-md-6 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="card-title mb-1">{question.title}</h6>
                          <small className="text-muted">{question.type.replace('-', ' ').toUpperCase()}</small>
                        </div>
                        <span className="badge bg-info">{question.marks} marks</span>
                      </div>
                      <p className="card-text mb-3">{question.text}</p>
                      {question.options && question.options.length > 0 && (
                        <div className="mb-3">
                          <small className="text-muted d-block mb-1">Options:</small>
                          {question.options.map((opt, idx) => (
                            <small key={idx} className="d-block">
                              {String.fromCharCode(65 + idx)}) {opt}
                            </small>
                          ))}
                        </div>
                      )}
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleEditQuestion(question)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="alert alert-info">No questions yet. Click "Add Question" to create one.</div>
              </div>
            )
          ) : (
            <div className="col-12">
              <div className="alert alert-warning">Select a course to view and manage questions.</div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
