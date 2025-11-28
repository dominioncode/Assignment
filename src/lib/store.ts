import { create } from 'zustand'
import type {
  User,
  Assignment,
  Submission,
  Group,
  Course,
  SemesterResult,
  StudyMaterial,
  Notification,
  Question,
  QuestionSet,
  StudentAnswer,
  QuestionResponse,
} from './types'
import { seedCourses, seedAssignments, seedMaterials, seedQuestions, seedQuestionSets } from './seedData'

interface AppStore {
  // Auth state
  currentUser: User | null
  setCurrentUser: (user: User | null) => void

  // Assignments
  assignments: Assignment[]
  addAssignment: (assignment: Assignment) => void
  updateAssignment: (id: string, assignment: Partial<Assignment>) => void
  deleteAssignment: (id: string) => void

  // Submissions
  submissions: Submission[]
  addSubmission: (submission: Submission) => void
  updateSubmission: (id: string, submission: Partial<Submission>) => void
  getSubmissionsByAssignment: (assignmentId: string) => Submission[]

  // Groups
  groups: Group[]
  createGroup: (group: Group) => void
  addMemberToGroup: (groupId: string, memberId: string) => void
  removeGroupMember: (groupId: string, memberId: string) => void

  // Courses
  courses: Course[]
  addCourse: (course: Course) => void
  enrollStudent: (courseId: string, studentId: string) => void

  // Results
  results: SemesterResult[]
  addResult: (result: SemesterResult) => void
  getResultsBySemester: (semester: string, year: number) => SemesterResult[]

  // Study Materials
  materials: StudyMaterial[]
  addMaterial: (material: StudyMaterial) => void
  getMaterialsByCourse: (courseId: string) => StudyMaterial[]

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  markNotificationAsRead: (notificationId: string) => void

  // Questions
  questions: Question[]
  addQuestion: (question: Question) => void
  updateQuestion: (id: string, question: Partial<Question>) => void
  deleteQuestion: (id: string) => void
  getQuestionsByCourse: (courseId: string) => Question[]

  // Question Sets
  questionSets: QuestionSet[]
  addQuestionSet: (questionSet: QuestionSet) => void
  updateQuestionSet: (id: string, questionSet: Partial<QuestionSet>) => void
  deleteQuestionSet: (id: string) => void
  getQuestionSetsByCourse: (courseId: string) => QuestionSet[]

  // Student Answers
  studentAnswers: StudentAnswer[]
  submitAnswer: (answer: StudentAnswer) => void
  updateAnswer: (id: string, answer: Partial<StudentAnswer>) => void
  getAnswersByStudent: (studentId: string) => StudentAnswer[]
  getAnswersByQuestion: (questionId: string) => StudentAnswer[]

  // Question Responses
  questionResponses: QuestionResponse[]
  createResponse: (response: QuestionResponse) => void
  updateResponse: (id: string, response: Partial<QuestionResponse>) => void
  getResponsesByStudent: (studentId: string) => QuestionResponse[]
  getResponsesByQuestionSet: (questionSetId: string) => QuestionResponse[]
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Auth
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  // Assignments - initialized with seed data
  assignments: seedAssignments,
  addAssignment: (assignment) =>
    set((state) => ({
      assignments: [...state.assignments, assignment],
    })),
  updateAssignment: (id, updates) =>
    set((state) => ({
      assignments: state.assignments.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),
  deleteAssignment: (id) =>
    set((state) => ({
      assignments: state.assignments.filter((a) => a.id !== id),
    })),

  // Submissions
  submissions: [],
  addSubmission: (submission) =>
    set((state) => ({
      submissions: [...state.submissions, submission],
    })),
  updateSubmission: (id, updates) =>
    set((state) => ({
      submissions: state.submissions.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),
  getSubmissionsByAssignment: (assignmentId) => {
    const state = get()
    return state.submissions.filter((s) => s.assignmentId === assignmentId)
  },

  // Groups
  groups: [],
  createGroup: (group) =>
    set((state) => ({
      groups: [...state.groups, group],
    })),
  addMemberToGroup: (groupId, memberId) =>
    set((state) => ({
      groups: state.groups.map((g) =>
        g.id === groupId && !g.members.includes(memberId)
          ? { ...g, members: [...g.members, memberId] }
          : g
      ),
    })),
  removeGroupMember: (groupId, memberId) =>
    set((state) => ({
      groups: state.groups.map((g) =>
        g.id === groupId
          ? { ...g, members: g.members.filter((m) => m !== memberId) }
          : g
      ),
    })),

  // Courses - initialized with seed data
  courses: seedCourses,
  addCourse: (course) =>
    set((state) => ({
      courses: [...state.courses, course],
    })),
  enrollStudent: (courseId, studentId) =>
    set((state) => ({
      courses: state.courses.map((c) =>
        c.id === courseId && !c.students.includes(studentId)
          ? { ...c, students: [...c.students, studentId] }
          : c
      ),
    })),

  // Results
  results: [],
  addResult: (result) =>
    set((state) => ({
      results: [...state.results, result],
    })),
  getResultsBySemester: (semester, year) => {
    const state = get()
    return state.results.filter((r) => r.semester === semester && r.year === year)
  },

  // Materials - initialized with seed data
  materials: seedMaterials,
  addMaterial: (material) =>
    set((state) => ({
      materials: [...state.materials, material],
    })),
  getMaterialsByCourse: (courseId) => {
    const state = get()
    return state.materials.filter((m) => m.courseId === courseId)
  },

  // Notifications
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),
  markNotificationAsRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n
      ),
    })),

  // Questions
  questions: seedQuestions,
  addQuestion: (question) =>
    set((state) => ({
      questions: [...state.questions, question],
    })),
  updateQuestion: (id, updates) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === id ? { ...q, ...updates } : q
      ),
    })),
  deleteQuestion: (id) =>
    set((state) => ({
      questions: state.questions.filter((q) => q.id !== id),
    })),
  getQuestionsByCourse: (courseId) => {
    const state = get()
    return state.questions.filter((q) => q.courseId === courseId)
  },

  // Question Sets
  questionSets: seedQuestionSets,
  addQuestionSet: (questionSet) =>
    set((state) => ({
      questionSets: [...state.questionSets, questionSet],
    })),
  updateQuestionSet: (id, updates) =>
    set((state) => ({
      questionSets: state.questionSets.map((qs) =>
        qs.id === id ? { ...qs, ...updates } : qs
      ),
    })),
  deleteQuestionSet: (id) =>
    set((state) => ({
      questionSets: state.questionSets.filter((qs) => qs.id !== id),
    })),
  getQuestionSetsByCourse: (courseId) => {
    const state = get()
    return state.questionSets.filter((qs) => qs.courseId === courseId)
  },

  // Student Answers
  studentAnswers: [],
  submitAnswer: (answer) =>
    set((state) => ({
      studentAnswers: [...state.studentAnswers, answer],
    })),
  updateAnswer: (id, updates) =>
    set((state) => ({
      studentAnswers: state.studentAnswers.map((sa) =>
        sa.id === id ? { ...sa, ...updates } : sa
      ),
    })),
  getAnswersByStudent: (studentId) => {
    const state = get()
    return state.studentAnswers.filter((sa) => sa.studentId === studentId)
  },
  getAnswersByQuestion: (questionId) => {
    const state = get()
    return state.studentAnswers.filter((sa) => sa.questionId === questionId)
  },

  // Question Responses
  questionResponses: [],
  createResponse: (response) =>
    set((state) => ({
      questionResponses: [...state.questionResponses, response],
    })),
  updateResponse: (id, updates) =>
    set((state) => ({
      questionResponses: state.questionResponses.map((qr) =>
        qr.id === id ? { ...qr, ...updates } : qr
      ),
    })),
  getResponsesByStudent: (studentId) => {
    const state = get()
    return state.questionResponses.filter((qr) => qr.studentId === studentId)
  },
  getResponsesByQuestionSet: (questionSetId) => {
    const state = get()
    return state.questionResponses.filter((qr) => qr.questionSetId === questionSetId)
  },
}))
