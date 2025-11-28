// User Types
export type UserRole = 'student' | 'lecturer' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department: string
  studentId?: string
  employeeId?: string
  profilePicture?: string
}

// Assignment Types
export type AssignmentType = 'individual' | 'group' | 'study'
export type AssignmentStatus = 'pending' | 'in-progress' | 'submitted' | 'graded'

export interface Assignment {
  id: string
  title: string
  description: string
  type: AssignmentType
  courseId: string
  dueDate: Date
  submissionDeadline: Date
  totalMarks: number
  instructions: string
  attachments: string[]
  createdBy: string // Lecturer ID
  createdAt: Date
  updatedAt: Date
}

// Group Types
export interface Group {
  id: string
  name: string
  assignmentId: string
  members: string[] // User IDs
  createdAt: Date
}

// Submission Types
export type SubmissionStatus = 'submitted' | 'pending-review' | 'reviewed' | 'resubmit-requested'

export interface Submission {
  id: string
  assignmentId: string
  submittedBy: string // User ID
  groupId?: string
  submissionDate: Date
  files: string[]
  status: SubmissionStatus
  marks?: number
  feedback?: string
  reviewedBy?: string // Lecturer ID
  reviewedAt?: Date
}

// Result Types
export type Semester = 'first' | 'second'

export interface SemesterResult {
  id: string
  studentId: string
  semester: Semester
  year: number
  courseId: string
  courseName: string
  totalMarks: number
  obtainedMarks: number
  grade: string
  isReady: boolean
}

export interface CourseResult {
  id: string
  studentId: string
  courseId: string
  courseName: string
  assignments: {
    id: string
    title: string
    marks: number
  }[]
  totalMarks: number
}

// Course Types
export interface Course {
  id: string
  code: string
  name: string
  description: string
  lecturer: string // User ID
  semester: Semester
  year: number
  credits: number
  maxStudents: number
  students: string[] // User IDs
  department: string
  createdAt: Date
}

// Study Material Types
export interface StudyMaterial {
  id: string
  title: string
  description: string
  courseId: string
  fileUrl: string
  fileType: 'pdf' | 'document' | 'video' | 'link' | 'image'
  uploadedBy: string // Lecturer ID
  uploadedAt: Date
  tags: string[]
}

// Notification Types
export type NotificationType =
  | 'assignment_created'
  | 'assignment_due_soon'
  | 'submission_received'
  | 'grade_available'
  | 'group_invitation'
  | 'group_invitation_accepted'
  | 'group_invitation_rejected'
  | 'material_uploaded'

export interface Notification {
  id: string
  recipientId: string
  type: NotificationType
  title: string
  message: string
  relatedId?: string // ID of related resource (assignment, submission, etc)
  isRead: boolean
  createdAt: Date
}

// Question Types
export type QuestionType = 'multiple-choice' | 'short-answer' | 'essay' | 'true-false' | 'fill-blank'

export interface Question {
  id: string
  title: string
  description: string
  type: QuestionType
  courseId: string
  assignmentId?: string
  text: string
  options?: string[] // For multiple choice or true/false
  correctAnswer?: string // For MCQ/true-false/fill-blank
  marks: number
  createdBy: string // Lecturer ID
  createdAt: Date
  updatedAt: Date
}

export interface QuestionSet {
  id: string
  title: string
  description: string
  courseId: string
  questions: string[] // Question IDs
  totalMarks: number
  dueDate: Date
  createdBy: string // Lecturer ID
  createdAt: Date
  updatedAt: Date
}

export type AnswerStatus = 'not-started' | 'in-progress' | 'submitted' | 'marked'

export interface StudentAnswer {
  id: string
  questionId: string
  questionSetId: string
  studentId: string
  answer: string
  status: AnswerStatus
  marksObtained?: number
  feedback?: string
  submittedAt?: Date
  markedAt?: Date
  markedBy?: string // Lecturer ID
}

export interface QuestionResponse {
  id: string
  questionSetId: string
  studentId: string
  answers: StudentAnswer[]
  totalMarks: number
  obtainedMarks?: number
  status: 'in-progress' | 'submitted' | 'marked'
  submittedAt?: Date
  markedAt?: Date
}
