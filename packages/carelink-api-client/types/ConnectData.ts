// generated using an sample response
// pnpm dlx maketypes -i ConnectData.ts example-response.json ConnectData
export interface ConnectData {
  lastSensorTS: number;
  medicalDeviceTimeAsString: string;
  lastSensorTSAsString: string;
  kind: string;
  version: number;
  pumpModelNumber: string;
  currentServerTime: number;
  lastConduitTime: number;
  lastConduitUpdateServerTime: number;
  lastMedicalDeviceDataUpdateServerTime: number;
  firstName: string;
  lastName: string;
  conduitSerialNumber: string;
  conduitBatteryLevel: number;
  conduitBatteryStatus: string;
  conduitInRange: boolean;
  conduitMedicalDeviceInRange: boolean;
  conduitSensorInRange: boolean;
  medicalDeviceFamily: string;
  sensorState: string;
  medicalDeviceSerialNumber: string;
  medicalDeviceTime: number;
  sMedicalDeviceTime: string;
  reservoirLevelPercent: number;
  reservoirAmount: number;
  reservoirRemainingUnits: number;
  medicalDeviceBatteryLevelPercent: number;
  sensorDurationHours: number;
  timeToNextCalibHours: number;
  calibStatus: string;
  bgUnits: string;
  timeFormat: string;
  lastSensorTime: number;
  sLastSensorTime: string;
  medicalDeviceSuspended: boolean;
  lastSGTrend: string;
  lastSG: SgsEntityOrLastSG;
  lastAlarm: LastAlarm;
  activeInsulin: ActiveInsulin;
  sgs?: SgsEntityOrLastSG[] | null;
  limits?: LimitsEntity[] | null;
  markers?: MarkersEntity[] | null;
  notificationHistory: NotificationHistory;
  therapyAlgorithmState: TherapyAlgorithmState;
  pumpBannerState?: null[] | null;
  basal: Basal;
  systemStatusMessage: string;
  averageSG: number;
  belowHypoLimit: number;
  aboveHyperLimit: number;
  timeInRange: number;
  pumpCommunicationState: boolean;
  gstCommunicationState: boolean;
  gstBatteryLevel: number;
  lastConduitDateTime: string;
  maxAutoBasalRate: number;
  maxBolusAmount: number;
  sensorDurationMinutes: number;
  timeToNextCalibrationMinutes: number;
  clientTimeZoneName: string;
  sgBelowLimit: number;
  averageSGFloat: number;
  calFreeSensor: boolean;
  finalCalibration: boolean;
  appModelType: string;
  medicalDeviceInformation: MedicalDeviceInformation;
  typeCast: boolean;
}
export interface SgsEntityOrLastSG {
  sg: number;
  datetime: string;
  timeChange: boolean;
  sensorState: string;
  kind: string;
  version: number;
  relativeOffset: number;
}
export interface LastAlarm {
  code: number;
  datetime: string;
  type: string;
  flash: boolean;
  instanceId: number;
  messageId: string;
  pumpDeliverySuspendState: boolean;
  referenceGUID: string;
  relativeOffset: number;
  calibrationType: number;
  pnpId: string;
  alertSilenced: boolean;
  kind: string;
  version: number;
}
export interface ActiveInsulin {
  amount: number;
  datetime: string;
  precision: string;
  kind: string;
  version: number;
}
export interface LimitsEntity {
  index: number;
  highLimit: number;
  lowLimit: number;
  kind: string;
  version: number;
}
export interface MarkersEntity {
  type: string;
  index: number;
  value?: number | null;
  kind: string;
  version: number;
  dateTime: string;
  relativeOffset: number;
  calibrationSuccess?: boolean | null;
  amount?: number | null;
  programmedExtendedAmount?: number | null;
  activationType?: string | null;
  deliveredExtendedAmount?: number | null;
  programmedFastAmount?: number | null;
  programmedDuration?: number | null;
  deliveredFastAmount?: number | null;
  id?: number | null;
  effectiveDuration?: number | null;
  completed?: boolean | null;
  bolusType?: string | null;
  bolusAmount?: number | null;
  autoModeOn?: boolean | null;
  deliverySuspended?: boolean | null;
}
export interface NotificationHistory {
  activeNotifications?: null[] | null;
  clearedNotifications?: ClearedNotificationsEntity[] | null;
}
export interface ClearedNotificationsEntity {
  referenceGUID: string;
  dateTime: string;
  type: string;
  faultId: number;
  instanceId: number;
  messageId: string;
  unitsRemaining?: number | null;
  pumpDeliverySuspendState: boolean;
  relativeOffset: number;
  alertSilenced: boolean;
  triggeredDateTime: string;
  secondaryTime?: string | null;
  pnpId?: string | null;
  calibrationType?: number | null;
}
export interface TherapyAlgorithmState {
  autoModeShieldState: string;
  autoModeReadinessState: string;
  plgmLgsState: string;
  safeBasalDuration: number;
  waitToCalibrateDuration: number;
}
export interface Basal {
  activeBasalPattern: string;
  basalRate: number;
}
export interface MedicalDeviceInformation {
  manufacturer: string;
  modelNumber: string;
  hardwareRevision: string;
  firmwareRevision: string;
  systemId: string;
  pnpId: string;
}
