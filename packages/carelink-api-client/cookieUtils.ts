import { CookieJar } from "tough-cookie";

export enum CarelinkCookies {
  token = "auth_tmp_token",
  tokenExpire = "c_token_valid_to",
  login = "_WL_AUTHCOOKIE_JSESSIONID",
}

export function hasCookie(jar: CookieJar, url: string, key: string): boolean {
  return jar.getCookiesSync(url).some((x) => x.key === key);
}

export function getCookie(jar: CookieJar, url: string, key: string): string {
  return jar.getCookiesSync(url).find((x) => x.key === key)?.value ?? "";
}

export async function removeAllCookies(jar: CookieJar) {
  return jar.removeAllCookies();
}
