import CarelinkApiClient from "carelink-api-client";
import { loadToken, saveToken } from "./tokenCache.js";
import jwt from "jsonwebtoken";
import configDefaults, { CarelinkFetcherConfig } from "./config.js";
import cron from "node-cron";
import logger from "./logger.js";
import { serializeError } from "serialize-error";
export type * from "carelink-api-client";
export type * from "node-cron";

function isTokenExpired(token: string): boolean {
  const t = jwt.decode(token, { json: true });
  if (!t || !t.exp) return true;
  logger.debug({ exp: t.exp, now: new Date().getTime() / 1000 }, "jwt exp");
  return t.exp < new Date().getTime() / 1000;
}

type Fetcher = {
  start: () => Promise<{ task: cron.ScheduledTask }>;
  client: CarelinkApiClient;
};

export default function fetcher(configuration: CarelinkFetcherConfig): Fetcher {
  const config: Required<CarelinkFetcherConfig> = {
    ...configDefaults,
    ...configuration,
  };
  const client = new CarelinkApiClient({
    username: config.username,
    password: config.password,
    countryCode: config.countryCode,
  });

  const start = async () => {
    let token = await loadToken();
    const task = cron.schedule(config.cron, async () => {
      logger.info("fetch start");
      if (!token || isTokenExpired(token)) {
        logger.info({ token, isTokenExpired: isTokenExpired(token) }, "login");
        try {
          token = await client.login();
          await saveToken(token);
        } catch (error) {
          logger.error({ error: serializeError(error) }, "login");
        }
      } else {
        client.setAuthToken(token);
      }
      try {
        const data = await client.getRecentData();
        config.callback(data);
      } catch (error) {
        logger.error({ error: serializeError(error) }, "Error getting data");
      }
    });
    return { task };
  };

  return {
    start,
    client,
  };
}
