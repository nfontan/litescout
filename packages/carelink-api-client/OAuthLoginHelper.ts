import { CarelinkCookies } from "./cookieUtils.js";
import configDefaults from "../carelink-fetcher/config.js";
import { Urls } from "./api.js";
import { getCookie } from "./cookieUtils.js";
import { Got } from "got";
import { CookieJar } from "tough-cookie";
import logger from "./logger.js";
import { serializeError } from "serialize-error";

interface LoginValues {
  url: string;
  action: "consent";
  sessionID: string;
  sessionData: string;
  response_type: "code";
  response_mode: "query";
}

interface LoginSessionData {
  sessionID: string;
  sessionData: string;
  loginUrl: string;
}

export default class OauthLoginHelper {
  api: Got;
  jar: CookieJar;
  constructor(httpClient: Got, jar: CookieJar) {
    this.api = httpClient;
    this.jar = jar;
  }
  async getLoginSessionData(): Promise<LoginSessionData | null> {
    const response = await this.api.get(Urls.LoginSessionData, {
      searchParams: {
        country: configDefaults.countryCode,
        lang: configDefaults.language,
      },
    });
    const lastRedirect = response.redirectUrls.at(-1);
    if (!lastRedirect) return null;
    let loginUrl = /(<form action=")(.*)" method="POST"/gm.exec(
      response.body
    )?.[2];
    if (!loginUrl) {
      logger.warn(
        "LoginUrl not detected from form action. Using configured default"
      );
      loginUrl = Urls.Login;
    }
    const result: LoginSessionData = {
      sessionID: lastRedirect.searchParams.get("sessionID") ?? "",
      sessionData: lastRedirect.searchParams.get("sessionData") ?? "",
      loginUrl,
    };
    if (!result.sessionData || !result.sessionID) return null;
    return result;
  }

  static extractLoginValuesFromHtml(html: string): LoginValues {
    const url = /(<form action=")(.*)" method="POST"/gm.exec(html)?.[2];
    const sessionID =
      /(<input type="hidden" name="sessionID" value=")(.*)"/gm.exec(html)?.[2];
    const sessionData =
      /(<input type="hidden" name="sessionData" value=")(.*)"/gm.exec(
        html
      )?.[2];
    if (!url || !sessionID || !sessionData) {
      throw new Error("error parsing html values from login redirect");
    }
    return {
      url,
      action: "consent",
      sessionID,
      sessionData,
      response_type: "code",
      response_mode: "query",
    };
  }

  async postLogin(
    session: LoginSessionData,
    username: string,
    password: string
  ): Promise<LoginValues> {
    const requestOptions = {
      form: {
        sessionID: session.sessionID,
        sessionData: session.sessionData,
        locale: configDefaults.language,
        action: "login",
        username,
        password,
        actionButton: "Log in",
      },
      searchParams: {
        country: configDefaults.countryCode,
        locale: configDefaults.language,
      },
      prefixUrl: "",
    };
    try {
      const response = await this.api.post(session.loginUrl, requestOptions);
      if (response.body.includes("login_page.error.LoginFailed")) {
        throw new Error("Invalid login");
      }
      return OauthLoginHelper.extractLoginValuesFromHtml(response.body);
    } catch (error) {
      logger.error({ error: serializeError(error) }, "postLogin");
      throw error;
    }
  }

  async postConsent(values: LoginValues): Promise<string> {
    const { url, ...loginValues } = values;
    const response = await this.api.post(url, {
      form: loginValues,
      followRedirect: false,
      prefixUrl: "",
    });
    if (!response.headers.location) {
      throw new Error("Expected redirect not found");
    }
    await this.api.get(response.headers.location, {
      followRedirect: false,
      prefixUrl: "",
    });
    const token = getCookie(
      this.jar,
      response.headers.location ?? "",
      CarelinkCookies.token
    );
    return token;
  }
}
