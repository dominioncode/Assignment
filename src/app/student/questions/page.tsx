'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { StudentAnswer } from '@/lib/types'
import DashboardLayout from '@/components/DashboardLayout'
import { generateId } from '@/lib/utils'

export default function StudentQuestionsPage() {
  const store = useAppStore()
  const [selectedQuestionSet, setSelectedQuestionSet] = useState<string>('')
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({})
  const [submitted, setSubmitted] = useState(false)
  const [submittedSetId, setSubmittedSetId] = useState<string | null>(null)

  const questionSets = store.questionSets
  const selectedSet = questionSets.find((qs) => qs.id === selectedQuestionSet)
  const setQuestions = selectedSet
    ? store.questions.filter((q) => selectedSet.questions.includes(q.id))
    : []

  const studentId = 'student-001' // Should be from auth context
  const currentUser = {
    id: studentId,
    name: 'John Doe',
    email: 'john.doe@university.edu',
    role: 'student' as const,
    department: 'Computer Science',
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer })
  }

  const handleSubmitAnswers = () => {
    if (!selectedQuestionSet) {
      alert('Please select a question set')
      return
    }

    if (setQuestions.length === 0) {
      alert('No questions in this set')
      return
    }

    // Create student answers
    const studentAnswers: StudentAnswer[] = setQuestions.map((q) => ({
      id: generateId(),
      questionId: q.id,
      questionSetId: selectedQuestionSet,
      studentId: studentId,
      answer: answers[q.id] || '',
      status: 'submitted',
      submittedAt: new Date(),
    }))

    // Submit all answers
    studentAnswers.forEach((sa) => store.submitAnswer(sa))

    // Create question response
    store.createResponse({
      id: generateId(),
      questionSetId: selectedQuestionSet,
      studentId: studentId,
      answers: studentAnswers,
      totalMarks: selectedSet?.totalMarks || 0,
      status: 'submitted',
      submittedAt: new Date(),
    })

    setSubmitted(true)
    setSubmittedSetId(selectedQuestionSet)
    setAnswers({})
    setTimeout(() => {
      setSubmitted(false)
      setSelectedQuestionSet('')
    }, 3000)
  }

  const studentResponses = store.getResponsesByStudent(studentId)

  return (
    <DashboardLayout user={currentUser}>
      <div className="container-fluid py-4">
        <h1 className="h3 mb-4">Answer Questions</h1>

        {submitted && (
          <div className="alert alert-success alert-dismissible fade show">
            <strong>Success!</strong> Your answers have been submitted.
            <button
              type="button"
              className="btn-close"
              onClick={() => setSubmitted(false)}
            ></button>
          </div>
        )}

        <div className="row">
          <div className="col-md-8">
            {/* Question Set Selector */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Available Question Sets</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Select a Question Set</label>
                  <select
                    className="form-select"
                    value={selectedQuestionSet}
                    onChange={(e) => {
                      setSelectedQuestionSet(e.target.value)
                      setAnswers({})
                    }}
                  >
                    <option value="">-- Choose a Question Set --</option>
                    {questionSets.map((qs) => (
                      <option key={qs.id} value={qs.id}>
                        {qs.title} ({qs.totalMarks} marks) - Due: {qs.dueDate.toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Questions Display */}
            {selectedQuestionSet && setQuestions.length > 0 ? (
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">{selectedSet?.title}</h5>
                  <small className="text-muted">{selectedSet?.description}</small>
                </div>
                <div className="card-body">
                  {setQuestions.map((question, index) => (
                    <div key={question.id} className="mb-4 pb-4 border-bottom">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h6 className="mb-0">
                          Question {index + 1}: {question.title}
                        </h6>
                        <span className="badge bg-info">{question.marks} marks</span>
                      </div>

                      <p className="mb-3">{question.text}</p>

                      {question.type === 'multiple-choice' && question.options ? (
                        <div className="mb-3">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="form-check mb-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name={`q-${question.id}`}
                                id={`q-${question.id}-opt-${optIndex}`}
                                value={option}
                                checked={answers[question.id] === option}
                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`q-${question.id}-opt-${optIndex}`}
                              >
                                {String.fromCharCode(65 + optIndex)}) {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : question.type === 'true-false' ? (
                        <div className="mb-3">
                          {['True', 'False'].map((option) => (
                            <div key={option} className="form-check mb-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name={`q-${question.id}`}
                                id={`q-${question.id}-${option}`}
                                value={option}
                                checked={answers[question.id] === option}
                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              />
                              <label className="form-check-label" htmlFor={`q-${question.id}-${option}`}>
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mb-3">
                          <textarea
                            className="form-control"
                            rows={question.type === 'essay' ? 5 : 2}
                            value={answers[question.id] || ''}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            placeholder="Enter your answer here..."
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="d-flex gap-2 mt-4">
                    <button className="btn btn-primary" onClick={handleSubmitAnswers}>
                      Submit Answers
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setSelectedQuestionSet('')
                        setAnswers({})
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : selectedQuestionSet ? (
              <div className="alert alert-warning">No questions found in this set.</div>
            ) : (
              <div className="alert alert-info">Select a question set to start answering questions.</div>
            )}
          </div>

          {/* Submitted Responses Sidebar */}
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Your Submissions</h5>
              </div>
              <div className="card-body">
                {studentResponses.length > 0 ? (
                  studentResponses.map((response) => {
                    const qSet = questionSets.find((qs) => qs.id === response.questionSetId)
                    return (
                      <div key={response.id} className="mb-3 pb-3 border-bottom">
                        <h6 className="mb-1">{qSet?.title}</h6>
                        <small className="text-muted d-block mb-2">
                          Submitted: {response.submittedAt?.toLocaleDateString()}
                        </small>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="badge bg-secondary">
                            Status: {response.status}
                          </span>
                          {response.obtainedMarks !== undefined && (
                            <span className="badge bg-success">
                              {response.obtainedMarks}/{response.totalMarks}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-muted">No submissions yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
