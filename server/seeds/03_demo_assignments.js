exports.seed = async function (knex) {
  // Deletes ALL existing entries and inserts demo assignments
  await knex('assignments').del()

  const now = new Date()
  function dt(days) { return new Date(now.getTime() + days * 24 * 60 * 60 * 1000) }

  // Resolve course ids by code to avoid relying on auto-increment values
  async function courseId(code) {
    const row = await knex('courses').where({ code }).first()
    return row ? row.id : null
  }

  const cs101 = await courseId('CS101')
  const cs102 = await courseId('CS102')
  const cs103 = await courseId('CS103')

  const assignments = []
  if (cs101) {
    assignments.push({ title: 'Python Basics: Variables and Functions', description: 'Intro to Python primitives and functions', type: 'individual', course_id: cs101, due_date: dt(7), submission_deadline: dt(8), total_marks: 20, instructions: 'Create functions and examples', created_by: 'lecturer-001' })
    assignments.push({ title: 'JavaScript DOM Manipulation', description: 'Build a small interactive page', type: 'individual', course_id: cs101, due_date: dt(14), submission_deadline: dt(15), total_marks: 25, instructions: 'Include validation and dynamic update', created_by: 'lecturer-001' })
  }
  if (cs102) {
    assignments.push({ title: 'Linked List Implementation', description: 'Implement a singly linked list', type: 'individual', course_id: cs102, due_date: dt(6), submission_deadline: dt(7), total_marks: 25, instructions: 'Insert/Delete/Search operations', created_by: 'lecturer-001' })
  }
  if (cs103) {
    assignments.push({ title: 'SQL Basics: Queries and Joins', description: 'SQL query practice', type: 'individual', course_id: cs103, due_date: dt(5), submission_deadline: dt(6), total_marks: 20, instructions: 'Write several SELECT/JOIN queries', created_by: 'lecturer-002' })
  }

  for (const a of assignments) await knex('assignments').insert({ ...a })
}
