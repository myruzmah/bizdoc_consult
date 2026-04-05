CREATE TABLE IF NOT EXISTS `agent_state` (
  `id` int AUTO_INCREMENT NOT NULL,
  `agentId` varchar(50) NOT NULL,
  `enabled` boolean NOT NULL DEFAULT true,
  `lastRun` timestamp NULL,
  `taskCount` int NOT NULL DEFAULT 0,
  `successRate` int NOT NULL DEFAULT 100,
  `status` varchar(20) NOT NULL DEFAULT 'idle',
  `lastError` text,
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `agent_state_id` PRIMARY KEY(`id`),
  CONSTRAINT `agent_state_agentId_unique` UNIQUE(`agentId`)
);

CREATE TABLE IF NOT EXISTS `agent_suggestions` (
  `id` int AUTO_INCREMENT NOT NULL,
  `agentId` varchar(50) NOT NULL,
  `targetDepartment` varchar(50) NOT NULL,
  `targetEntityType` varchar(50) NOT NULL,
  `targetEntityId` int NOT NULL,
  `suggestionType` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `suggestionStatus` enum('pending','accepted','rejected','expired') NOT NULL DEFAULT 'pending',
  `reviewedBy` varchar(255),
  `reviewedAt` timestamp NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `agent_suggestions_id` PRIMARY KEY(`id`)
);
