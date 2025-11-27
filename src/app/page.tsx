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
      <section className="text-center py-6 mb-5">
        <div className="container" style={{ maxWidth: 1100 }}>
          <div className="card p-4 shadow-sm border-0" style={{ background: 'linear-gradient(120deg, rgba(51,102,255,0.06), rgba(111,66,193,0.04))' }}>
            <div className="row align-items-center g-4">
              <div className="col-12 col-lg-7 text-start">
                <h1 className="display-5 fw-bold">Your Complete Study Management Platform</h1>
                <p className="lead text-muted mb-3">Manage assignments, coordinate group work, track results and streamline academic collaboration between students and lecturers — built for clarity and speed.</p>
                <div className="d-flex gap-2">
                  <Link href="/auth/register" className="btn btn-primary btn-lg">Create an account</Link>
                  <Link href="/auth/login" className="btn btn-outline btn-lg">Sign in <ArrowRight size={14} className="ms-2"/></Link>
                </div>
                <div className="mt-3 small text-muted">Trusted by students and lecturers to manage coursework with confidence</div>
              </div>
              <div className="col-12 col-lg-5 text-center d-none d-lg-block">
                <div style={{ width: 260, margin: '0 auto' }}>
                  <div className="card p-3 shadow-sm border-0">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <div className="fw-semibold">Assignment: Database Project</div>
                        <div className="small text-muted">Due in 3 days • Group</div>
                      </div>
                      <div className="text-end">
                        <div className="badge bg-primary">78%</div>
                      </div>
                    </div>
                    <div className="mt-3 progress" style={{ height: 8, borderRadius: 8 }}>
                      <div className="progress-bar bg-primary" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="mb-5">
            <div className="row g-3">
          {roles.map((item) => (
            <div key={item.role} className="col-12 col-md-6">
              <div
                className={`card h-100 ${selectedRole === item.role ? 'border-4 border-primary shadow-sm' : ''}`}
                onClick={() => setSelectedRole(item.role)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="text-muted">{item.description}</p>
                  <ul className="mb-3">
                    {item.features.map((feature, index) => (
                      <li key={index} className="text-muted small">{feature}</li>
                    ))}
                  </ul>
                  <Link
                    href={selectedRole === item.role ? `/auth/login?role=${item.role}` : '#'}
                    className={`btn ${selectedRole === item.role ? 'btn-primary' : 'btn-outline'}`}
                  >
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
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="p-2 rounded-3" style={{ background: 'linear-gradient(90deg,var(--brand-1),var(--brand-2))', color: 'white' }}>
                      <feature.icon size={20} />
                    </div>
                    <h5 className="mb-0">{feature.title}</h5>
                  </div>
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
