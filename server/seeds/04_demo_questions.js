exports.seed = async function (knex) {
  // Deletes ALL existing entries and inserts demo questions for CS courses
  await knex('questions').del()

  // helper to resolve course id by code (safe even if ordering changes)
  async function courseId(code) {
    const row = await knex('courses').where({ code }).first()
    return row ? row.id : null
  }

  const cs101 = await courseId('CS101')
  const cs102 = await courseId('CS102')
  const cs103 = await courseId('CS103')
  const cs104 = await courseId('CS104')
  const cs105 = await courseId('CS105')
  const cs106 = await courseId('CS106')

  const questions = []

  if (cs101) {
    questions.push({ title: 'Python Variables', type: 'multiple-choice', course_id: cs101, text: 'What is the correct way to create a variable in Python?', options: JSON.stringify(['var x = 5','x = 5','x := 5','set x to 5']), correct_answer: 'x = 5', marks: 2, created_by: 'lecturer-001' })
    questions.push({ title: 'Function Definition (Python)', type: 'short-answer', course_id: cs101, text: 'Write a Python function that returns the sum of two numbers.', marks: 5, created_by: 'lecturer-001' })
    // additional CS101 questions
    questions.push({ title: 'List vs Tuple', type: 'multiple-choice', course_id: cs101, text: 'Which Python collection is immutable?', options: JSON.stringify(['list','tuple','dict','set']), correct_answer: 'tuple', marks: 2, created_by: 'lecturer-001' })
    questions.push({ title: 'Indentation Importance', type: 'true-false', course_id: cs101, text: 'Python uses indentation to define blocks of code.', options: JSON.stringify(['True','False']), correct_answer: 'True', marks: 1, created_by: 'lecturer-001' })
    // extra Python trivia and knowledge questions
    questions.push({ title: 'Python Creator', type: 'multiple-choice', course_id: cs101, text: 'Who is the creator of the Python programming language?', options: JSON.stringify(['Dennis Ritchie','Bjarne Stroustrup','Guido van Rossum','James Gosling']), correct_answer: 'Guido van Rossum', marks: 2, created_by: 'lecturer-001' })
    questions.push({ title: 'Python Release', type: 'multiple-choice', course_id: cs101, text: 'In which year was the first public release of Python?', options: JSON.stringify(['1989','1991','1995','2000']), correct_answer: '1991', marks: 2, created_by: 'lecturer-001' })
    questions.push({ title: 'PEP Meaning', type: 'short-answer', course_id: cs101, text: "What does the abbreviation 'PEP' stand for in Python's development process?", marks: 3, created_by: 'lecturer-001' })
  }

  if (cs102) {
    questions.push({ title: 'Linked List Basics', type: 'true-false', course_id: cs102, text: 'A linked list allows random access in O(1)', options: JSON.stringify(['True','False']), correct_answer: 'False', marks: 2, created_by: 'lecturer-001' })
    questions.push({ title: 'Tree Traversal', type: 'short-answer', course_id: cs102, text: 'Name three methods to traverse a binary tree.', marks: 4, created_by: 'lecturer-001' })
    // additional CS102 questions
    questions.push({ title: 'Big-O Order', type: 'multiple-choice', course_id: cs102, text: 'Which operation is O(log n)?', options: JSON.stringify(['Linear search','Binary search','Insertion sort','Bubble sort']), correct_answer: 'Binary search', marks: 3, created_by: 'lecturer-001' })
    questions.push({ title: 'Stack vs Queue', type: 'multiple-choice', course_id: cs102, text: 'Which data structure is LIFO?', options: JSON.stringify(['Queue','Stack','Deque','Priority Queue']), correct_answer: 'Stack', marks: 1, created_by: 'lecturer-001' })
  }

  if (cs103) {
    questions.push({ title: 'SQL Joins', type: 'multiple-choice', course_id: cs103, text: 'Which SQL join returns all rows from both tables?', options: JSON.stringify(['INNER JOIN','LEFT JOIN','FULL OUTER JOIN','CROSS JOIN']), correct_answer: 'FULL OUTER JOIN', marks: 3, created_by: 'lecturer-002' })
    questions.push({ title: 'Normalization', type: 'essay', course_id: cs103, text: 'Explain the three normal forms (1NF, 2NF, 3NF) in database design.', marks: 8, created_by: 'lecturer-002' })
    // additional CS103 questions
    questions.push({ title: 'Primary Key Uniqueness', type: 'true-false', course_id: cs103, text: 'A primary key can be NULL.', options: JSON.stringify(['True','False']), correct_answer: 'False', marks: 1, created_by: 'lecturer-002' })
    questions.push({ title: 'Index Benefits', type: 'multiple-choice', course_id: cs103, text: 'Why use an index?', options: JSON.stringify(['To speed up queries','To increase storage','To backup data','To encrypt data']), correct_answer: 'To speed up queries', marks: 2, created_by: 'lecturer-002' })
  }

  if (cs104) {
    questions.push({ title: 'HTML Semantics', type: 'multiple-choice', course_id: cs104, text: 'Which tag is semantic for navigation?', options: JSON.stringify(['<div>','<nav>','<section>','<span>']), correct_answer: '<nav>', marks: 2, created_by: 'lecturer-002' })
    questions.push({ title: 'CSS Box Model', type: 'short-answer', course_id: cs104, text: 'Explain the components of the CSS box model.', marks: 3, created_by: 'lecturer-002' })
    questions.push({ title: 'DOM Selection', type: 'multiple-choice', course_id: cs104, text: 'Which method returns the first element matching a selector?', options: JSON.stringify(['getElementById','getElementsByClassName','querySelector','querySelectorAll']), correct_answer: 'querySelector', marks: 2, created_by: 'lecturer-002' })
  }

  // CS105 / CS106 new questions
  if (cs105) {
    questions.push({ title: 'Algorithm Complexity', type: 'multiple-choice', course_id: cs105, text: 'Which sorting algorithm has average O(n log n) complexity?', options: JSON.stringify(['Bubble sort','Insertion sort','Merge sort','Selection sort']), correct_answer: 'Merge sort', marks: 3, created_by: 'lecturer-003' })
    questions.push({ title: 'Greedy Algorithms', type: 'short-answer', course_id: cs105, text: 'Give a brief example where greedy algorithm produces an optimal solution.', marks: 4, created_by: 'lecturer-003' })
  }

  if (cs106) {
    questions.push({ title: 'Context Switching', type: 'multiple-choice', course_id: cs106, text: 'Context switching involves saving which of these?', options: JSON.stringify(['Processor registers','Disk state','Network sockets','File handles']), correct_answer: 'Processor registers', marks: 2, created_by: 'lecturer-004' })
    questions.push({ title: 'Deadlock Conditions', type: 'multiple-choice', course_id: cs106, text: 'How many Coffman conditions are needed for deadlock?', options: JSON.stringify(['2','3','4','5']), correct_answer: '4', marks: 2, created_by: 'lecturer-004' })
  }

  for (const q of questions) {
    await knex('questions').insert({ ...q })
  }
}
