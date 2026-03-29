CREATE TABLE `tax_savings_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subscriptionId` int NOT NULL,
	`year` varchar(4) NOT NULL,
	`grossTaxLiability` decimal(15,2),
	`savedAmount` decimal(15,2),
	`hamzuryFee` decimal(15,2),
	`tccDelivered` boolean NOT NULL DEFAULT false,
	`tccDeliveredAt` timestamp,
	`notes` text,
	`recordedBy` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tax_savings_records_id` PRIMARY KEY(`id`)
);
