CREATE TABLE `brandQaItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`department` varchar(50) NOT NULL,
	`item` text NOT NULL,
	`qaType` enum('proposal','content','visual','document') NOT NULL,
	`qaStatus` enum('pending','approved','revision') NOT NULL DEFAULT 'pending',
	`submittedBy` varchar(255),
	`reviewedBy` varchar(255),
	`urgent` boolean NOT NULL DEFAULT false,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `brandQaItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dept_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`threadId` varchar(50) NOT NULL,
	`fromStaffId` varchar(50) NOT NULL,
	`fromName` varchar(255) NOT NULL,
	`fromDepartment` varchar(50) NOT NULL,
	`toDepartment` varchar(50),
	`toStaffId` varchar(50),
	`message` text NOT NULL,
	`messageType` enum('text','file','task_ref','system') NOT NULL DEFAULT 'text',
	`isRead` boolean NOT NULL DEFAULT false,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dept_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `developmentPlans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staffEmail` varchar(255) NOT NULL,
	`staffName` varchar(255) NOT NULL,
	`goal` text NOT NULL,
	`targetDate` varchar(30),
	`progress` int NOT NULL DEFAULT 0,
	`support` varchar(255),
	`notes` text,
	`createdBy` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `developmentPlans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hiringApplications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobPostingId` int NOT NULL,
	`candidateName` varchar(255) NOT NULL,
	`candidateEmail` varchar(255),
	`candidatePhone` varchar(50),
	`hiringStatus` enum('received','shortlisted','interviewed','offer_sent','hired','rejected') NOT NULL DEFAULT 'received',
	`score` varchar(20),
	`interviewDate` varchar(30),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hiringApplications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jobPostings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`department` varchar(100) NOT NULL,
	`jobStatus` enum('open','on_hold','closed','filled') NOT NULL DEFAULT 'open',
	`description` text,
	`requirements` text,
	`createdBy` varchar(255),
	`postedAt` timestamp NOT NULL DEFAULT (now()),
	`closedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jobPostings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mediaAssets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`assetType` enum('zip','audio','video','figma','image','document') NOT NULL,
	`fileSize` varchar(50),
	`fileUrl` varchar(500),
	`uploadedBy` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mediaAssets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partnerships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`partnerType` enum('referral_partner','community_partner','events_partner','regional_partner','ecosystem_partner') NOT NULL,
	`contact` varchar(255),
	`partnerStage` enum('researching','outreach','agreed','active','paused') NOT NULL DEFAULT 'researching',
	`referrals` int NOT NULL DEFAULT 0,
	`notes` text,
	`createdBy` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partnerships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `performanceCycles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cycleName` varchar(255) NOT NULL,
	`period` varchar(50) NOT NULL,
	`cycleStatus` enum('upcoming','active','completed') NOT NULL DEFAULT 'upcoming',
	`totalReviews` int NOT NULL DEFAULT 0,
	`completedReviews` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `performanceCycles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `podcastEpisodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`episodeNumber` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`guest` varchar(255),
	`recordingDate` varchar(30),
	`duration` varchar(20),
	`podcastStatus` enum('scheduled','recorded','editing','published') NOT NULL DEFAULT 'scheduled',
	`plays` int NOT NULL DEFAULT 0,
	`audioUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `podcastEpisodes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ridiCommunities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`state` varchar(100) NOT NULL,
	`coordinator` varchar(255),
	`members` int NOT NULL DEFAULT 0,
	`communityStatus` enum('active','inactive','forming') NOT NULL DEFAULT 'forming',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ridiCommunities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `socialPlatformStats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`platform` varchar(50) NOT NULL,
	`handle` varchar(100),
	`followers` int NOT NULL DEFAULT 0,
	`growth` varchar(20),
	`postsCount` int NOT NULL DEFAULT 0,
	`reach` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `socialPlatformStats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trainingSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`trainingType` enum('internal','external','online','workshop') NOT NULL DEFAULT 'internal',
	`sessionDate` varchar(30),
	`participants` int NOT NULL DEFAULT 0,
	`trainingStatus` enum('scheduled','in_progress','completed','cancelled') NOT NULL DEFAULT 'scheduled',
	`notes` text,
	`createdBy` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trainingSessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `weekly_targets_v2` (
	`id` int AUTO_INCREMENT NOT NULL,
	`weekOf` varchar(10) NOT NULL,
	`department` varchar(50) NOT NULL,
	`targetType` varchar(50) NOT NULL,
	`description` text NOT NULL,
	`assignedBy` varchar(255) NOT NULL,
	`assignedTo` varchar(255),
	`deadline` varchar(30) NOT NULL,
	`targetStatus` enum('issued','in_progress','submitted','approved','revision_requested') NOT NULL DEFAULT 'issued',
	`submissionNote` text,
	`reviewNote` text,
	`targetOutcome` enum('hit','missed','partial'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `weekly_targets_v2_id` PRIMARY KEY(`id`)
);
