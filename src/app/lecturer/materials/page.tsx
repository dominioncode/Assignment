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
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Study Materials</h1>
          <p className="text-muted mb-0">Upload and manage course materials</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center"><Upload size={18} className="me-2" /> Upload Material</button>
      </div>

      {/* Search and Filter */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white"><Search size={18} /></span>
                <input type="text" placeholder="Search materials..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-control" />
              </div>
            </div>
            <div className="col-md-4">
              <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} className="form-select">
                <option value="all">All Courses</option>
                <option value="CS101">CS101 - Database Systems</option>
                <option value="CS102">CS102 - Web Development</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Materials Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Course</th>
                <th>Type</th>
                <th className="text-center">Views</th>
                <th>Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr key={material.id}>
                  <td className="fw-semibold">{material.title}</td>
                  <td>
                    <div className="fw-semibold">{material.course}</div>
                    <div className="small text-muted">{material.courseCode}</div>
                  </td>
                  <td><span className="badge bg-secondary text-capitalize">{material.type}</span></td>
                  <td className="text-center fw-semibold">{material.views}</td>
                  <td className="small text-muted">{material.uploadDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
