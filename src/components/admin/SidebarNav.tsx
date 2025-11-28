'use client'

import React from 'react'
import Link from 'next/link'

interface NavItem {
  href: string
  label: string
  icon?: React.ReactNode
}

interface SidebarNavProps {
  items: NavItem[]
  compact?: boolean
}

export default function SidebarNav({ items, compact = false }: SidebarNavProps) {
  return (
    <nav className="nav flex-column p-2">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className={`nav-link text-white py-2 px-3 ${compact ? 'small' : ''}`}>
          {item.icon && <span className="me-2">{item.icon}</span>}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}
