exports.seed = async function (knex) {
  // Inserts seed entries for courses
  await knex('courses').del()

  const courses = [
    { code: 'CS101', name: 'Introduction to Programming', description: 'Fundamentals of programming using Python and JavaScript', lecturer: 'lecturer-001', semester: 'first', year: 2024, credits: 3, max_students: 50, department: 'Computer Science' },
    { code: 'CS102', name: 'Data Structures', description: 'Arrays, linked lists, trees', lecturer: 'lecturer-001', semester: 'first', year: 2024, credits: 3, max_students: 50, department: 'Computer Science' },
    { code: 'CS103', name: 'Database Systems', description: 'SQL and relational design', lecturer: 'lecturer-002', semester: 'first', year: 2024, credits: 3, max_students: 50, department: 'Computer Science' },
    { code: 'CS104', name: 'Web Development Fundamentals', description: 'HTML, CSS and JavaScript', lecturer: 'lecturer-002', semester: 'first', year: 2024, credits: 3, max_students: 50, department: 'Computer Science' },
    { code: 'CS105', name: 'Introduction to Algorithms', description: 'Algorithmic thinking and complexity', lecturer: 'lecturer-003', semester: 'first', year: 2024, credits: 3, max_students: 50, department: 'Computer Science' },
    { code: 'CS106', name: 'Operating Systems', description: 'Processes, threads, and concurrency', lecturer: 'lecturer-004', semester: 'first', year: 2024, credits: 3, max_students: 50, department: 'Computer Science' }
  ]

  for (const c of courses) {
    await knex('courses').insert({ ...c })
  }
}
