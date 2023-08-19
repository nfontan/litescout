export interface CountrySettings {
  name: string;
  languages?: LanguagesEntity[] | null;
  defaultLanguage: string;
  defaultCountryName: string;
  defaultDevice: string;
  dialCode: string;
  cpMobileAppAvailable: boolean;
  uploaderAllowed: boolean;
  techSupport: string;
  techDays: string;
  firstDayOfWeek: string;
  techHours: string;
  legalAge: number;
  shortDateFormat: string;
  shortTimeFormat: string;
  mediaHost: string;
  blePereodicDataEndpoint: string;
  region: string;
  pathDocs: PathDocs;
  carbDefaultUnit: string;
  bgUnits: string;
  timeFormat: string;
  timeUnitsDefault: string;
  recordSeparator: string;
  glucoseUnitsDefault: string;
  carbohydrateUnitsDefault: string;
  carbExchangeRatioDefault: number;
  reportDateFormat: ReportDateFormat;
  mfa: Mfa;
  supportedReports?: SupportedReportsEntity[] | null;
  smsSendingAllowed: boolean;
  postal: Postal;
  numberFormat: NumberFormat;
}
export interface LanguagesEntity {
  name: string;
  code: string;
}
export interface PathDocs {
  "ddms.privacyStatementPdf": string;
  "ddms.termsOfUsePdf": string;
  "ddms.faqPdf": string;
  "ddms.analyticsToolNoticePdf": string;
  "ddms.smsNoticePdf": string;
  "ddms.cookieNoticePdf": string;
}
export interface ReportDateFormat {
  longTimePattern12: string;
  longTimePattern24: string;
  shortTimePattern12: string;
  shortTimePattern24: string;
  shortDatePattern: string;
  dateSeparator: string;
  timeSeparator: string;
}
export interface Mfa {
  status: string;
  fromDate: string;
  gracePeriod: number;
  codeValidityDuration: number;
  maxAttempts: number;
  rememberPeriod: number;
}
export interface SupportedReportsEntity {
  report: string;
  onlyFor?: null[] | null;
  notFor?: null[] | null;
}
export interface Postal {
  postalFormat?: string[] | null;
  regExpStr: string;
}
export interface NumberFormat {
  decimalSeparator: string;
  groupsSeparator: string;
}
