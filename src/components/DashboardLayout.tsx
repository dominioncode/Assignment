"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { BookOpen, Users, FileText, BarChart3, Bell, LogOut, Menu } from 'lucide-react'
import ReducedMotionToggle from './ReducedMotionToggle'
import ApiStatusBanner from './ApiStatusBanner'
import SidebarNav from '@/components/admin/SidebarNav'
import type { User } from '@/lib/types'

// Load Bootstrap JS for offcanvas and dropdowns at runtime (client-only)

interface DashboardLayoutProps {
  user: User
  onLogout?: () => void
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, onLogout, children }) => {
  const [search, setSearch] = useState('')

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

  useEffect(() => {
    // dynamic import inside useEffect so this code only runs on the client
    ;(async () => {
      try {
        // @ts-ignore - bootstrap JS has no types for this path
        await import('bootstrap/dist/js/bootstrap.bundle.min.js')
      } catch (err) {
        // ignore if bootstrap JS cannot be loaded in some environments
        console.warn('Bootstrap JS failed to load:', err)
      }
    })()
  }, [])

  return (
    <div className="d-flex vh-100">
      <div className="offcanvas offcanvas-start" tabIndex={-1} id="sidebarOffcanvas">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">StudyHub</h5>
          <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body p-0">
          <SidebarNav items={menuItems.map((m) => ({ href: m.href, label: m.label, icon: React.createElement(m.icon, { size: 16 }) }))} />
        </div>
      </div>

      <aside className="d-none d-md-block bg-dark text-white" style={{ width: 240 }}>
        <div className="p-4">
          <h4 className="text-white">StudyHub</h4>
          <p className="text-muted small">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
        </div>
        <SidebarNav items={menuItems.map((m) => ({ href: m.href, label: m.label, icon: React.createElement(m.icon, { size: 16 }) }))} />
      </aside>

      <div className="flex-grow-1 d-flex flex-column">
        <header className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
          <div className="container-fluid">
            <button className="btn btn-outline-secondary d-md-none me-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarOffcanvas" aria-controls="#sidebarOffcanvas">
              <Menu size={18} />
            </button>

            <form className="d-flex me-auto" role="search" onSubmit={(e) => e.preventDefault()}>
              <input className="form-control me-2" type="search" placeholder="Search..." aria-label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
            </form>

            <div className="d-flex align-items-center">
              <ReducedMotionToggle />
              <button className="btn btn-light me-3 position-relative">
                <Bell />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">3</span>
              </button>

              <div className="d-flex align-items-center">
                <div className="text-end me-3 d-none d-sm-block">
                  <div className="fw-semibold">{user.name}</div>
                  <div className="small text-muted">{user.email}</div>
                </div>
                <div style={{ width: 44, height: 44, position: 'relative' }} className="rounded-circle overflow-hidden">
                  <Image
                    src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    width={44}
                    height={44}
                    className="rounded-circle"
                  />
                </div>
                <button className="btn btn-link text-dark ms-2" onClick={onLogout} title="Logout">
                  <LogOut />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 overflow-auto" style={{ background: '#f8f9fa' }}>
          <ApiStatusBanner />
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
