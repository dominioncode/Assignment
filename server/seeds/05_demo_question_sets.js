exports.seed = async function (knex) {
  // Deletes ALL existing entries and inserts demo question sets
  await knex('question_sets').del()

  // helper to resolve course id by code
  async function courseId(code) {
    const row = await knex('courses').where({ code }).first()
    return row ? row.id : null
  }

  // helper to gather question ids by course code
  async function questionIdsForCourse(code) {
    const c = await courseId(code)
    if (!c) return []
    const rows = await knex('questions').where({ course_id: c })
    return rows.map((r) => r.id)
  }

  const cs101 = await courseId('CS101')
  const cs102 = await courseId('CS102')
  const cs103 = await courseId('CS103')
  const cs104 = await courseId('CS104')
  const cs105 = await courseId('CS105')
  const cs106 = await courseId('CS106')

  const sets = []

  // Create a short set for CS101
  const qcs101 = await questionIdsForCourse('CS101')
  if (cs101 && qcs101.length) {
    sets.push({ title: 'CS101 - Basic Quiz', description: 'Short quiz for CS101 topics', course_id: cs101, questions: JSON.stringify(qcs101.slice(0, 3)), total_marks: qcs101.reduce((s, q) => s + 2, 0), created_by: 'lecturer-001' })
  }

  // Create a set for CS102
  const qcs102 = await questionIdsForCourse('CS102')
  if (cs102 && qcs102.length) {
    sets.push({ title: 'CS102 - Data Structures Quiz', description: 'Linked-list and tree questions', course_id: cs102, questions: JSON.stringify(qcs102), total_marks: 10, created_by: 'lecturer-001' })
  }

  // Create a set for CS103
  const qcs103 = await questionIdsForCourse('CS103')
  if (cs103 && qcs103.length) {
    sets.push({ title: 'CS103 - SQL Quiz', description: 'Basic SQL questions', course_id: cs103, questions: JSON.stringify(qcs103), total_marks: 10, created_by: 'lecturer-002' })
  }

  // Create a set for CS104 if present
  const qcs104 = await questionIdsForCourse('CS104')
  if (cs104 && qcs104.length) {
    sets.push({ title: 'CS104 - Web Dev Quiz', description: 'HTML semantics and basics', course_id: cs104, questions: JSON.stringify(qcs104), total_marks: qcs104.length * 2, created_by: 'lecturer-002' })
  }

  // Insert sets
  for (const s of sets) {
    const [id] = await knex('question_sets').insert({ ...s })
    // optionally link to assignments for same course (first assignment for the course)
    if (s.course_id) {
      const assign = await knex('assignments').where({ course_id: s.course_id }).first()
      if (assign) {
        await knex('assignments').where({ id: assign.id }).update({ question_set_id: id })
      }
    }
  }

  // Create sets for CS105 and CS106 if they have questions
  const qcs105 = await questionIdsForCourse('CS105')
  if (cs105 && qcs105.length) {
    const [id] = await knex('question_sets').insert({ title: 'CS105 - Algorithms Quiz', description: 'Algorithms and complexity', course_id: cs105, questions: JSON.stringify(qcs105), total_marks: qcs105.length * 2, created_by: 'lecturer-003' })
    const assign = await knex('assignments').where({ course_id: cs105 }).first()
    if (assign) await knex('assignments').where({ id: assign.id }).update({ question_set_id: id })
  }

  const qcs106 = await questionIdsForCourse('CS106')
  if (cs106 && qcs106.length) {
    const [id] = await knex('question_sets').insert({ title: 'CS106 - OS Concepts Quiz', description: 'Processes, threads and concurrency', course_id: cs106, questions: JSON.stringify(qcs106), total_marks: qcs106.length * 2, created_by: 'lecturer-004' })
    const assign = await knex('assignments').where({ course_id: cs106 }).first()
    if (assign) await knex('assignments').where({ id: assign.id }).update({ question_set_id: id })
  }
}
