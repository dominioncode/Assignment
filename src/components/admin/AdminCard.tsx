'use client'

import React from 'react'

interface AdminCardProps {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  badge?: React.ReactNode
  className?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  onClick?: () => void
}

export default function AdminCard({ title, subtitle, badge, className = '', children, footer, onClick }: AdminCardProps) {
  return (
    <div
      className={`card ${className} shadow-sm border-0`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      style={{ cursor: onClick ? 'pointer' : undefined }}
    >
      {(title || subtitle || badge) && (
        <div className="card-header d-flex justify-content-between align-items-start">
          <div>
            {title && <div className="card-title mb-0">{title}</div>}
            {subtitle && <small className="text-muted">{subtitle}</small>}
          </div>
          {badge && <div>{badge}</div>}
        </div>
      )}
      <div className="card-body py-3">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  )
}
