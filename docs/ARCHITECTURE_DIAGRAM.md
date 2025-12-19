# Lecturer Assignment System - Architecture & Data Flow

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    KOMU SmartPortal Architecture                     │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐          ┌──────────────────────────────┐
│   Frontend (Next.js)     │          │   Backend (Express.js)       │
├──────────────────────────┤          ├──────────────────────────────┤
│                          │          │                              │
│ ┌────────────────────┐  │          │ ┌──────────────────────────┐ │
│ │  Lecturer Pages    │  │          │ │  Authentication Layer    │ │
│ │ - Assignments      │  │          │ │ - JWT Validation        │ │
│ │ - Submissions      │  │          │ │ - Role Check (lecturer) │ │
│ │ - Grading UI       │  │          │ └──────────────────────────┘ │
│ │ - Statistics       │  │          │                              │
│ └────────────────────┘  │          │ ┌──────────────────────────┐ │
│          │              │          │ │  API Routes (8 endpoints)│ │
│          │ HTTP/JSON    │          │ │ - GET /assignments       │ │
│          │              │          │ │ - POST /assignments      │ │
│          │              │          │ │ - GET /submissions       │ │
│ ┌────────────────────┐  │          │ │ - POST /submissions      │ │
│ │  Student Pages     │  │          │ │ - PUT /submissions/grade │ │
│ │ - Assignment List  │  │          │ │ - POST /bulk-grade       │ │
│ │ - Submission Form  │  │          │ │ - PUT /revert            │ │
│ │ - View Grade       │  │          │ │ - GET /stats             │ │
│ └────────────────────┘  │          │ └──────────────────────────┘ │
│          │              │          │          │                   │
│          └──────────────┼──────────┼──────────┘                   │
│             Port 3000   │          │   Port 4000                  │
│                         │          │                              │
└─────────────────────────┴──────────┴──────────────────────────────┘
                           │
                ┌──────────┴─────────┐
                │                    │
        ┌───────────────────────────────────┐
        │     Database Layer (MySQL/SQLite) │
        ├───────────────────────────────────┤
        │                                   │
        │  ┌────────────┐ ┌──────────────┐ │
        │  │ Students   │ │ Assignments  │ │
        │  │ - id       │ │ - id         │ │
        │  │ - email    │ │ - title      │ │
        │  │ - name     │ │ - type       │ │
        │  │ - role     │ │ - due_date   │ │
        │  │ - password │ │ - total_marks│ │
        │  └────────────┘ └──────────────┘ │
        │        ▲                │        │
        │        │                ▼        │
        │        │         ┌──────────────┐│
        │        │         │ Submissions  ││
        │        └────────>│ (Enhanced)   ││
        │                  │ - id         ││
        │                  │ - marks      ││ ← NEW FIELDS
        │                  │ - feedback   ││
        │                  │ - graded_at  ││
        │                  │ - graded_by  ││
        │                  │ - status     ││
        │                  └──────────────┘│
        │                                   │
        │  ┌────────────────────────────┐  │
        │  │ File Storage (uploads/)    │  │
        │  │ - PDF files                │  │
        │  │ - Document files           │  │
        │  │ - Assignment materials     │  │
        │  └────────────────────────────┘  │
        │                                   │
        └───────────────────────────────────┘
```

---

## Data Flow Diagram

### Scenario 1: Lecturer Creates Assignment

```
Lecturer (Frontend)
    │
    ├─ Fill form (title, marks, due date)
    │
    ├─ POST /assignments
    │     └─ Payload: {title, type, course_id, total_marks, due_date}
    │
    ▼
Backend (Express.js)
    │
    ├─ Verify JWT token
    ├─ Check user.role === 'lecturer'
    ├─ Validate input
    │
    ▼
Database (MySQL/SQLite)
    │
    ├─ INSERT INTO assignments
    │     └─ (title, type, course_id, due_date, total_marks, created_by)
    │
    ▼
Return Response
    │
    ├─ 201 Created
    ├─ Return assignment object with new ID
    │
    ▼
Frontend Updates UI
    │
    └─ Show "Assignment created successfully"
```

---

### Scenario 2: Student Submits Work

```
Student (Frontend)
    │
    ├─ Select file (schema.pdf)
    ├─ Add optional text notes
    ├─ Click "Submit"
    │
    ├─ POST /assignments/{id}/submissions
    │     └─ Payload: multipart/form-data
    │         ├─ submission_data: "My notes..."
    │         └─ files: [schema.pdf]
    │
    ▼
Backend (Express.js)
    │
    ├─ Verify JWT token
    ├─ Validate student authenticated
    ├─ Multer: Save file to uploads/
    │
    ▼
Database (MySQL/SQLite)
    │
    ├─ INSERT INTO submissions
    │     ├─ assignment_id
    │     ├─ student_id
    │     ├─ submission_data: "My notes..."
    │     ├─ attachments: [{filename, path, size}]
    │     ├─ status: 'submitted'
    │     └─ created_at: NOW()
    │
    ▼
Return Response
    │
    ├─ 201 Created
    ├─ submission_id: 1
    │
    ▼
Frontend
    │
    └─ Show "Submission successful!"
       File saved in server/uploads/
```

---

### Scenario 3: Lecturer Grades Submission

```
Lecturer Views Submissions
    │
    ├─ GET /assignments/{id}/submissions
    │     └─ Returns list of all submissions with student info
    │
    ▼
Database Query
    │
    ├─ SELECT submissions.*, students.name, students.email
    │     FROM submissions
    │     JOIN students ON submissions.student_id = students.id
    │     WHERE assignment_id = 1
    │
    ▼
Frontend Shows Table
    │
    ├─ Student Name | Status | Marks | Feedback | Actions
    ├─ John Doe    | Pending| —    | —        | [Grade]
    ├─ Jane Smith  | Graded | 85   | Great!   | [Revert]
    │
    ▼
Lecturer Clicks "Grade" → Grading Panel Opens
    │
    ├─ Input marks: 85
    ├─ Input feedback: "Excellent work"
    ├─ Click "Save Grade"
    │
    ├─ PUT /submissions/{id}/grade
    │     └─ Payload:
    │         ├─ marks: 85
    │         ├─ feedback: "Excellent work"
    │         └─ status: 'graded'
    │
    ▼
Backend (Express.js)
    │
    ├─ Verify JWT token
    ├─ Check user.role === 'lecturer'
    ├─ Validate marks (0-100)
    │
    ▼
Database (MySQL/SQLite)
    │
    ├─ UPDATE submissions SET
    │     ├─ marks = 85
    │     ├─ feedback = "Excellent work"
    │     ├─ graded = TRUE
    │     ├─ graded_at = NOW()
    │     ├─ graded_by = 'lecturer@email'
    │     ├─ status = 'graded'
    │     └─ WHERE id = 1
    │
    ▼
Return Updated Submission
    │
    ├─ 200 OK
    ├─ graded: true
    ├─ graded_at: "2024-12-21T14:30:00Z"
    │
    ▼
Frontend Updates UI
    │
    └─ Row status changes from "Pending" to "Graded" ✓
```

---

### Scenario 4: Get Submission Statistics

```
Lecturer Dashboard
    │
    ├─ GET /assignments/{id}/submission-stats
    │
    ▼
Backend Aggregation Query
    │
    ├─ SELECT
    │     COUNT(*) as total_submissions,
    │     SUM(CASE WHEN graded = TRUE THEN 1 ELSE 0 END) as graded_submissions,
    │     COUNT(*) - SUM(...) as pending_submissions,
    │     AVG(marks) as average_marks
    │     FROM submissions
    │     WHERE assignment_id = 1
    │
    ▼
Database Calculation
    │
    ├─ Total: 45 submissions
    ├─ Graded: 32 submissions
    ├─ Pending: 13 submissions
    ├─ Average: 78.45 marks
    │
    ▼
Return Stats
    │
    ├─ 200 OK
    ├─ {total_submissions: 45, graded_submissions: 32, average_marks: "78.45"}
    │
    ▼
Frontend Displays Cards
    │
    ├─ Card 1: Total Submissions | 45
    ├─ Card 2: Graded           | 32
    ├─ Card 3: Pending          | 13
    └─ Card 4: Average Marks    | 78.45/100
```

---

## API Request-Response Flow

### Complete Request Cycle

```
Client Request
┌────────────────────────────────────────────────┐
│ PUT /submissions/1/grade                       │
│ Authorization: Bearer eyJhbGciOi...           │
│ Content-Type: application/json                │
│                                               │
│ {                                             │
│   "marks": 85,                                │
│   "feedback": "Excellent work",               │
│   "status": "graded"                          │
│ }                                             │
└────────────────────────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────────────┐
│ Server Processing                              │
├────────────────────────────────────────────────┤
│ 1. Extract JWT token                          │
│ 2. Verify signature & expiration               │
│ 3. Extract user info (email, role)            │
│ 4. Check role === 'lecturer'                  │
│ 5. Validate input (marks: 0-100)              │
│ 6. Check submission exists                    │
│ 7. Prepare SQL UPDATE statement               │
│ 8. Execute update with timestamp              │
│ 9. Fetch updated record                       │
│ 10. Return JSON response                      │
└────────────────────────────────────────────────┘
              │
              ▼
Client Response
┌────────────────────────────────────────────────┐
│ HTTP 200 OK                                   │
│ Content-Type: application/json                │
│                                               │
│ {                                             │
│   "id": 1,                                    │
│   "assignment_id": 1,                         │
│   "student_id": 5,                            │
│   "marks": 85,                                │
│   "feedback": "Excellent work",               │
│   "graded": true,                             │
│   "graded_at": "2024-12-21T14:30:00Z",       │
│   "graded_by": "lecturer@komu.edu",           │
│   "status": "graded",                         │
│   "updated_at": "2024-12-21T14:30:00Z"       │
│ }                                             │
└────────────────────────────────────────────────┘
```

---

## Database State Changes

### Before Submission

```
submissions TABLE (empty or no pending submissions)
┌────┬──────────────┬────────────┬────┬──────────┬─────────┬────────┐
│ id │ assignment_id│ student_id │mark│ feedback │ graded  │ status │
├────┼──────────────┼────────────┼────┼──────────┼─────────┼────────┤
│    │              │            │    │          │ FALSE   │pending │
└────┴──────────────┴────────────┴────┴──────────┴─────────┴────────┘
```

### After Student Submits

```
submissions TABLE (new record)
┌────┬──────────────┬────────────┬────┬──────────┬─────────┬──────────┐
│ id │ assignment_id│ student_id │mark│ feedback │ graded  │ status   │
├────┼──────────────┼────────────┼────┼──────────┼─────────┼──────────┤
│ 1  │ 1            │ 5          │NULL│ NULL     │ FALSE   │submitted │
└────┴──────────────┴────────────┴────┴──────────┴─────────┴──────────┘
```

### After Lecturer Grades

```
submissions TABLE (updated record)
┌────┬──────────────┬────────────┬────┬──────────────────┬─────────┬────────┐
│ id │ assignment_id│ student_id │mark│ feedback         │ graded  │ status │
├────┼──────────────┼────────────┼────┼──────────────────┼─────────┼────────┤
│ 1  │ 1            │ 5          │ 85 │ Excellent work...│ TRUE    │ graded │
└────┴──────────────┴────────────┴────┴──────────────────┴─────────┴────────┘

Additional fields updated:
- graded_at: 2024-12-21 14:30:00
- graded_by: lecturer@komu.edu
- marks: 85
- feedback: "Excellent work..."
```

---

## File Upload Flow

```
Student Browser
    │
    ├─ Select file: schema.pdf (245KB)
    │
    ▼
FormData Object
    │
    ├─ submission_data: "My notes..."
    ├─ files: [schema.pdf]
    │
    ├─ POST /assignments/1/submissions
    │     └─ Content-Type: multipart/form-data
    │
    ▼
Express.js + Multer
    │
    ├─ Parse multipart data
    ├─ Validate file size
    ├─ Move file to server/uploads/
    ├─ Generate filename: 1702657200000-schema.pdf
    │
    ▼
Database Storage
    │
    ├─ INSERT INTO submissions
    │     attachments: JSON.stringify([{
    │       filename: "1702657200000-schema.pdf",
    │       path: "/uploads/1702657200000-schema.pdf",
    │       size: 245632
    │     }])
    │
    ▼
File System
    │
    └─ server/uploads/1702657200000-schema.pdf
       (Physical file stored on disk)
```

---

## Status Lifecycle

```
State Machine: Submission Status

┌───────────┐
│  pending  │ ← Initial state (created but not submitted)
└─────┬─────┘
      │ Student clicks Submit
      ▼
┌───────────┐
│submitted  │ ← File/text uploaded
└─────┬─────┘
      │ Lecturer grades
      ├─ If marks + feedback added
      │  └─→ ┌───────────┐
      │      │  graded   │ ← Final state
      │      └───────────┘
      │         ▲
      └─────────┘
            (Lecturer can revert back to submitted)

Special Case: Late Submissions
      │ Submitted after deadline
      └─→ ┌───────┐
          │ late  │ ← Still can be graded
          └───────┘
```

---

## Performance Optimization

### Indexes Created

```sql
-- Recommended indexes for query performance
CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);
  → Speeds up: GET /assignments/:id/submissions

CREATE INDEX idx_submissions_student ON submissions(student_id);
  → Speeds up: Student viewing own submissions

CREATE INDEX idx_submissions_graded ON submissions(graded);
  → Speeds up: Filter graded/pending

CREATE INDEX idx_submissions_status ON submissions(status);
  → Speeds up: Status-based filtering
```

### Query Optimization

```sql
-- Optimized query for submissions list
SELECT 
  s.id, s.assignment_id, s.student_id,
  s.marks, s.feedback, s.graded, s.status,
  s.created_at, s.graded_at,
  st.name as student_name, st.email as student_email
FROM submissions s
LEFT JOIN students st ON s.student_id = st.id
WHERE s.assignment_id = 1
ORDER BY s.created_at DESC
LIMIT 50;
```

---

## Error Handling Flow

```
Client Request
    │
    ▼
Backend Validation
    │
    ├─ JWT expired?
    │   └─ 401 Unauthorized {"error": "Token expired"}
    │
    ├─ Invalid role?
    │   └─ 403 Forbidden {"error": "Only lecturers can grade"}
    │
    ├─ Invalid input?
    │   └─ 400 Bad Request {"error": "marks required"}
    │
    ├─ Submission not found?
    │   └─ 404 Not Found {"error": "Submission not found"}
    │
    ├─ Database error?
    │   └─ 500 Internal Server Error {"error": "Failed to grade"}
    │
    └─ All valid
        └─ 200 OK {submission object}
```

---

## Complete Component Interaction

```
┌─────────────────────────────────────────────────────────────────┐
│                   KOMU SmartPortal System                        │
└─────────────────────────────────────────────────────────────────┘

Frontend Components (Next.js)
├─ LecturerAssignmentsPage
│  └─ Creates, views, edits assignments
│     └─ Calls POST/PUT/GET /assignments
│
├─ SubmissionsManagementPage ← NEW
│  └─ Views student submissions
│  └─ Inline grading interface
│  └─ Statistics cards
│  └─ Calls GET /assignments/:id/submissions
│       GET /assignments/:id/submission-stats
│       PUT /submissions/:id/grade
│
└─ StudentSubmissionPage
   └─ File upload interface
   └─ Calls POST /assignments/:id/submissions

Backend Routes (Express.js)
├─ Assignment Routes
│  ├─ GET /assignments → List all
│  ├─ POST /assignments → Create (lecturer)
│  ├─ PUT /assignments/:id → Update (lecturer)
│  └─ DELETE /assignments/:id → Delete (lecturer)
│
└─ Submission Routes ← ENHANCED
   ├─ GET /assignments/:id/submissions → List for assignment
   ├─ GET /submissions/:id → Single submission
   ├─ POST /assignments/:id/submissions → Create (student)
   ├─ PUT /submissions/:id/grade → Grade (lecturer)
   ├─ POST /assignments/:id/bulk-grade → Bulk grade (lecturer)
   ├─ PUT /submissions/:id/revert → Ungrade (lecturer)
   ├─ GET /assignments/:id/submission-stats → Stats (lecturer)
   └─ GET /submissions/:id/download → Export (lecturer)

Database Schema
├─ assignments (title, type, due_date, total_marks, created_by)
│
└─ submissions (assignment_id, student_id, marks, feedback,
               graded, graded_at, graded_by, status)
               ↑ NEW ENHANCED FIELDS
               
File Storage
└─ server/uploads/ → Uploaded files (PDFs, documents, etc.)
```

---

## Summary

This architecture provides:
- ✅ Clean separation of concerns (Frontend/Backend/Database)
- ✅ RESTful API with proper status codes
- ✅ Role-based access control
- ✅ Transaction support for atomic operations
- ✅ Audit trail (graded_by, graded_at timestamps)
- ✅ Performance optimized with indexes
- ✅ File upload handling
- ✅ Error handling and validation

**The system is production-ready!** 🚀
