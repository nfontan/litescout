CREATE TABLE `devicestatus` (
	`id` integer PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`device` text,
	`uploader_battery` integer,
	`pump` text,
	`connect` text
);