export enum Urls {
  LoginSessionData = "patient/sso/login",
  Login = "https://mdtlogin-ocl.medtronic.com/mmcl/auth/oauth/v2/authorize/login",
  CountrySettings = "patient/countries/settings",
  MyUser = "patient/users/me",
  MyProfile = "patient/users/me/profile",
  MonitorData = "patient/monitor/data",
}

export const defaultUserAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36 Edg/90.0.818.46";

export const defaultHeaders = {
  "Accept-Language": "en;q=0.9, *;q=0.8",
  Connection: "keep-alive",
  "sec-ch-ua":
    '""Google Chrome"";deviceFamily=""87"", "" Not;A Brand"";deviceFamily=""99"", ""Chromium"";deviceFamily=""87""',
  "User-Agent": defaultUserAgent,
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;deviceFamily=b3;q=0.9",
};

export enum CarelinkUserRole {
  CarePartnerOus = "CARE_PARTNER_OUS",
  CarePartner = "CARE_PARTNER",
}
