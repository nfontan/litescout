import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import config from "./config.js";

const betterSqlite = new Database(config.db);
const db = drizzle(betterSqlite);

migrate(db, { migrationsFolder: "drizzle" });
