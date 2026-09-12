CREATE DATABASE IF NOT EXISTS `react_nestdb`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `react_nestdb`;

CREATE TABLE IF NOT EXISTS `users` (
  `_id` varchar(64) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`_id`),
  UNIQUE KEY `uq_users_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `questions` (
  `_id` varchar(64) NOT NULL,
  `title` varchar(255) NOT NULL,
  `desc` text DEFAULT NULL,
  `js` text DEFAULT NULL,
  `css` text DEFAULT NULL,
  `isPublished` tinyint(1) NOT NULL DEFAULT 0,
  `isDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `isStar` tinyint(1) NOT NULL DEFAULT 0,
  `author` varchar(100) NOT NULL,
  `answerCount` int NOT NULL DEFAULT 0,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `componentList` json DEFAULT NULL,
  PRIMARY KEY (`_id`),
  KEY `idx_questions_author_deleted` (`author`, `isDeleted`),
  KEY `idx_questions_author_star` (`author`, `isStar`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `answers` (
  `_id` varchar(64) NOT NULL,
  `questionId` varchar(64) NOT NULL,
  `answerList` json DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`_id`),
  KEY `idx_answers_question_created` (`questionId`, `createdAt`),
  CONSTRAINT `fk_answers_question` FOREIGN KEY (`questionId`) REFERENCES `questions` (`_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
