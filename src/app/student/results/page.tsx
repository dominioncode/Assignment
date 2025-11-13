'use client'

import React, { useState } from 'react'
import { BarChart3, TrendingUp, Award } from 'lucide-react'
import type { Semester } from '@/lib/types'

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

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      'A+': 'text-green-600 bg-green-50',
      A: 'text-green-600 bg-green-50',
      'B+': 'text-blue-600 bg-blue-50',
      B: 'text-blue-600 bg-blue-50',
      'C+': 'text-yellow-600 bg-yellow-50',
      C: 'text-yellow-600 bg-yellow-50',
      D: 'text-orange-600 bg-orange-50',
      F: 'text-red-600 bg-red-50',
    }
    return colors[grade] || 'text-gray-600 bg-gray-50'
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">My Results</h1>
        <p className="text-gray-600">View your semester-based results and grades</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value as Semester)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="first">First Semester</option>
              <option value="second">Second Semester</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {[2021, 2022, 2023, 2024, 2025].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-semibold">Average Percentage</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{averagePercentage}%</p>
            </div>
            <BarChart3 size={32} className="text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-semibold">Total Marks</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {totalMarks}/{maximumMarks}
              </p>
            </div>
            <TrendingUp size={32} className="text-green-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-semibold">Courses</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{sampleResults.length}</p>
            </div>
            <Award size={32} className="text-purple-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-sm text-gray-700">Course</th>
              <th className="text-left px-6 py-3 font-semibold text-sm text-gray-700">Code</th>
              <th className="text-center px-6 py-3 font-semibold text-sm text-gray-700">Marks</th>
              <th className="text-center px-6 py-3 font-semibold text-sm text-gray-700">Grade</th>
              <th className="text-center px-6 py-3 font-semibold text-sm text-gray-700">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {sampleResults.map((result, index) => (
              <tr key={result.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 text-sm font-semibold text-dark">{result.courseName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{result.courseCode}</td>
                <td className="px-6 py-4 text-sm text-center">
                  <span className="font-semibold text-dark">{result.obtainedMarks}</span>
                  <span className="text-gray-500"> / {result.totalMarks}</span>
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <span className={`px-3 py-1 rounded-full font-bold ${getGradeColor(result.grade)}`}>
                    {result.grade}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <span className="font-semibold text-dark">
                    {Math.round((result.obtainedMarks / result.totalMarks) * 100)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* GPA Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-dark mb-2">Semester Performance</h3>
        <p className="text-gray-600 mb-4">
          You have completed <strong>{sampleResults.length} courses</strong> in {selectedSemester === 'first' ? 'First' : 'Second'} Semester {selectedYear}.
          Your current average is <strong>{averagePercentage}%</strong> across all courses.
        </p>
        <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
          Download Transcript →
        </button>
      </div>
    </div>
  )
}
