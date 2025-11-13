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
} from './types'

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
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Auth
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  // Assignments
  assignments: [],
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

  // Courses
  courses: [],
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

  // Materials
  materials: [],
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
}))
