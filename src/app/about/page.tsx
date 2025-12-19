'use client'

import React from 'react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="container py-5">
      <div className="card p-4 shadow-sm border-0">
        <h1 className="h3 mb-3">About KOMU SmartPortal</h1>
        <p className="lead text-muted">KOMU SmartPortal is a smart academic organizer that connects students, lecturers, and ICT to make coursework management transparent, efficient, and stress-free.</p>

        <section className="mt-4">
          <h2 className="h5">Problem We Solve</h2>
          <p className="text-muted">Students struggle with managing multiple assignments, group work, and study materials — especially across different lecturers and departments. Recurring challenges such as delayed results, project topic confusion, and chaotic supervision tracking create frustration for students, overwhelm lecturers, and add workload for ICT.</p>
        </section>

        <section className="mt-3">
          <h2 className="h5">Our Vision</h2>
          <p className="text-muted">KOMU SmartPortal is more than just an app — its a digital bridge connecting students, lecturers, and ICT. It brings transparency, efficiency, and automation into one space so students can check results instantly, submit project topics for approval, upload assignments easily, and communicate directly with ICT without queues or confusion.</p>
        </section>

        <section className="mt-3">
          <h2 className="h5">Key Benefits</h2>
          <ul className="text-muted">
            <li>Instant access to results and grade breakdowns</li>
            <li>Structured project topic submission and approval flow</li>
            <li>Streamlined assignment submission and tracking</li>
            <li>Direct ICT communication for support and reduced queues</li>
            <li>Transparent supervision and progress tracking for projects</li>
          </ul>
        </section>

        <section className="mt-3">
          <h2 className="h5">Get Started</h2>
          <p className="text-muted">KOMU reduces administrative friction and helps everyone focus on teaching and learning. To get started, create an account or sign in.</p>
          <div className="mt-2">
            <Link href="/auth/register" className="btn btn-primary me-2">Create account</Link>
            <Link href="/auth/login" className="btn btn-outline">Sign in</Link>
          </div>
        </section>

      </div>
    </div>
  )
}
