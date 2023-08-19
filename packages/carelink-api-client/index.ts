// Adapter based on
// https://github.com/paul1956/CareLink/blob/master/src/CareLink/SupportClasses/CareLinkClient.vb

import got, { Got } from "got";
import { Urls, defaultHeaders, defaultUserAgent } from "./api.js";
import { removeAllCookies } from "./cookieUtils.js";
import OauthLoginHelper from "./OAuthLoginHelper.js";
import { ConnectData } from "./types/ConnectData.js";
import { CountrySettings } from "./types/CountrySettings.js";
import { MonitorData } from "./types/MonitorData.js";
import { MyUser } from "./types/MyUser.js";
import { Profile } from "./types/Profile.js";
import { CookieJar } from "tough-cookie";
import { getCarelinkUrl } from "./regions.js";
import logger from "./logger.js";
export type * from "./types/index.js";
export type * from "got";

export type CarelinkApiClientOptions = {
  username: string;
  password: string;
  countryCode: string;
  language?: string;
  userAgent?: string;
};

const jsonHeaders = {
  accept: "application/json, text/plain, */*",
  "Content-Type": "application/json; charset=utf-8",
};
const RECENT_DATA_DEFAULT_URL =
  "https://clcloud.minimed.eu/connect/carepartner/v5/display/message";

const defaultOptions = {
  language: "en",
  userAgent: defaultUserAgent,
};

export default class CarelinkApiClient {
  options: Required<CarelinkApiClientOptions>;
  token?: string;
  api: Got;
  jar: CookieJar;

  constructor(options: CarelinkApiClientOptions) {
    this.options = { ...defaultOptions, ...options };
    this.jar = new CookieJar();
    this.api = got.extend({
      cookieJar: this.jar,
      mutableDefaults: true,
      prefixUrl: `https://${this.carelinkUrl}`,
      headers: { ...defaultHeaders, "User-Agent": this.options.userAgent },
    });
    logger.info(
      { prefixUrl: `https://${this.carelinkUrl}` },
      "init api client"
    );
  }

  get carelinkUrl(): string {
    return getCarelinkUrl(this.options.countryCode);
  }

  setAuthToken(token?: string): void {
    this.api.defaults.options.headers = {
      Authorization: token ? `Bearer ${token}` : undefined,
    };
  }

  async login(): Promise<string> {
    await removeAllCookies(this.jar);
    const helper = new OauthLoginHelper(this.api, this.jar);
    const sessionData = await helper.getLoginSessionData();
    if (!sessionData) {
      throw new Error(`Could not get session data`);
    }
    const loginResponseData = await helper.postLogin(
      sessionData,
      this.options.username,
      this.options.password
    );
    this.token = await helper.postConsent(loginResponseData);
    this.setAuthToken(this.token);
    return this.token;
  }

  logout(): void {
    this.token = undefined;
    this.setAuthToken(undefined);
  }

  async getMonitorData() {
    const response = await this.api
      .get(Urls.MonitorData, { headers: jsonHeaders })
      .json<MonitorData>();
    return response;
  }

  async getMyUser() {
    const response = await this.api
      .get(Urls.MyUser, { headers: jsonHeaders })
      .json<MyUser>();
    return response;
  }

  async getProfile() {
    const response = await this.api
      .get(Urls.MyProfile, { headers: jsonHeaders })
      .json<Profile>();
    return response;
  }

  async getCountrySettings() {
    const response = await this.api
      .get(Urls.CountrySettings, {
        searchParams: {
          countryCode: this.options.countryCode,
          language: this.options.language,
        },
      })
      .json<CountrySettings>();
    return response;
  }

  async getRecentData(url: string = RECENT_DATA_DEFAULT_URL) {
    return this.api
      .post(url, {
        json: {
          username: this.options.username,
          role: "carepartner",
        },
        prefixUrl: "",
      })
      .json<ConnectData>();
  }
}
