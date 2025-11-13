'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Users, FileText, BarChart3, Bell, LogOut, Menu } from 'lucide-react'
import type { User } from '@/lib/types'

interface DashboardLayoutProps {
  user: User
  onLogout?: () => void
  children: React.ReactNode
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  onLogout,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const menuItems =
    user.role === 'lecturer'
      ? [
          { icon: BookOpen, label: 'Assignments', href: '/lecturer/assignments' },
          { icon: Users, label: 'Groups', href: '/lecturer/groups' },
          { icon: FileText, label: 'Materials', href: '/lecturer/materials' },
          { icon: BarChart3, label: 'Results', href: '/lecturer/results' },
        ]
      : [
          { icon: BookOpen, label: 'My Assignments', href: '/student/assignments' },
          { icon: Users, label: 'My Groups', href: '/student/groups' },
          { icon: FileText, label: 'Study Materials', href: '/student/materials' },
          { icon: BarChart3, label: 'My Results', href: '/student/results' },
        ]

  return (
    <div className="flex h-screen bg-light">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-dark text-white transition-all duration-300 overflow-hidden`}
      >
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-2xl font-bold">StudyHub</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-dark/80 rounded-lg"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="mt-8 space-y-4 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-4 p-3 hover:bg-dark/80 rounded-lg transition-colors"
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="h-16 px-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-dark">Welcome, {user.name}</h2>
              <p className="text-sm text-gray-600">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
            </div>

            <div className="flex items-center space-x-6">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 hover:bg-light rounded-lg relative"
                >
                  <Bell size={20} className="text-dark" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
                </button>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-4 pl-6 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="font-semibold text-sm text-dark">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                </div>
                <img
                  src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <button
                  onClick={onLogout}
                  className="p-2 hover:bg-light rounded-lg text-dark"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
