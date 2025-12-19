const KOMU_CONFIG = {
  appName: 'KOMU SmartPortal',
  shortName: 'KOMU',
  description:
    'KOMU SmartPortal connects students, lecturers, and ICT — manage assignments, submit project topics, view results, and share materials in one place',
  supportEmail: 'support@komu.edu',
  supportRoute: '/support',
  aboutRoute: '/about',
  authRoutes: {
    login: '/auth/login',
    register: '/auth/register',
  },
  features: {
    realtimeNotifications: true,
    projectTopicSubmission: true,
    ictContactChannel: true,
  },
}

export default KOMU_CONFIG
