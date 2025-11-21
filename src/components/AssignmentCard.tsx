'use client'

import React from 'react'
import { Calendar, Users, FileText } from 'lucide-react'
import AdminCard from '@/components/admin/AdminCard'
import type { Assignment } from '@/lib/types'

interface AssignmentCardProps {
  assignment: Assignment
  onClick?: () => void
  showFooter?: boolean
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onClick,
  showFooter = true,
}) => {
  const daysLeft = Math.ceil(
    (new Date(assignment.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )
  const isOverdue = daysLeft < 0
  const isDueSoon = daysLeft >= 0 && daysLeft <= 3

  return (
    <AdminCard
      className="cursor-pointer"
      title={<>
        <div className="d-flex align-items-center gap-2">
          {assignment.type === 'group' && <Users size={16} className="text-primary" />}
          {assignment.type === 'study' && <FileText size={16} className="text-success" />}
          <span className="small text-muted text-capitalize">{assignment.type} Assignment</span>
        </div>
      </>}
      subtitle={<span className="fw-semibold">{assignment.title}</span>}
      badge={<div className="text-end"><span className="badge bg-secondary text-white">{assignment.totalMarks} marks</span></div>}
      footer={
        showFooter ? (
          <div className="d-flex justify-content-between align-items-center">
            <div className="small text-muted d-flex align-items-center gap-2">
              <Calendar size={14} />
              {isOverdue ? (
                <span className="text-danger fw-semibold">Overdue</span>
              ) : isDueSoon ? (
                <span className="text-warning fw-semibold">Due in {daysLeft} days</span>
              ) : (
                <span>Due in {daysLeft} days</span>
              )}
            </div>
            <button className="btn btn-link btn-sm">View Details →</button>
          </div>
        ) : null
      }
      onClick={onClick as any}
    >
      <p className="small text-muted mb-0">{assignment.description}</p>
    </AdminCard>
  )
}

export default AssignmentCard
