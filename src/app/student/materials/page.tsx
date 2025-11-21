'use client'

import React from 'react'
import { Download, FileText, Play } from 'lucide-react'

export default function StudentMaterialsPage() {
  const materials = [
    {
      id: '1',
      title: 'Database Fundamentals',
      course: 'CS101',
      type: 'pdf',
      uploadDate: '2024-01-20',
      size: '2.5 MB',
    },
    {
      id: '2',
      title: 'Web Development Best Practices',
      course: 'CS102',
      type: 'video',
      uploadDate: '2024-01-18',
      size: '45 MB',
    },
    {
      id: '3',
      title: 'Lecture 5: HTML & CSS',
      course: 'CS102',
      type: 'document',
      uploadDate: '2024-01-15',
      size: '1.2 MB',
    },
  ]

  const getFileIcon = (type: string) => {
    if (type === 'video') return <Play className="text-red-600" size={24} />
    return <FileText className="text-blue-600" size={24} />
  }

  return (
    <div className="container-fluid">
      <div className="mb-3">
        <h1 className="h3 mb-1">Study Materials</h1>
        <p className="text-muted mb-0">Access course materials and resources</p>
      </div>

      <div className="row g-3">
        {materials.map((material) => (
          <div key={material.id} className="col-12">
            <div className="card">
              <div className="card-body d-flex align-items-start justify-content-between">
                <div className="d-flex align-items-start gap-3">
                  <div className="mt-1">{getFileIcon(material.type)}</div>
                  <div>
                    <h5 className="card-title mb-1">{material.title}</h5>
                    <div className="small text-muted mb-2">Course: {material.course}</div>
                    <div className="small text-muted">
                      <span className="me-3">{material.uploadDate}</span>
                      <span className="me-3">{material.size}</span>
                      <span className="badge bg-light text-dark text-capitalize">{material.type}</span>
                    </div>
                  </div>
                </div>
                <button className="btn btn-outline-primary btn-sm"><Download /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
