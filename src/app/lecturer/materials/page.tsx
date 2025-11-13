'use client'

import React from 'react'
import { Upload, Search, Filter } from 'lucide-react'

export default function LecturerMaterialsPage() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [filterCourse, setFilterCourse] = React.useState('all')

  const materials = [
    {
      id: '1',
      title: 'Database Fundamentals',
      course: 'CS101',
      courseCode: 'Database Systems',
      type: 'pdf',
      uploadDate: '2024-01-20',
      views: 125,
    },
    {
      id: '2',
      title: 'Web Development Best Practices',
      course: 'CS102',
      courseCode: 'Web Development',
      type: 'video',
      uploadDate: '2024-01-18',
      views: 89,
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2">Study Materials</h1>
          <p className="text-gray-600">Upload and manage course materials</p>
        </div>
        <button className="flex items-center space-x-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors">
          <Upload size={20} />
          <span>Upload Material</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Courses</option>
            <option value="CS101">CS101 - Database Systems</option>
            <option value="CS102">CS102 - Web Development</option>
          </select>
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-sm text-gray-700">Title</th>
              <th className="text-left px-6 py-3 font-semibold text-sm text-gray-700">Course</th>
              <th className="text-left px-6 py-3 font-semibold text-sm text-gray-700">Type</th>
              <th className="text-center px-6 py-3 font-semibold text-sm text-gray-700">Views</th>
              <th className="text-left px-6 py-3 font-semibold text-sm text-gray-700">Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material, index) => (
              <tr key={material.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 font-semibold text-dark">{material.title}</td>
                <td className="px-6 py-4 text-sm">
                  <p className="font-semibold">{material.course}</p>
                  <p className="text-gray-600">{material.courseCode}</p>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">
                    {material.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-center text-dark font-semibold">
                  {material.views}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{material.uploadDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
