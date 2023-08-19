import logger from "./logger.js";
import { ConnectData } from "carelink-api-client/types/ConnectData.js";

export interface CarelinkFetcherConfig {
  username: string;
  password: string;
  countryCode: string;
  language?: string;
  tokenFile?: string;
  cron?: string;
  callback?: <T>(data: ConnectData) => Promise<T | void>;
  // svgLimit: number;
  // maxRetry: number;
}

const configDefaults = {
  countryCode: "AR",
  language: "en",
  tokenFile: "./.carelink.jwt",
  cron: "*/5 * * * *",
  callback: async (data: ConnectData) => {
    // TODO: how to convert ConnectData to Roarr.JsonObject?
    logger.info({ data } as any, "fetch data");
  },
  // svgLimit: 24,
  // maxRetry: 32,
};

export default configDefaults;
