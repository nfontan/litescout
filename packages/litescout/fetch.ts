import fetcher from "carelink-fetcher";
import config from "./config.js";
import type * as CarelinkFetcher from "carelink-fetcher";
import { db, getLastEntryDate } from "./db/index.js";
import {
  entries as entriesSchema,
  devicestatus as devicestatusSchema,
} from "./db/schema.js";
import transform from "./transform.js";
import logger from "./logger.js";

async function insertEntries(data: CarelinkFetcher.ConnectData): Promise<void> {
  const { entries, devicestatus } = transform(data, Infinity);
  const lastEntryDate = await getLastEntryDate();
  const entriesToInsert = entries
    .filter((e) => e.date.getTime() > lastEntryDate)
    .reverse();
  if (entriesToInsert.length > 0) {
    await db.insert(entriesSchema).values(entriesToInsert).run();
    logger.info("inserted %d entries", entriesToInsert.length);
  } else {
    logger.warn(
      {
        lastEntryDate,
      },
      "No new entries to insert"
    );
  }
  await db.insert(devicestatusSchema).values(devicestatus).run();
}

async function insertData(data: CarelinkFetcher.ConnectData): Promise<void> {
  insertEntries(data);
}

export default fetcher({
  ...config,
  callback: insertData,
});
