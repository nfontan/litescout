import { DeviceStatus, Entry } from "../db/schema.js";

// this type was obtained from a real response from nightscout entries api.
// TODO: Check if this is correct compared to other nightscout instances
export interface NightscoutEntry {
  _id: string;
  type: string;
  sgv: number;
  date: number;
  dateString: string;
  device: string;
  trend: number;
  direction: string;
  utcOffset: number;
  sysTime: string;
  mills: number;
}

export interface NightscoutDevicestatus {
  _id: string;
  created_at: string;
  device: string;
  uploader: {
    battery: number;
  };
  pump: object;
  connect: object;
  mills: number;
}

export function toNightscoutEntry(entry: Entry): NightscoutEntry {
  return {
    _id: entry.id.toString(),
    type: entry.type,
    sgv: entry.sgv || 0,
    date: entry.date.getTime(),
    dateString: entry.date.toISOString(),
    device: entry.device || "",
    trend: entry.trend || 0,
    direction: entry.direction || "",
    utcOffset: 0,
    sysTime: entry.sysDate?.toISOString() || "",
    mills: entry.sysDate?.getTime() || 0,
  };
}

export function toNightscoutDevicestatus(
  ds: DeviceStatus
): NightscoutDevicestatus {
  return {
    _id: ds.id.toString(),
    created_at: ds.createdAt.toISOString(),
    device: ds.device || "",
    uploader: {
      battery: ds.uploaderBattery || 0,
    },
    pump: JSON.parse(ds.pump || "null"),
    connect: JSON.parse(ds.connect || "null"),
    mills: ds.createdAt.getTime(),
  };
}
