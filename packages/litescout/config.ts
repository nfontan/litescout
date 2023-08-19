import "dotenv/config";
import { CarelinkFetcherConfig } from "../carelink-fetcher/config.js";

export interface LitescoutConfig extends CarelinkFetcherConfig {
  db: string;
  port: number;
}

function fromEnv(variable: string): string {
  const value = process.env[variable];
  if (typeof value === "undefined") {
    throw new Error(`${variable} env variable missing. Check your .env file`);
  }
  return value;
}

const config: LitescoutConfig = {
  username: fromEnv("MEDTRONIC_USERNAME"),
  password: fromEnv("MEDTRONIC_PASSWORD"),
  countryCode: fromEnv("MEDTRONIC_COUNTRY_CODE"),
  language: fromEnv("MEDTRONIC_LANGUAGE"),
  tokenFile: fromEnv("LITESCOUT_TOKEN_FILE"),
  cron: fromEnv("LITESCOUT_CRON"),
  db: fromEnv("LITESCOUT_DB"),
  port: parseInt(fromEnv("LITESCOUT_PORT"), 10),
};

export default config;
