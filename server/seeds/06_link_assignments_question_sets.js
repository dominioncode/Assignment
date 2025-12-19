exports.seed = async function (knex) {
  // For any assignments that do not have a question_set_id, create one from course questions
  const assignments = await knex('assignments').whereNull('question_set_id')

  for (const a of assignments) {
    if (!a.course_id) continue
    const qs = await knex('questions').where({ course_id: a.course_id })
    if (!qs || qs.length === 0) continue

    const qids = qs.map((q) => q.id)
    const total = qs.reduce((s, q) => s + (q.marks || 0), 0)
    const title = `Auto: Assignment ${a.id} Questions`

    const [id] = await knex('question_sets').insert({ title, description: 'Auto-generated question set for assignment', course_id: a.course_id, questions: JSON.stringify(qids), total_marks: total, created_by: a.created_by || 'seed' })

    // Link assignment to this new set
    await knex('assignments').where({ id: a.id }).update({ question_set_id: id })
  }
}
