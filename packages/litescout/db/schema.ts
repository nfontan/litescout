import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";
import { InferModel } from "drizzle-orm";

export const entries = sqliteTable("entries", {
  id: integer("id").primaryKey(),
  type: text("type").notNull(),
  sgv: integer("sgv"),
  date: integer("date", { mode: "timestamp" }).notNull(),
  device: text("device"),
  trend: integer("trend"),
  direction: text("direction"),
  utcOffset: integer("utcOffset"),
  sysDate: integer("sysDate", { mode: "timestamp" }),
});

export type Entry = InferModel<typeof entries>;
export type InsertEntry = InferModel<typeof entries, "insert">;

export interface PumpDeviceStatus {
  battery: {
    percent: number;
  };
  reservoir: number;
  iob: {
    timestamp: string;
    bolusiob: number;
  };
  clock: string;
}
export interface ConnectDeviceStatus {
  sensorState: string;
  calibStatus: string;
  sensorDurationHours: number;
  timeToNextCalibHours: number;
  conduitInRange: boolean;
  conduitMedicalDeviceInRange: boolean;
  conduitSensorInRange: boolean;
}

export const devicestatus = sqliteTable("devicestatus", {
  id: integer("id").primaryKey(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  device: text("device"),
  uploaderBattery: integer("uploader_battery"),
  pump: text("pump"),
  connect: text("connect"),
});

export type DeviceStatus = InferModel<typeof devicestatus>;
export type InsertDeviceStatus = InferModel<typeof devicestatus, "insert">;
