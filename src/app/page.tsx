'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Users,
  BarChart3,
  Lock,
  LogIn,
  ArrowRight,
  CheckCircle,
  Zap,
  Globe,
} from 'lucide-react'

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<'student' | 'lecturer' | null>(null)

  const features = [
    {
      icon: BookOpen,
      title: 'Manage Assignments',
      description: 'Create, track, and grade individual and group assignments with ease',
    },
    {
      icon: Users,
      title: 'Group Coordination',
      description: 'Form groups, communicate, and collaborate seamlessly on group projects',
    },
    {
      icon: BarChart3,
      title: 'Track Results',
      description: 'View results semester by semester with detailed grade breakdowns',
    },
    {
      icon: Zap,
      title: 'Real-time Notifications',
      description: 'Stay updated with instant notifications about assignments and submissions',
    },
    {
      icon: Globe,
      title: 'Material Sharing',
      description: 'Share study materials, resources, and course documents efficiently',
    },
    {
      icon: Lock,
      title: 'Secure Access',
      description: 'Role-based access control ensuring data privacy and security',
    },
  ]

  const roles = [
    {
      role: 'student' as const,
      title: 'Student',
      description: 'Manage your assignments, join groups, and track your academic progress',
      features: [
        'View all assignments with due dates',
        'Track submission status',
        'Join and manage groups',
        'View semester results',
        'Access study materials',
      ],
    },
    {
      role: 'lecturer' as const,
      title: 'Lecturer',
      description: 'Create assignments, manage groups, and grade submissions',
      features: [
        'Create and manage assignments',
        'Organize student groups',
        'Grade and provide feedback',
        'Upload study materials',
        'Track student progress',
      ],
    },
  ]

  return (
    <div className="container-fluid py-5">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <BookOpen size={28} />
          <span className="h5 mb-0">StudyHub</span>
        </div>
        <div>
          <button className="btn btn-link me-2">Documentation</button>
          <button className="btn btn-link">Support</button>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center py-5 mb-4">
        <h1 className="display-6 fw-bold">Your Complete Study Management Platform</h1>
        <p className="lead text-muted">Manage assignments, coordinate group work, track results, and streamline academic collaboration between students and lecturers</p>
      </section>

      {/* Role Selection */}
      <section className="mb-5">
        <div className="row g-3">
          {roles.map((item) => (
            <div key={item.role} className="col-12 col-md-6">
              <div className={`card ${selectedRole === item.role ? 'border-primary' : ''}`} onClick={() => setSelectedRole(item.role)} style={{ cursor: 'pointer' }}>
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="text-muted">{item.description}</p>
                  <ul className="mb-3">
                    {item.features.map((feature, index) => (
                      <li key={index} className="text-muted small">{feature}</li>
                    ))}
                  </ul>
                  <Link href={selectedRole === item.role ? `/auth/login?role=${item.role}` : '#'} className={`btn ${selectedRole === item.role ? 'btn-primary' : 'btn-outline-light'}`}>
                    Get Started <ArrowRight size={16} className="ms-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mb-5">
        <h2 className="h4 mb-3 text-center">Why Choose StudyHub?</h2>
        <div className="row g-3">
          {features.map((feature, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <feature.icon size={28} className="mb-3" />
                  <h5 className="card-title">{feature.title}</h5>
                  <p className="text-muted">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center mb-5">
        <h3>Ready to Get Started?</h3>
        <p className="text-muted">Choose your role above and start managing your academic journey today</p>
        {!selectedRole && <p className="text-muted small">Select your role above to continue</p>}
      </section>

      <footer className="text-center text-muted py-4">
        <small>&copy; 2025 StudyHub. All rights reserved.</small>
      </footer>
    </div>
  )
}
