import { format, formatDistanceToNow, differenceInDays } from 'date-fns'

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'MMM dd, yyyy')
}

export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'MMM dd, yyyy HH:mm')
}

export const formatTimeAgo = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

export const getDaysUntilDue = (dueDate: Date | string): number => {
  const d = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
  return differenceInDays(d, new Date())
}

export const getStatusBadgeColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    submitted: 'bg-green-100 text-green-800',
    graded: 'bg-purple-100 text-purple-800',
    'pending-review': 'bg-orange-100 text-orange-800',
    reviewed: 'bg-green-100 text-green-800',
    'resubmit-requested': 'bg-red-100 text-red-800',
  }
  return statusColors[status] || 'bg-gray-100 text-gray-800'
}

export const getGradeColor = (grade: string): string => {
  const gradeColors: Record<string, string> = {
    'A+': 'text-green-600',
    A: 'text-green-600',
    'B+': 'text-blue-600',
    B: 'text-blue-600',
    'C+': 'text-yellow-600',
    C: 'text-yellow-600',
    D: 'text-orange-600',
    F: 'text-red-600',
  }
  return gradeColors[grade] || 'text-gray-600'
}

export const calculateGrade = (marks: number, totalMarks: number): string => {
  const percentage = (marks / totalMarks) * 100
  if (percentage >= 90) return 'A+'
  if (percentage >= 85) return 'A'
  if (percentage >= 80) return 'B+'
  if (percentage >= 75) return 'B'
  if (percentage >= 70) return 'C+'
  if (percentage >= 65) return 'C'
  if (percentage >= 60) return 'D'
  return 'F'
}

export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
