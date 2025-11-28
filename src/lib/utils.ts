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
    pending: 'bg-warning text-dark',
    'in-progress': 'bg-primary text-white',
    submitted: 'bg-success text-white',
    graded: 'bg-success text-white',
    'pending-review': 'bg-info text-dark',
    reviewed: 'bg-success text-white',
    'resubmit-requested': 'bg-danger text-white',
  }
  return statusColors[status] || 'bg-light text-dark'
}

export const getGradeColor = (grade: string): string => {
  const gradeColors: Record<string, string> = {
    'A+': 'bg-success text-white',
    A: 'bg-success text-white',
    'B+': 'bg-primary text-white',
    B: 'bg-primary text-white',
    'C+': 'bg-warning text-dark',
    C: 'bg-warning text-dark',
    D: 'bg-warning text-dark',
    F: 'bg-danger text-white',
  }
  return gradeColors[grade] || 'bg-light text-dark'
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
