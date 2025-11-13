'use client'

import React from 'react'
import { Calendar, Users, FileText } from 'lucide-react'
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
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {assignment.type === 'group' && <Users size={16} className="text-blue-600" />}
            {assignment.type === 'study' && <FileText size={16} className="text-green-600" />}
            <span className="text-xs font-semibold text-gray-600 capitalize">
              {assignment.type} Assignment
            </span>
          </div>
          <h3 className="text-lg font-semibold text-dark">{assignment.title}</h3>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-dark">{assignment.totalMarks} marks</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{assignment.description}</p>

      {showFooter && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-gray-600">
              <Calendar size={16} />
              <span>
                {isOverdue ? (
                  <span className="text-red-600 font-semibold">Overdue</span>
                ) : isDueSoon ? (
                  <span className="text-orange-600 font-semibold">Due in {daysLeft} days</span>
                ) : (
                  <span>Due in {daysLeft} days</span>
                )}
              </span>
            </div>
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
            View Details →
          </button>
        </div>
      )}
    </div>
  )
}

export default AssignmentCard
