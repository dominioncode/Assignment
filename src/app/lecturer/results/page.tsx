'use client'

import React from 'react'
import { BarChart3, TrendingUp } from 'lucide-react'

export default function LecturerResultsPage() {
  const [selectedCourse, setSelectedCourse] = React.useState('all')
  const [selectedSemester, setSelectedSemester] = React.useState('first')

  const results = [
    {
      id: '1',
      studentName: 'John Doe',
      studentId: 'S001',
      course: 'CS101',
      courseName: 'Database Systems',
      marks: 85,
      totalMarks: 100,
      grade: 'A',
    },
    {
      id: '2',
      studentName: 'Jane Smith',
      studentId: 'S002',
      course: 'CS101',
      courseName: 'Database Systems',
      marks: 92,
      totalMarks: 100,
      grade: 'A+',
    },
  ]

  return (
    <main className="container-fluid" role="main">
      <div className="mb-3">
        <h1 className="h3 mb-1">Student Results</h1>
        <p className="text-muted mb-0">Review and publish semester results</p>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small">Semester</label>
              <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="form-select">
                <option value="first">First Semester</option>
                <option value="second">Second Semester</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small">Course</label>
              <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="form-select">
                <option value="all">All Courses</option>
                <option value="CS101">CS101 - Database Systems</option>
                <option value="CS102">CS102 - Web Development</option>
              </select>
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button className="btn btn-primary w-100">Publish Results</button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="card mb-4">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Student</th>
                <th>ID</th>
                <th>Course</th>
                <th className="text-center">Marks</th>
                <th className="text-center">Grade</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id}>
                  <td className="fw-semibold">{result.studentName}</td>
                  <td className="small text-muted">{result.studentId}</td>
                  <td>
                    <div className="fw-semibold">{result.course}</div>
                    <div className="small text-muted">{result.courseName}</div>
                  </td>
                  <td className="text-center"><span className="fw-semibold">{result.marks}</span><span className="text-muted"> / {result.totalMarks}</span></td>
                  <td className="text-center"><span className="badge bg-success fw-bold">{result.grade}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics */}
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="small text-muted">Average Marks</div>
                <div className="h4 mt-1">88.5</div>
              </div>
              <BarChart3 size={32} className="text-primary opacity-50" />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="small text-muted">Students Evaluated</div>
                <div className="h4 mt-1">{results.length}</div>
              </div>
              <TrendingUp size={32} className="text-success opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
