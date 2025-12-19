'use client'

import React from 'react'
import Link from 'next/link'
import KOMU_CONFIG from '@/config/komu.config'

export default function SupportPage() {
  return (
    <div className="container py-5">
      <div className="card p-4 shadow-sm border-0">
        <h1 className="h3 mb-3">KOMU Support</h1>
        <p className="text-muted">If you need help with assignments, project topics, or technical issues, contact our ICT support team.</p>

        <section className="mt-3">
          <h2 className="h5">Contact ICT</h2>
          <p className="text-muted">Email: <a href={`mailto:${KOMU_CONFIG.supportEmail}`}>{KOMU_CONFIG.supportEmail}</a></p>
          <p className="text-muted">Use the subject line "KOMU Support" and include your student ID, course code, and a clear description of your issue.</p>
        </section>

        <section className="mt-3">
          <h2 className="h5">Quick Help</h2>
          <ul className="text-muted">
            <li>For login issues — try resetting your password or contact ICT.</li>
            <li>For assignment submission problems — include screenshots and file names.</li>
            <li>For project topic approvals — include your proposed title, abstract and supervisor name.</li>
          </ul>
        </section>

        <div className="mt-3">
          <Link href={KOMU_CONFIG.authRoutes.login} className="btn btn-primary me-2">Sign in</Link>
          <Link href={KOMU_CONFIG.authRoutes.register} className="btn btn-outline">Create account</Link>
        </div>
      </div>
    </div>
  )
}
