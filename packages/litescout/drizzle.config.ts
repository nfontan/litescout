import type { Config } from "drizzle-kit";
import config from "./config.js";

export default {
  schema: "./db/schema.ts",
  connectionString: config.db,
} satisfies Config;
