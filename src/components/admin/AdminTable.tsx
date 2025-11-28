'use client'

import React from 'react'

interface AdminTableProps {
  children?: React.ReactNode
  className?: string
}

export default function AdminTable({ children, className = '' }: AdminTableProps) {
  return (
    <div className={`table-responsive ${className}`}>
      <table className="table table-hover align-middle mb-0 table-theme">{children}</table>
    </div>
  )
}
