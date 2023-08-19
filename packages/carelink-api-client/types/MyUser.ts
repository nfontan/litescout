export interface MyUser {
  loginDateUTC: string;
  id: string;
  country: string;
  language: string;
  lastName: string;
  firstName: string;
  accountId: number;
  role: string;
  cpRegistrationStatus: string;
  accountSuspended: boolean;
  needToReconsent: boolean;
  mfaRequired: boolean;
  mfaEnabled: boolean;
}
