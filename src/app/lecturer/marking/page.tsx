'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import DashboardLayout from '@/components/DashboardLayout'

export default function MarkingPage() {
  const store = useAppStore()
  const [selectedQuestionSet, setSelectedQuestionSet] = useState<string>('')
  const [markingStudentId, setMarkingStudentId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ [answerId: string]: string }>({})
  const [marks, setMarks] = useState<{ [answerId: string]: number }>({})

  const currentUser = {
    id: 'lecturer-001',
    name: 'Dr. Sarah Smith',
    email: 'sarah.smith@university.edu',
    role: 'lecturer' as const,
    department: 'Computer Science',
  }

  const questionSets = store.questionSets
  const selectedSet = questionSets.find((qs) => qs.id === selectedQuestionSet)

  const responses =
    selectedQuestionSet && markingStudentId === null
      ? store.getResponsesByQuestionSet(selectedQuestionSet)
      : markingStudentId && selectedQuestionSet
      ? store
          .getResponsesByStudent(markingStudentId)
          .filter((r) => r.questionSetId === selectedQuestionSet)
      : []

  const currentResponse = markingStudentId
    ? responses.find((r) => r.questionSetId === selectedQuestionSet)
    : null

  const setQuestions = selectedSet
    ? store.questions.filter((q) => selectedSet.questions.includes(q.id))
    : []

  const handleMarkAnswer = (answerId: string, marksGiven: number) => {
    setMarks({ ...marks, [answerId]: marksGiven })
  }

  const handleAddFeedback = (answerId: string, feedbackText: string) => {
    setFeedback({ ...feedback, [answerId]: feedbackText })
  }

  const handleSubmitMarking = () => {
    if (!currentResponse) return

    const totalObtained = currentResponse.answers.reduce((sum, answer) => {
      return sum + (marks[answer.id] || 0)
    }, 0)

    // Update all answers with marks and feedback
    currentResponse.answers.forEach((answer) => {
      if (marks[answer.id] !== undefined || feedback[answer.id]) {
        store.updateAnswer(answer.id, {
          marksObtained: marks[answer.id],
          feedback: feedback[answer.id],
          status: 'marked',
          markedAt: new Date(),
          markedBy: currentUser.id,
        })
      }
    })

    // Update response as marked
    store.updateResponse(currentResponse.id, {
      status: 'marked',
      obtainedMarks: totalObtained,
      markedAt: new Date(),
    })

    alert('Marking submitted successfully!')
    setMarkingStudentId(null)
    setMarks({})
    setFeedback({})
  }

  return (
    <DashboardLayout user={currentUser}>
      <div className="container-fluid py-4">
        <h1 className="h3 mb-4">Mark Student Answers</h1>

        <div className="row mb-4">
          <div className="col-md-6">
            <label className="form-label">Select Question Set</label>
            <select
              className="form-select"
              value={selectedQuestionSet}
              onChange={(e) => {
                setSelectedQuestionSet(e.target.value)
                setMarkingStudentId(null)
              }}
            >
              <option value="">-- Choose a Question Set --</option>
              {questionSets.map((qs) => (
                <option key={qs.id} value={qs.id}>
                  {qs.title} ({qs.totalMarks} marks)
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedQuestionSet && !markingStudentId && (
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Student Submissions</h5>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Student ID</th>
                        <th>Submission Date</th>
                        <th>Status</th>
                        <th>Marks</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {responses.length > 0 ? (
                        responses.map((response) => (
                          <tr key={response.id}>
                            <td>
                              <strong>{response.studentId}</strong>
                            </td>
                            <td>{response.submittedAt?.toLocaleDateString()}</td>
                            <td>
                              <span
                                className={`badge ${
                                  response.status === 'marked' ? 'bg-success' : 'bg-warning'
                                }`}
                              >
                                {response.status}
                              </span>
                            </td>
                            <td>
                              {response.obtainedMarks !== undefined ? (
                                <strong>
                                  {response.obtainedMarks}/{response.totalMarks}
                                </strong>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => setMarkingStudentId(response.studentId)}
                              >
                                Mark
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center text-muted">
                            No submissions for this question set yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {markingStudentId && currentResponse && (
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">Marking Submission</h5>
                    <small className="text-muted">Student: {currentResponse.studentId}</small>
                  </div>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => {
                      setMarkingStudentId(null)
                      setMarks({})
                      setFeedback({})
                    }}
                  >
                    Back to Submissions
                  </button>
                </div>
                <div className="card-body">
                  {currentResponse.answers.map((answer, index) => {
                    const question = setQuestions.find((q) => q.id === answer.questionId)
                    const maxMarks = question?.marks || 0

                    return (
                      <div key={answer.id} className="mb-5 pb-4 border-bottom">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h6 className="mb-1">Question {index + 1}: {question?.title}</h6>
                            <small className="text-muted">{question?.type.replace('-', ' ').toUpperCase()}</small>
                          </div>
                          <span className="badge bg-info">{maxMarks} marks</span>
                        </div>

                        <div className="bg-light p-3 rounded mb-3">
                          <p className="mb-0">
                            <strong>Question:</strong> {question?.text}
                          </p>
                        </div>

                        <div className="bg-light p-3 rounded mb-3">
                          <p className="mb-0">
                            <strong>Student Answer:</strong>
                          </p>
                          <p className="mt-2 mb-0">{answer.answer}</p>
                        </div>

                        {question?.correctAnswer && (
                          <div className="bg-light p-3 rounded mb-3">
                            <p className="mb-0">
                              <strong>Correct Answer:</strong>
                            </p>
                            <p className="mt-2 mb-0 text-success">{question.correctAnswer}</p>
                          </div>
                        )}

                        <div className="row">
                          <div className="col-md-3 mb-3">
                            <label className="form-label">Marks Obtained</label>
                            <div className="input-group">
                              <input
                                type="number"
                                className="form-control"
                                value={marks[answer.id] || 0}
                                onChange={(e) =>
                                  handleMarkAnswer(answer.id, parseInt(e.target.value) || 0)
                                }
                                min="0"
                                max={maxMarks}
                              />
                              <span className="input-group-text">/{maxMarks}</span>
                            </div>
                          </div>
                          <div className="col-md-9 mb-3">
                            <label className="form-label">Feedback</label>
                            <textarea
                              className="form-control"
                              rows={2}
                              value={feedback[answer.id] || ''}
                              onChange={(e) => handleAddFeedback(answer.id, e.target.value)}
                              placeholder="Enter feedback for this answer..."
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  <div className="d-flex gap-2 mt-4">
                    <button className="btn btn-success" onClick={handleSubmitMarking}>
                      Submit Marking
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setMarkingStudentId(null)
                        setMarks({})
                        setFeedback({})
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!selectedQuestionSet && (
          <div className="alert alert-info">Select a question set to view and mark student submissions.</div>
        )}
      </div>
    </DashboardLayout>
  )
}
