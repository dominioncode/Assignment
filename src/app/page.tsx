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
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark to-secondary">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="text-primary" size={32} />
            <span className="text-2xl font-bold text-white">StudyHub</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-white hover:text-primary transition-colors">Documentation</button>
            <button className="text-white hover:text-primary transition-colors">Support</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Your Complete Study Management Platform
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Manage assignments, coordinate group work, track results, and streamline academic collaboration
          between students and lecturers
        </p>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {roles.map((item) => (
            <div
              key={item.role}
              onClick={() => setSelectedRole(item.role)}
              className={`p-8 rounded-lg border-2 cursor-pointer transition-all ${
                selectedRole === item.role
                  ? 'bg-primary/20 border-primary'
                  : 'bg-white/10 border-white/20 hover:border-primary/50 hover:bg-white/15'
              }`}
            >
              <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-300 mb-4">{item.description}</p>
              <ul className="space-y-2 text-left mb-6">
                {item.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2 text-gray-300">
                    <CheckCircle size={18} className="text-success mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={selectedRole === item.role ? `/auth/login?role=${item.role}` : '#'}
                className={`inline-flex items-center space-x-2 px-6 py-2 rounded-lg font-semibold transition-colors ${
                  selectedRole === item.role
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <span>Get Started</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/5 backdrop-blur-md py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Why Choose StudyHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20">
                <feature.icon className="text-primary mb-4" size={32} />
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
        <p className="text-xl text-gray-300 mb-8">
          Choose your role above and start managing your academic journey today
        </p>
        {!selectedRole && (
          <p className="text-gray-400 text-sm">Select your role above to continue</p>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
          <p>&copy; 2025 StudyHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
