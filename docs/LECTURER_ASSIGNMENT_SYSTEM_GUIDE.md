# Lecturer Assignment Management System - Complete Guide

## Overview

The KOMU SmartPortal Lecturer Assignment Management System enables lecturers to:
- ✅ Create and manage course assignments
- ✅ Upload assignment materials and instructions
- ✅ Accept student submissions (file uploads and text)
- ✅ Grade submissions with marks and feedback
- ✅ Track submission statistics and progress
- ✅ Auto-grade multiple-choice submissions
- ✅ Export submission data

---

## Database Architecture

### Core Tables

#### 1. **Assignments Table**
Stores assignment metadata created by lecturers.

```sql
CREATE TABLE assignments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('individual', 'group', 'study') DEFAULT 'individual',
  course_id INT UNSIGNED,
  due_date DATETIME,
  submission_deadline DATETIME,
  total_marks INT,
  instructions TEXT,
  attachments JSON,
  question_set_id INT UNSIGNED NULL,
  created_by VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Key Fields:**
- `type`: Individual, Group, or Study assignment
- `due_date`: When assignment is due for student viewing
- `submission_deadline`: Hard deadline for submissions (used for late flags)
- `total_marks`: Maximum marks for grading
- `attachments`: JSON array of assignment materials

---

#### 2. **Submissions Table (Enhanced)**
Stores student submissions with grading metadata.

```sql
CREATE TABLE submissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  assignment_id INT UNSIGNED NOT NULL,
  student_id INT UNSIGNED,
  submission_data TEXT,
  attachments JSON,
  marks INT,
  feedback TEXT,
  graded BOOLEAN DEFAULT FALSE,
  graded_at DATETIME,
  graded_by VARCHAR(255),
  status ENUM('pending', 'submitted', 'graded', 'late'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id),
  FOREIGN KEY (student_id) REFERENCES students(id)
);
```

**Key Fields:**
- `status`: Tracks submission state (pending → submitted → graded, or late)
- `marks`: Numeric grade given by lecturer
- `feedback`: Detailed feedback for student
- `graded_at`: Timestamp of when submission was graded
- `graded_by`: Email of lecturer who graded

---

### Relationships

```
Assignments (1) ──→ (Many) Submissions
                    │
                    ├→ Student (who submitted)
                    └→ Grading Info (marks, feedback, graded_by)

Courses (1) ──→ (Many) Assignments
```

---

## API Endpoints

### For Lecturers

#### Create Assignment
```
POST /assignments
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Database Design Project",
  "description": "Design a normalized database",
  "type": "individual",
  "course_id": 1,
  "due_date": "2024-12-20T23:59:59Z",
  "submission_deadline": "2024-12-21T23:59:59Z",
  "total_marks": 100,
  "instructions": "Submit PDF with ER diagram",
  "attachments": [...]
}
```

**Response:** Assignment object with ID

---

#### View All Submissions for Assignment
```
GET /assignments/:assignmentId/submissions
Authorization: Bearer <token>

Response: Array of submissions with student details
```

---

#### Grade a Submission
```
PUT /submissions/:submissionId/grade
Content-Type: application/json
Authorization: Bearer <token>

{
  "marks": 85,
  "feedback": "Excellent normalization. Good constraints.",
  "status": "graded"
}
```

---

#### Bulk Grade Multiple Submissions
```
POST /assignments/:assignmentId/bulk-grade
Content-Type: application/json
Authorization: Bearer <token>

{
  "submissions": [
    { "id": 101, "marks": 85, "feedback": "..." },
    { "id": 102, "marks": 92, "feedback": "..." }
  ]
}
```

---

#### Get Submission Statistics
```
GET /assignments/:assignmentId/submission-stats
Authorization: Bearer <token>

Response: {
  "total_submissions": 45,
  "graded_submissions": 32,
  "pending_submissions": 13,
  "average_marks": "78.45"
}
```

---

#### Revert Grading (Ungrade)
```
PUT /submissions/:submissionId/revert
Authorization: Bearer <token>

Response: Submission with grading fields cleared
```

---

### For Students

#### Submit Assignment
```
POST /assignments/:assignmentId/submissions
Content-Type: multipart/form-data
Authorization: Bearer <token>

Form Fields:
- submission_data (optional): JSON or text
- files (optional): One or more files

Example cURL:
curl -X POST http://localhost:4000/assignments/1/submissions \
  -H "Authorization: Bearer <token>" \
  -F "submission_data={\"text\": \"My solution...\"}" \
  -F "files=@solution.pdf"
```

**Response:** Submission object with ID

---

#### View Own Submissions
```
GET /assignments/:assignmentId/submissions
Authorization: Bearer <token>

Response: Only student's own submissions (filtered server-side)
```

---

## Frontend Components

### 1. Assignments Page
**Location:** `src/app/lecturer/assignments/page.tsx`

**Features:**
- List all assignments for the lecturer's courses
- Create new assignments (modal form)
- Edit/delete assignments
- Filter by assignment type
- Search by title or course

**Key Actions:**
```tsx
- Create Assignment → Opens modal with form
- View Assignment Details
- Edit Assignment
- Delete Assignment
- View Submissions → Navigate to submissions page
```

---

### 2. Submissions Management Page
**Location:** `src/app/lecturer/assignments/submissions/page.tsx`

**Features:**
- View all submissions for an assignment
- Filter by status (all, pending, graded)
- Inline grading interface
- Quick stats cards

**Key UI Elements:**

```tsx
// Stats Cards
- Total Submissions
- Graded Submissions  
- Pending Submissions
- Average Marks

// Submissions Table
- Student Name & Email
- Submission Date/Time
- Status Badge (Pending/Graded/Late)
- Current Marks
- Feedback Preview
- Action Buttons

// Grading Panel (Inline)
- Marks Input (with max constraint)
- Feedback Textarea
- Save Grade Button
```

---

## Usage Workflow

### Step 1: Lecturer Creates Assignment

```tsx
1. Navigate to /lecturer/assignments
2. Click "Create Assignment" button
3. Fill in form:
   - Title: "Database Design Project"
   - Description: "Design normalized database"
   - Type: "Individual"
   - Course: Select from dropdown
   - Due Date: Pick date
   - Total Marks: 100
   - Instructions: "Submit PDF with ER diagram"
4. Click "Create"
```

---

### Step 2: Upload Assignment Materials

```tsx
1. In the Create modal, can add attachments:
   - Assignment requirements PDF
   - Template file
   - Example solution (for reference)
2. Files stored in database as JSON array
3. Accessible to students when viewing assignment
```

---

### Step 3: Students Submit Work

```tsx
Student Flow:
1. Navigate to /student/assignments
2. Find assignment and click "Submit"
3. Choose submission method:
   - Upload file (PDF, DOC, etc.)
   - Type text submission
   - Both file + text
4. Click "Submit"

Backend:
- File stored in server/uploads/
- Submission record created
- Status set to "submitted"
- Timestamp recorded
```

---

### Step 4: Lecturer Reviews Submissions

```tsx
1. Navigate to /lecturer/assignments
2. Find assignment and click "View Submissions"
3. See all submissions:
   - Student name & email
   - Submission date/time
   - Current status
   - Any existing marks/feedback
4. Stats show:
   - Total submitted: 45
   - Graded: 32
   - Pending: 13
   - Average: 78.45/100
```

---

### Step 5: Lecturer Grades Submission

```tsx
Option A - Grade One Submission:
1. Click on submission row
2. Grading panel opens inline
3. Enter marks (0-100)
4. Type feedback
5. Click "Save Grade"
6. Status changes to "Graded" ✓

Option B - Bulk Grade:
POST /assignments/:id/bulk-grade
{
  "submissions": [
    { "id": 101, "marks": 85 },
    { "id": 102, "marks": 92 }
  ]
}
```

---

### Step 6: Students See Their Grade

```tsx
Student Dashboard:
1. View assignment
2. See their submission
3. View marks received
4. Read lecturer feedback
```

---

## Database Schema Diagram

```
┌─────────────────────────────────┐
│       Assignments               │
├─────────────────────────────────┤
│ id (PK)                         │
│ title                           │
│ description                     │
│ type (individual/group/study)   │
│ course_id (FK)                  │
│ due_date                        │
│ submission_deadline             │
│ total_marks                     │
│ instructions                    │
│ attachments (JSON)              │
│ created_by (lecturer email)     │
│ created_at, updated_at          │
└─────────────────────────────────┘
           ↓ (1:Many)
┌─────────────────────────────────┐
│      Submissions                │
├─────────────────────────────────┤
│ id (PK)                         │
│ assignment_id (FK)              │
│ student_id (FK)                 │
│ submission_data (text/JSON)     │
│ attachments (JSON - file paths) │
│ marks (0-100)                   │
│ feedback (text)                 │
│ graded (boolean)                │
│ graded_at (timestamp)           │
│ graded_by (lecturer email)      │
│ status (pending/submitted/...)  │
│ created_at, updated_at          │
└─────────────────────────────────┘
           ↓ (FK)
┌─────────────────────────────────┐
│       Students                  │
├─────────────────────────────────┤
│ id (PK)                         │
│ email                           │
│ name                            │
│ role                            │
└─────────────────────────────────┘
```

---

## Key Features Implemented

### ✅ Submission Tracking
- Automatic status updates (pending → submitted → graded)
- Late submission detection
- Timestamps for all actions

### ✅ Grading System
- Manual marks entry
- Text feedback with rich formatting support
- Grading history (who graded, when)
- Auto-grading for multiple-choice (optional)

### ✅ File Management
- File upload support (multipart/form-data)
- Multiple files per submission
- Storage in server/uploads/
- File metadata (filename, size, path)

### ✅ Statistics & Reporting
- Total submissions count
- Graded vs pending ratio
- Average marks calculation
- Assignment completion metrics

### ✅ Bulk Operations
- Grade multiple submissions at once
- Revert grading (ungrade a submission)
- Export submission data

---

## Configuration

### Server Environment Variables
```env
# server/.env
DB_CLIENT=mysql2
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=assignment_dev

# Or use SQLite for development
DB_CLIENT=sqlite3
DATABASE_FILE=dev.sqlite3

# File uploads
MAX_FILE_SIZE=250kb  # Configure in multer
UPLOAD_DIR=server/uploads/

# Authentication
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

---

## Testing

### Run Tests
```bash
cd server
npm test

# Or from root
npm run test:server
```

### Test Example
```javascript
describe('Submissions API', () => {
  it('should create a submission', async () => {
    const res = await request(app)
      .post('/assignments/1/submissions')
      .set('Authorization', `Bearer ${token}`)
      .attach('files', 'test.pdf')
      .field('submission_data', JSON.stringify({ text: 'solution' }))
    
    expect(res.status).toBe(201)
    expect(res.body.id).toBeDefined()
  })
  
  it('should grade a submission', async () => {
    const res = await request(app)
      .put('/submissions/1/grade')
      .set('Authorization', `Bearer ${token}`)
      .send({
        marks: 85,
        feedback: 'Great work'
      })
    
    expect(res.status).toBe(200)
    expect(res.body.marks).toBe(85)
  })
})
```

---

## Troubleshooting

### Issue: Submissions not showing
**Solution:** 
- Check JWT token is valid
- Verify assignment exists
- Check database connection

### Issue: File upload fails
**Solution:**
- Check file size < 250kb
- Ensure upload directory exists
- Verify multer is installed

### Issue: Grades not saving
**Solution:**
- Check user has lecturer role
- Verify submission ID exists
- Check database permissions

---

## Future Enhancements

- [ ] Rubric-based grading
- [ ] Plagiarism detection integration
- [ ] Email notifications for submissions
- [ ] Peer review system
- [ ] Submission versioning
- [ ] API rate limiting
- [ ] Submission watermarking
- [ ] Anonymous grading mode

---

## API Reference

See `docs/LECTURER_ASSIGNMENTS_API.md` for complete endpoint documentation.

---

## Support

For issues or questions:
1. Check the logs: `server.stdout.log`, `server.stderr.log`
2. Review API documentation
3. Check database migrations ran successfully
4. Verify JWT tokens are valid
