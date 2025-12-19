# MySQL Lecturers Database Setup Guide

## Overview
This guide provides instructions for setting up the MySQL database for storing lecturer login information.

## Database Schema

The lecturers database consists of three main tables:

### 1. **lecturers** (Main Table)
Stores lecturer authentication and profile information.

**Columns:**
- `id` (INT, PRIMARY KEY) - Auto-incrementing identifier
- `email` (VARCHAR 255, UNIQUE) - Lecturer email (used for login)
- `password_hash` (VARCHAR 255) - Bcrypt hashed password
- `name` (VARCHAR 255) - Full name of lecturer
- `department` (VARCHAR 255, NULLABLE) - Academic department
- `title` (VARCHAR 255, NULLABLE) - Job title (e.g., "Associate Professor")
- `bio` (LONGTEXT, NULLABLE) - Biographical information
- `office_location` (VARCHAR 255, NULLABLE) - Office location/room number
- `phone_number` (VARCHAR 20, NULLABLE) - Contact phone number
- `created_by` (VARCHAR 255, NULLABLE) - Admin who created the account
- `created_at` (TIMESTAMP) - Account creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

**Indexes:**
- `email` - For fast login lookups
- `department` - For filtering by department
- `created_at` - For sorting/filtering by creation date

### 2. **lecturer_login_logs** (Audit Table)
Tracks all login attempts for security and auditing.

**Columns:**
- `id` (INT, PRIMARY KEY) - Auto-incrementing identifier
- `lecturer_id` (INT, FOREIGN KEY) - Reference to lecturer
- `email` (VARCHAR 255) - Email attempted
- `login_time` (TIMESTAMP) - When the login attempt occurred
- `ip_address` (VARCHAR 45) - Client IP address
- `user_agent` (VARCHAR 500) - Browser/client info
- `success` (BOOLEAN) - Whether login was successful
- `failure_reason` (VARCHAR 255) - Why login failed (if applicable)

**Indexes:**
- `lecturer_id` - For finding logs by lecturer
- `login_time` - For chronological queries
- `email` - For finding logs by email

### 3. **lecturer_sessions** (Sessions Table)
Manages active JWT session tokens.

**Columns:**
- `id` (INT, PRIMARY KEY) - Auto-incrementing identifier
- `lecturer_id` (INT, FOREIGN KEY) - Reference to lecturer
- `token` (VARCHAR 500, UNIQUE) - JWT token
- `token_expires_at` (TIMESTAMP) - Token expiration time
- `created_at` (TIMESTAMP) - Session creation time
- `last_activity` (TIMESTAMP) - Last activity timestamp
- `ip_address` (VARCHAR 45) - IP address of session
- `user_agent` (VARCHAR 500) - Browser/client info

**Indexes:**
- `lecturer_id` - For finding sessions by lecturer
- `token` - For validating tokens
- `token_expires_at` - For cleaning up expired tokens

---

## Setup Instructions

### Option 1: Using MySQL Command Line

1. **Connect to MySQL:**
```bash
mysql -h localhost -u root -p
```

2. **Create the database:**
```sql
CREATE DATABASE IF NOT EXISTS assignment_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE assignment_dev;
```

3. **Import the schema:**
```sql
SOURCE /path/to/server/schema/lecturers.sql;
```

4. **Verify tables created:**
```sql
SHOW TABLES;
```

### Option 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Create a new connection (if needed)
3. Open the `server/schema/lecturers.sql` file
4. Execute the entire script
5. Check the Schemas section to verify tables

### Option 3: Using Docker Compose

If using the included Docker setup:

```bash
cd server
npm run db:compose
```

Then run the schema file:
```bash
docker exec -i assignment-mysql mysql -u root -pexample assignment_dev < server/schema/lecturers.sql
```

---

## Configuration

### .env File Setup

Ensure your `server/.env` has the correct database credentials:

```
DB_CLIENT=mysql2
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=assignment_dev
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
```

### Connection String (Alternative)

For some drivers, you can use a connection string:
```
DATABASE_URL=mysql://root:password@localhost:3306/assignment_dev
```

---

## API Integration

The Node.js/Express server (`server/index.js`) automatically:

1. **On Startup:** Runs auto-migrations if using Knex.js
2. **On Register:** Inserts lecturer into `lecturers` table
3. **On Login:** Queries `lecturers` table for authentication
4. **On Token Validation:** Can optionally check `lecturer_sessions` table

### Register a Lecturer (API)

**POST** `/register`

```json
{
  "email": "prof@example.com",
  "password": "secure_password",
  "name": "Dr. Jane Smith",
  "role": "lecturer",
  "department": "Computer Science",
  "title": "Associate Professor"
}
```

### Login (API)

**POST** `/login`

```json
{
  "email": "prof@example.com",
  "password": "secure_password"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "lecturer"
}
```

---

## Security Best Practices

1. **Password Hashing:** All passwords are hashed using bcrypt (10 rounds) before storage
2. **Unique Emails:** Email column is UNIQUE to prevent duplicate accounts
3. **Audit Logging:** Enable `lecturer_login_logs` to track all login attempts
4. **Token Management:** Use `lecturer_sessions` to track and invalidate tokens
5. **HTTPS:** Always use HTTPS in production to protect credentials
6. **Rate Limiting:** Implement rate limiting on login endpoint
7. **IP Whitelisting:** Consider IP whitelisting for sensitive operations

---

## Database Queries

### Find a Lecturer by Email
```sql
SELECT * FROM lecturers WHERE email = 'prof@example.com';
```

### Get All Lecturers by Department
```sql
SELECT * FROM lecturers WHERE department = 'Computer Science' ORDER BY name;
```

### View Recent Login Attempts
```sql
SELECT * FROM lecturer_login_logs 
ORDER BY login_time DESC 
LIMIT 50;
```

### Find Failed Logins
```sql
SELECT * FROM lecturer_login_logs 
WHERE success = FALSE 
ORDER BY login_time DESC;
```

### Check Active Sessions
```sql
SELECT lecturer_id, token_expires_at, last_activity 
FROM lecturer_sessions 
WHERE token_expires_at > NOW();
```

### Clean Up Expired Sessions
```sql
DELETE FROM lecturer_sessions 
WHERE token_expires_at < NOW();
```

---

## Maintenance

### Regular Tasks

**Weekly:**
- Review login logs for suspicious activity
- Clean up expired sessions:
```sql
DELETE FROM lecturer_sessions WHERE token_expires_at < NOW();
```

**Monthly:**
- Archive old login logs (older than 3 months)
- Check for unused accounts
- Review department distribution

**Quarterly:**
- Full database backup
- Update passwords policy if needed
- Review and optimize indexes

---

## Troubleshooting

### Connection Failed
- Check MySQL service is running: `sudo systemctl status mysql`
- Verify credentials in `.env`
- Check firewall rules (port 3306)

### Duplicate Key Error
- Email already exists in database
- Use a different email address or reset account

### JWT Errors
- Check `JWT_SECRET` matches in `.env`
- Verify token hasn't expired
- Check Authorization header format: `Bearer <token>`

### Performance Issues
- Ensure indexes are created (check with `SHOW INDEXES FROM lecturers;`)
- Monitor with: `SHOW PROCESSLIST;`
- Profile slow queries: `SET GLOBAL slow_query_log = 'ON';`

---

## Backup & Recovery

### Backup Database
```bash
mysqldump -u root -p assignment_dev > backup.sql
```

### Restore from Backup
```bash
mysql -u root -p assignment_dev < backup.sql
```

### Backup Specific Tables
```bash
mysqldump -u root -p assignment_dev lecturers > lecturers_backup.sql
```

---

## References

- MySQL Documentation: https://dev.mysql.com/doc/
- Bcrypt Documentation: https://github.com/kelektiv/node.bcrypt.js
- JWT Documentation: https://jwt.io/
- Express Authentication: https://expressjs.com/en/guide/authentication.html

---

## Assignments Schema & Setup ✅

This project includes a dedicated assignments schema to manage assignments, questions, choices, submissions and files. The schema file is located at `server/schema/assignments.sql`.

### Apply the assignments schema

Using PowerShell or any shell, import the assignments schema into your `assignment_dev` database:

```powershell
# Make sure you have created the target database (see earlier instructions)
mysql -u root -p assignment_dev < server/schema/assignments.sql
```

Or, if you prefer using the `SOURCE` command inside the MySQL client:

```sql
USE assignment_dev;
SOURCE /absolute/path/to/project/server/schema/assignments.sql;
```

### Apply via npm script (recommended when running server)

From the `server` directory you can run a Node script that applies the assignments schema using the configured DB connection (uses `server/.env` credentials):

```powershell
cd server
npm run db:apply:assignments
```

This is useful if you don't have the MySQL CLI on your PATH or prefer to apply the schema programmatically.

### Running the server test-suite

To run the backend tests (Mocha + Supertest):

```powershell
cd server
npm test
```

The test suite exercises assignments, questions, submissions and the new assignment question/choice/answer endpoints.

### What the schema provides

- `assignments` — main table for assignment metadata
- `assignment_questions` — per-assignment questions (MCQ, short answer, essay, file upload)
- `assignment_choices` — choices for MCQ questions
- `submissions` — student submissions (already created by migrations)
- `submission_answers` — answers for each question within a submission
- `submission_files` — files uploaded with a submission
- `assignment_recipients` — optional mapping for assignment recipients
- `vw_assignment_stats` — helper view for submission counts and average grades

### Quick API examples (server endpoints)

Create an assignment (example):

POST /api/assignments

```json
{
  "title": "Assignment 1",
  "description": "Read chapters 1-3 and answer questions",
  "course_id": 1,
  "lecturer_id": 2,
  "due_at": "2026-01-15T23:59:00Z",
  "status": "published"
}
```

Add a question to an assignment (example):

POST /api/assignments/:id/questions

```json
{
  "question_text": "What is polymorphism?",
  "question_type": "short_answer",
  "points": 10
}
```

Submit an assignment (example):

POST /api/assignments/:id/submit

```json
{
  "student_id": 42,
  "submission_data": { "answers": [{ "question_id": 1, "answer_text": "..." }] }
}
```

Grade a submission (example):

PUT /api/submissions/:id/grade

```json
{
  "graded_by": 2,
  "marks": 78,
  "feedback": "Good work"
}
```

### Notes

- The server currently runs the migration logic on startup via `server/migrate` (see `server/db.js`) — if your server is running it will create missing tables automatically.
- Use `vw_assignment_stats` for quick reporting: `SELECT * FROM vw_assignment_stats WHERE assignment_id = 1;`
- Consider enabling the `assignment_recipients` table if you want targeted distribution of assignments to specific students.
