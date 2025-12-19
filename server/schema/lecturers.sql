-- MySQL Database Schema for Lecturers Login Information
-- This schema creates the lecturers table and related indexes for authentication

-- Create the lecturers table
CREATE TABLE IF NOT EXISTS `lecturers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `department` VARCHAR(255) DEFAULT NULL,
  `title` VARCHAR(255) DEFAULT NULL,
  `bio` LONGTEXT DEFAULT NULL,
  `office_location` VARCHAR(255) DEFAULT NULL,
  `phone_number` VARCHAR(20) DEFAULT NULL,
  `created_by` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes for faster queries
  INDEX `idx_email` (`email`),
  INDEX `idx_department` (`department`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create audit/log table for tracking login attempts (optional)
CREATE TABLE IF NOT EXISTS `lecturer_login_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `lecturer_id` INT DEFAULT NULL,
  `email` VARCHAR(255) NOT NULL,
  `login_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(500) DEFAULT NULL,
  `success` BOOLEAN DEFAULT FALSE,
  `failure_reason` VARCHAR(255) DEFAULT NULL,
  
  FOREIGN KEY (`lecturer_id`) REFERENCES `lecturers`(`id`) ON DELETE SET NULL,
  INDEX `idx_lecturer_id` (`lecturer_id`),
  INDEX `idx_login_time` (`login_time`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create sessions table for tracking active sessions (optional)
CREATE TABLE IF NOT EXISTS `lecturer_sessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `lecturer_id` INT NOT NULL,
  `token` VARCHAR(500) UNIQUE NOT NULL,
  `token_expires_at` TIMESTAMP DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `last_activity` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(500) DEFAULT NULL,
  
  FOREIGN KEY (`lecturer_id`) REFERENCES `lecturers`(`id`) ON DELETE CASCADE,
  INDEX `idx_lecturer_id` (`lecturer_id`),
  INDEX `idx_token` (`token`),
  INDEX `idx_token_expires_at` (`token_expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
