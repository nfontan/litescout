import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import config from "../config.js";
import { devicestatus, entries } from "./schema.js";
import { desc, sql } from "drizzle-orm";

const sqlite = new Database(config.db);
export const db: BetterSQLite3Database = drizzle(sqlite);

export async function getLastEntryDate() {
  const result = await db
    .select({
      max: sql<number>`max(${entries.date})`,
    })
    .from(entries)
    .get({ max: 0 });
  return result.max * 1000;
}

export async function getEntries({ limit = 10 } = {}) {
  return db
    .select()
    .from(entries)
    .orderBy(desc(entries.date))
    .limit(limit)
    .all();
}

export async function getDeviceStatus({ limit = 10 } = {}) {
  return db
    .select()
    .from(devicestatus)
    .orderBy(desc(devicestatus.createdAt))
    .limit(limit)
    .all();
}
