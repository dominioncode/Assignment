"use client"

import React from 'react'
import AdminCard from '@/components/admin/AdminCard'
import AdminTable from '@/components/admin/AdminTable'
import Link from 'next/link'

export default function StyleGuide() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Style Guide — StudyHub</h1>

      <section className="mb-5">
        <h2 className="h5 mb-3">Brand colors & tokens</h2>
        <div className="d-flex gap-3 flex-wrap">
          <div style={{ width: 140 }} className="card p-3 text-center">
            <div style={{ height: 56, borderRadius: 10, background: 'var(--brand-1)' }}></div>
            <div className="mt-2 small">--brand-1</div>
          </div>
          <div style={{ width: 140 }} className="card p-3 text-center">
            <div style={{ height: 56, borderRadius: 10, background: 'var(--brand-2)' }}></div>
            <div className="mt-2 small">--brand-2</div>
          </div>
          <div style={{ width: 140 }} className="card p-3 text-center">
            <div style={{ height: 56, borderRadius: 10, background: '#F7F9FC' }}></div>
            <div className="mt-2 small">--bg-soft</div>
          </div>
        </div>
      </section>

      <section className="mb-5">
        <h2 className="h5 mb-3">Cards & controls</h2>
        <div className="row g-3">
          <div className="col-md-6">
            <AdminCard title="Card title" subtitle="Card subtitle" badge={<div className="badge bg-primary">New</div>}>
              <p className="mb-0">This is an example of an AdminCard using the theme styles. Use these for consistent panels across the app.</p>
            </AdminCard>
          </div>
          <div className="col-md-6 d-flex align-items-start gap-3">
            <div>
              <button className="btn btn-primary mb-2">Primary button</button>
              <div className="mt-2"><button className="btn btn-outline">Outline button</button></div>
            </div>
            <div style={{ minWidth: 220 }}>
              <label className="small text-muted">Form control</label>
              <input className="form-control" placeholder="Some input" />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-5">
        <h2 className="h5 mb-3">Tables</h2>
        <div className="card p-3 border-0 shadow-sm">
          <AdminTable>
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Demo Student</td>
                <td>demo@example.com</td>
                <td>Student</td>
                <td>2025-11-20</td>
              </tr>
              <tr>
                <td>Lecturer</td>
                <td>lecturer@example.com</td>
                <td>Lecturer</td>
                <td>2025-11-20</td>
              </tr>
            </tbody>
          </AdminTable>
        </div>
      </section>

      <section className="mb-5">
        <h2 className="h5 mb-3">Usage</h2>
        <p className="text-muted small">You can preview these components live in the app. Visit <Link href="/">home</Link> or the dashboard pages to see them in context.</p>
      </section>
    </div>
  )
}
