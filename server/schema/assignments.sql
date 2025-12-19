-- Assignments schema for MySQL (assignment_dev)
-- Creates tables to store assignments, questions, choices, student submissions, answers and files

-- Make sure you're using the target database
CREATE DATABASE IF NOT EXISTS `assignment_dev` CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
USE `assignment_dev`;

-- Main assignments table (aligned to runtime migrations)
CREATE TABLE IF NOT EXISTS `assignments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `external_id` VARCHAR(255) UNIQUE NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `type` VARCHAR(64) NOT NULL DEFAULT 'individual',
  `course_id` INT UNSIGNED DEFAULT NULL,
  `due_date` DATETIME DEFAULT NULL,
  `submission_deadline` DATETIME DEFAULT NULL,
  `total_marks` INT DEFAULT NULL,
  `instructions` TEXT,
  `attachments` TEXT,
  `question_set_id` INT UNSIGNED DEFAULT NULL,
  `created_by` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_assignments_course` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Questions per assignment
CREATE TABLE IF NOT EXISTS `assignment_questions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `assignment_id` BIGINT UNSIGNED NOT NULL,
  `question_text` LONGTEXT NOT NULL,
  `question_type` ENUM('mcq','short_answer','essay','file_upload') NOT NULL DEFAULT 'short_answer',
  `points` DECIMAL(8,2) NOT NULL DEFAULT 0,
  `metadata` JSON DEFAULT NULL,
  `position` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_questions_assignment` (`assignment_id`),
  CONSTRAINT `fk_questions_assignment` FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Choices for MCQ questions
CREATE TABLE IF NOT EXISTS `assignment_choices` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `question_id` BIGINT UNSIGNED NOT NULL,
  `choice_text` VARCHAR(1000) NOT NULL,
  `is_correct` TINYINT(1) NOT NULL DEFAULT 0,
  `position` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `idx_choices_question` (`question_id`),
  CONSTRAINT `fk_choices_question` FOREIGN KEY (`question_id`) REFERENCES `assignment_questions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Submissions by students (align to runtime `submissions` table)
CREATE TABLE IF NOT EXISTS `submissions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `assignment_id` INT UNSIGNED NOT NULL,
  `student_id` INT UNSIGNED DEFAULT NULL,
  `submission_data` TEXT DEFAULT NULL,
  `attachments` TEXT,
  `marks` INT DEFAULT NULL,
  `graded` TINYINT(1) DEFAULT 0,
  `feedback` TEXT DEFAULT NULL,
  `graded_at` DATETIME DEFAULT NULL,
  `graded_by` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('pending','submitted','graded','late') DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_submissions_assignment` (`assignment_id`),
  INDEX `idx_submissions_student` (`student_id`),
  CONSTRAINT `fk_submissions_assignment` FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_submissions_student` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Per-question answers for each submission
CREATE TABLE IF NOT EXISTS `submission_answers` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `submission_id` INT UNSIGNED NOT NULL,
  `question_id` INT UNSIGNED NOT NULL,
  `answer_text` TEXT DEFAULT NULL,
  `selected_choice_id` INT UNSIGNED DEFAULT NULL,
  `points_awarded` DECIMAL(8,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_answers_submission` (`submission_id`),
  INDEX `idx_answers_question` (`question_id`),
  CONSTRAINT `fk_answers_submission` FOREIGN KEY (`submission_id`) REFERENCES `submissions`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_answers_question` FOREIGN KEY (`question_id`) REFERENCES `assignment_questions`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_answers_choice` FOREIGN KEY (`selected_choice_id`) REFERENCES `assignment_choices`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Files uploaded with submissions
CREATE TABLE IF NOT EXISTS `submission_files` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `submission_id` BIGINT UNSIGNED NOT NULL,
  `file_path` VARCHAR(1000) NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `uploaded_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_files_submission` (`submission_id`),
  CONSTRAINT `fk_files_submission` FOREIGN KEY (`submission_id`) REFERENCES `assignment_submissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: a table to map assignments to students directly (e.g., for assigned groups or specific recipients)
CREATE TABLE IF NOT EXISTS `assignment_recipients` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `assignment_id` BIGINT UNSIGNED NOT NULL,
  `student_id` BIGINT UNSIGNED NOT NULL,
  `assigned_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_recipients_assignment` (`assignment_id`),
  INDEX `idx_recipients_student` (`student_id`),
  CONSTRAINT `fk_recipients_assignment` FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_recipients_student` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Useful helper views (optional)
-- view: assignment stats (submission count, average grade)
CREATE OR REPLACE VIEW `vw_assignment_stats` AS
SELECT
  a.id AS assignment_id,
  a.title,
  COUNT(s.id) AS submission_count,
  AVG(s.marks) AS average_grade
FROM `assignments` a
LEFT JOIN `submissions` s ON s.assignment_id = a.id
GROUP BY a.id;

-- End of schema
