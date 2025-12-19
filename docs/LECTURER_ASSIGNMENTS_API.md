# Lecturer Assignments & Submissions API Documentation

## Overview
This document describes the comprehensive API endpoints for managing lecturer assignments and student submissions in the KOMU SmartPortal system.

## Database Schema

### Assignments Table
```sql
CREATE TABLE assignments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  external_id VARCHAR(255) UNIQUE NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) DEFAULT 'individual',
  course_id INT UNSIGNED,
  due_date DATETIME,
  submission_deadline DATETIME,
  total_marks INT,
  instructions TEXT,
  attachments TEXT (JSON),
  question_set_id INT UNSIGNED NULL,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);
```

### Submissions Table (Enhanced)
```sql
CREATE TABLE submissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  assignment_id INT UNSIGNED NOT NULL,
  student_id INT UNSIGNED,
  submission_data TEXT,
  attachments TEXT (JSON),
  marks INT,
  feedback TEXT,
  graded BOOLEAN DEFAULT FALSE,
  graded_at DATETIME,
  graded_by VARCHAR(255),
  status ENUM('pending', 'submitted', 'graded', 'late') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL
);
```

---

## API Endpoints

### Assignment Management

#### Create Assignment (Lecturer)
**POST** `/assignments`

**Authentication:** Required (Lecturer role)

**Request Body:**
```json
{
  "title": "Database Design Project",
  "description": "Design a normalized database for a university system",
  "type": "individual",
  "course_id": 1,
  "due_date": "2024-12-20T23:59:59Z",
  "submission_deadline": "2024-12-21T23:59:59Z",
  "total_marks": 100,
  "instructions": "Submit a PDF with ER diagram and SQL schema",
  "attachments": [
    {
      "filename": "requirements.pdf",
      "path": "/uploads/requirements.pdf"
    }
  ]
}
```

**Response (201):**
```json
{
  "id": 1,
  "title": "Database Design Project",
  "description": "Design a normalized database for a university system",
  "type": "individual",
  "course_id": 1,
  "due_date": "2024-12-20T23:59:59Z",
  "submission_deadline": "2024-12-21T23:59:59Z",
  "total_marks": 100,
  "created_by": "lecturer@komu.edu",
  "created_at": "2024-12-01T10:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z"
}
```

---

#### Get All Assignments
**GET** `/assignments`

**Query Parameters:**
- `course_id` (optional): Filter by course
- `type` (optional): Filter by assignment type (individual, group, study)

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Database Design Project",
    "type": "individual",
    "course_id": 1,
    "due_date": "2024-12-20T23:59:59Z",
    "total_marks": 100,
    "created_by": "lecturer@komu.edu"
  }
]
```

---

#### Get Single Assignment
**GET** `/assignments/:id`

**Response (200):**
```json
{
  "id": 1,
  "title": "Database Design Project",
  "description": "Design a normalized database for a university system",
  "type": "individual",
  "course_id": 1,
  "due_date": "2024-12-20T23:59:59Z",
  "total_marks": 100,
  "instructions": "Submit a PDF with ER diagram and SQL schema",
  "created_by": "lecturer@komu.edu",
  "created_at": "2024-12-01T10:00:00Z"
}
```

---

#### Update Assignment (Lecturer)
**PUT** `/assignments/:id`

**Authentication:** Required (Lecturer role)

**Request Body:**
```json
{
  "title": "Database Design Project (Updated)",
  "due_date": "2024-12-25T23:59:59Z",
  "total_marks": 120
}
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Database Design Project (Updated)",
  "due_date": "2024-12-25T23:59:59Z",
  "total_marks": 120,
  "updated_at": "2024-12-02T15:30:00Z"
}
```

---

#### Delete Assignment (Lecturer)
**DELETE** `/assignments/:id`

**Authentication:** Required (Lecturer role)

**Response (204):** No content

---

### Submission Management

#### Get All Submissions for Assignment (Lecturer)
**GET** `/assignments/:id/submissions`

**Authentication:** Required

**Response (200):**
```json
[
  {
    "id": 101,
    "assignment_id": 1,
    "student_id": 5,
    "student_name": "John Doe",
    "student_email": "john.doe@university.edu",
    "marks": 85,
    "feedback": "Excellent work on normalization",
    "graded": true,
    "graded_at": "2024-12-21T14:30:00Z",
    "graded_by": "lecturer@komu.edu",
    "status": "graded",
    "created_at": "2024-12-20T10:00:00Z"
  }
]
```

---

#### Get Single Submission
**GET** `/submissions/:id`

**Authentication:** Required

**Response (200):**
```json
{
  "id": 101,
  "assignment_id": 1,
  "student_id": 5,
  "student_name": "John Doe",
  "student_email": "john.doe@university.edu",
  "submission_data": "{\"text\": \"Database schema...\"}",
  "attachments": [
    {
      "filename": "schema.pdf",
      "path": "/uploads/1702657200000-schema.pdf",
      "size": 245632
    }
  ],
  "marks": 85,
  "feedback": "Excellent work on normalization",
  "graded": true,
  "status": "graded",
  "created_at": "2024-12-20T10:00:00Z"
}
```

---

#### Submit Assignment (Student)
**POST** `/assignments/:id/submissions`

**Authentication:** Required

**Request:**
- Content-Type: multipart/form-data

**Form Fields:**
- `submission_data` (optional): JSON string or text submission
- `files` (optional): One or more files to upload

**Example with cURL:**
```bash
curl -X POST http://localhost:4000/assignments/1/submissions \
  -H "Authorization: Bearer <token>" \
  -F "submission_data={\"text\": \"Database schema...\"}" \
  -F "files=@schema.pdf"
```

**Response (201):**
```json
{
  "id": 101,
  "assignment_id": 1,
  "student_id": 5,
  "submission_data": "{\"text\": \"Database schema...\"}",
  "attachments": [
    {
      "filename": "1702657200000-schema.pdf",
      "path": "/uploads/1702657200000-schema.pdf",
      "size": 245632
    }
  ],
  "marks": null,
  "graded": false,
  "status": "submitted",
  "created_at": "2024-12-20T10:00:00Z"
}
```

---

#### Grade a Submission (Lecturer)
**PUT** `/submissions/:id/grade`

**Authentication:** Required (Lecturer role)

**Request Body:**
```json
{
  "marks": 85,
  "feedback": "Excellent work on normalization. Your ER diagram clearly shows the relationships. Consider adding indexes on foreign keys.",
  "status": "graded"
}
```

**Response (200):**
```json
{
  "id": 101,
  "assignment_id": 1,
  "student_id": 5,
  "marks": 85,
  "feedback": "Excellent work on normalization...",
  "graded": true,
  "graded_at": "2024-12-21T14:30:00Z",
  "graded_by": "lecturer@komu.edu",
  "status": "graded",
  "updated_at": "2024-12-21T14:30:00Z"
}
```

---

#### Bulk Grade Submissions (Lecturer)
**POST** `/assignments/:id/bulk-grade`

**Authentication:** Required (Lecturer role)

**Request Body:**
```json
{
  "submissions": [
    {
      "id": 101,
      "marks": 85,
      "feedback": "Great work on normalization",
      "status": "graded"
    },
    {
      "id": 102,
      "marks": 92,
      "feedback": "Excellent! Good use of constraints",
      "status": "graded"
    }
  ]
}
```

**Response (200):**
```json
[
  {
    "id": 101,
    "marks": 85,
    "feedback": "Great work on normalization",
    "graded": true,
    "graded_by": "lecturer@komu.edu"
  },
  {
    "id": 102,
    "marks": 92,
    "feedback": "Excellent! Good use of constraints",
    "graded": true,
    "graded_by": "lecturer@komu.edu"
  }
]
```

---

#### Revert Submission Grading (Lecturer)
**PUT** `/submissions/:id/revert`

**Authentication:** Required (Lecturer role)

**Response (200):**
```json
{
  "id": 101,
  "assignment_id": 1,
  "student_id": 5,
  "marks": null,
  "feedback": null,
  "graded": false,
  "graded_at": null,
  "status": "submitted"
}
```

---

### Submission Statistics

#### Get Submission Statistics for Assignment
**GET** `/assignments/:id/submission-stats`

**Authentication:** Required

**Response (200):**
```json
{
  "assignment_id": 1,
  "assignment_title": "Database Design Project",
  "total_marks": 100,
  "total_submissions": 45,
  "graded_submissions": 32,
  "pending_submissions": 13,
  "average_marks": "78.45"
}
```

---

#### Download Submission
**GET** `/submissions/:id/download`

**Authentication:** Required

**Response:** 
- Content-Type: application/json
- Content-Disposition: attachment; filename="submission_101.json"

**Body:**
```json
{
  "id": 101,
  "assignment_id": 1,
  "student_name": "John Doe",
  "submission_data": "...",
  "attachments": [...],
  "marks": 85,
  "feedback": "..."
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 403 | Forbidden (Role-based access) |
| 404 | Not Found |
| 409 | Conflict (Duplicate) |
| 500 | Internal Server Error |

---

## Authentication

All endpoints requiring authentication expect a JWT token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

Tokens are obtained via `/login` endpoint after successful authentication.

---

## Role-Based Access Control

| Endpoint | Student | Lecturer |
|----------|---------|----------|
| GET /assignments | ✓ | ✓ |
| POST /assignments | ✗ | ✓ |
| PUT /assignments/:id | ✗ | ✓ |
| DELETE /assignments/:id | ✗ | ✓ |
| GET /assignments/:id/submissions | ✓* | ✓ |
| POST /assignments/:id/submissions | ✓ | ✗ |
| PUT /submissions/:id/grade | ✗ | ✓ |
| PUT /submissions/:id/revert | ✗ | ✓ |

*Students can only view their own submissions

---

## Error Handling

All errors return JSON with an error message:

```json
{
  "error": "Only lecturers can create assignments"
}
```

---

## Example Workflow

### 1. Lecturer Creates Assignment
```bash
curl -X POST http://localhost:4000/assignments \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Database Design Project",
    "description": "Design a normalized database",
    "type": "individual",
    "course_id": 1,
    "due_date": "2024-12-20T23:59:59Z",
    "total_marks": 100
  }'
```

### 2. Student Submits Work
```bash
curl -X POST http://localhost:4000/assignments/1/submissions \
  -H "Authorization: Bearer <token>" \
  -F "submission_data={\"text\": \"My schema...\"}" \
  -F "files=@schema.pdf"
```

### 3. Lecturer Views Submissions
```bash
curl -X GET http://localhost:4000/assignments/1/submissions \
  -H "Authorization: Bearer <token>"
```

### 4. Lecturer Grades Submission
```bash
curl -X PUT http://localhost:4000/submissions/101/grade \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "marks": 85,
    "feedback": "Excellent work"
  }'
```

### 5. View Statistics
```bash
curl -X GET http://localhost:4000/assignments/1/submission-stats \
  -H "Authorization: Bearer <token>"
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- File uploads are limited to 250KB total payload (configurable)
- Uploaded files are stored in `server/uploads/` directory
- Auto-grading only works for question/answer format submissions
- Late submissions are marked with status 'late' if submitted after deadline
- Feedback can be plain text or HTML

---

## Testing

See `server/__tests__/` for comprehensive test examples.
