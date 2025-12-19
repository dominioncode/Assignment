"use client"

import React, { useState } from 'react'
import { BarChart3, TrendingUp, Award } from 'lucide-react'
import type { Semester } from '@/lib/types'
import { getGradeColor } from '@/lib/utils'

export default function StudentResultsPage() {
  const [selectedSemester, setSelectedSemester] = useState<Semester>('first')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Sample semester results
  const sampleResults = [
    {
      id: '1',
      courseCode: 'CS101',
      courseName: 'Database Systems',
      totalMarks: 100,
      obtainedMarks: 85,
      grade: 'A',
    },
    {
      id: '2',
      courseCode: 'CS102',
      courseName: 'Web Development',
      totalMarks: 100,
      obtainedMarks: 92,
      grade: 'A+',
    },
    {
      id: '3',
      courseCode: 'MATH201',
      courseName: 'Linear Algebra',
      totalMarks: 100,
      obtainedMarks: 78,
      grade: 'B+',
    },
    {
      id: '4',
      courseCode: 'ENG105',
      courseName: 'Technical Writing',
      totalMarks: 100,
      obtainedMarks: 88,
      grade: 'A',
    },
  ]

  const totalMarks = sampleResults.reduce((sum, r) => sum + r.obtainedMarks, 0)
  const maximumMarks = sampleResults.reduce((sum, r) => sum + r.totalMarks, 0)
  const averagePercentage = Math.round((totalMarks / maximumMarks) * 100)

  // now using getGradeColor from utils which returns Bootstrap classes

  return (
    <main className="container-fluid" role="main">
      <div className="mb-3">
        <h1 className="h3 mb-1">My Results</h1>
        <p className="text-muted mb-0">View your semester-based results and grades</p>
      </div>

      {/* Filters */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small">Semester</label>
              <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value as Semester)} className="form-select">
                <option value="first">First Semester</option>
                <option value="second">Second Semester</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small">Year</label>
              <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="form-select">
                {[2021, 2022, 2023, 2024, 2025].map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card p-3 border-0 shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="small text-muted">Average Percentage</div>
                <div className="h4 mt-1">{averagePercentage}%</div>
              </div>
              <BarChart3 size={32} className="text-primary opacity-50" />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 border-0 shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="small text-muted">Total Marks</div>
                <div className="h4 mt-1">{totalMarks}/{maximumMarks}</div>
              </div>
              <TrendingUp size={32} className="text-success opacity-50" />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 border-0 shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="small text-muted">Courses</div>
                <div className="h4 mt-1">{sampleResults.length}</div>
              </div>
              <Award size={32} className="text-purple-600 opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle table-theme">
            <thead className="table-light">
              <tr>
                <th>Course</th>
                <th>Code</th>
                <th className="text-center">Marks</th>
                <th className="text-center">Grade</th>
                <th className="text-center">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {sampleResults.map((result) => (
                <tr key={result.id}>
                  <td className="fw-semibold">{result.courseName}</td>
                  <td className="small text-muted">{result.courseCode}</td>
                  <td className="text-center"><span className="fw-semibold">{result.obtainedMarks}</span> <span className="text-muted">/ {result.totalMarks}</span></td>
                  <td className="text-center"><span className={`badge ${getGradeColor(result.grade)}`}>{result.grade}</span></td>
                  <td className="text-center"><span className="fw-semibold">{Math.round((result.obtainedMarks / result.totalMarks) * 100)}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GPA Info */}
      <div className="card p-3 assignment-card border-0 shadow-sm">
        <div className="mb-2">Semester Performance</div>
        <p className="text-muted mb-3">You have completed <strong>{sampleResults.length} courses</strong> in {selectedSemester === 'first' ? 'First' : 'Second'} Semester {selectedYear}. Your current average is <strong>{averagePercentage}%</strong> across all courses.</p>
        <button aria-label="Download transcript" className="btn btn-link p-0">Download Transcript →</button>
      </div>
    </main>
  )
}
