CREATE TABLE `entries` (
	`id` integer PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`sgv` integer,
	`date` integer NOT NULL,
	`device` text,
	`trend` integer,
	`direction` text,
	`utcOffset` integer,
	`sysDate` integer
);
