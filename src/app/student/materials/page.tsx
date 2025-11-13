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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark mb-2">Study Materials</h1>
        <p className="text-gray-600">Access course materials and resources</p>
      </div>

      <div className="space-y-4">
        {materials.map((material) => (
          <div key={material.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="mt-1">{getFileIcon(material.type)}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-dark mb-1">{material.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">Course: {material.course}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{material.uploadDate}</span>
                    <span>{material.size}</span>
                    <span className="capitalize px-2 py-1 bg-blue-50 text-blue-700 rounded">{material.type}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-primary">
                <Download size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
