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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Student Results</h1>
        <p className="text-gray-600">Review and publish semester results</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="first">First Semester</option>
              <option value="second">Second Semester</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Courses</option>
              <option value="CS101">CS101 - Database Systems</option>
              <option value="CS102">CS102 - Web Development</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">&nbsp;</label>
            <button className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors">
              Publish Results
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-sm text-gray-700">Student</th>
              <th className="text-left px-6 py-3 font-semibold text-sm text-gray-700">ID</th>
              <th className="text-left px-6 py-3 font-semibold text-sm text-gray-700">Course</th>
              <th className="text-center px-6 py-3 font-semibold text-sm text-gray-700">Marks</th>
              <th className="text-center px-6 py-3 font-semibold text-sm text-gray-700">Grade</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={result.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 font-semibold text-dark">{result.studentName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{result.studentId}</td>
                <td className="px-6 py-4 text-sm">
                  <p className="font-semibold">{result.course}</p>
                  <p className="text-gray-600">{result.courseName}</p>
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <span className="font-semibold text-dark">{result.marks}</span>
                  <span className="text-gray-500"> / {result.totalMarks}</span>
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-bold">
                    {result.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Average Marks</p>
              <p className="text-3xl font-bold text-dark mt-2">88.5</p>
            </div>
            <BarChart3 size={32} className="text-primary opacity-50" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Students Evaluated</p>
              <p className="text-3xl font-bold text-dark mt-2">{results.length}</p>
            </div>
            <TrendingUp size={32} className="text-success opacity-50" />
          </div>
        </div>
      </div>
    </div>
  )
}
