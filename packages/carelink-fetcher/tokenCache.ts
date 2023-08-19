import configDefaults from "./config.js";
import fs from "node:fs/promises";

export async function saveToken(token: string): Promise<void> {
  return fs.writeFile(configDefaults.tokenFile, token, {
    encoding: "utf-8",
  });
}

export async function loadToken(): Promise<string> {
  try {
    return await fs.readFile(configDefaults.tokenFile, {
      encoding: "utf-8",
    });
  } catch (error) {
    // console.warn('no token file found');
    return "";
  }
}
