'use client'

export const dynamic = 'force-dynamic'

import ProfileWidget from '@/components/ProfileWidget'
import DashboardLayout from '@/components/DashboardLayout'

const currentUser = {
  id: 'student-001',
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'student' as const,
  department: 'Computer Science',
}

export default function ProfilePage() {
  return (
    <DashboardLayout user={currentUser}>
      <div className="container py-4">
        <h1 className="h3 mb-3">My Profile</h1>
        <ProfileWidget />
        <div className="card">
          <div className="card-body">
            <p>This page demonstrates fetching a protected API using the stored JWT.</p>
            <p>Open the browser console to see request/response when you implement login/register.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
