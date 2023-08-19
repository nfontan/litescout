import { ConnectData } from "carelink-fetcher";
import logger from "./logger.js";
import { InsertDeviceStatus, InsertEntry } from "./db/schema.js";

const STALE_DATA_THRESHOLD_MINUTES = 20;
const SENSOR_GLUCOSE_ENTRY_TYPE = "sgv";
const CARELINK_TREND_TO_NIGHTSCOUT_TREND = {
  NONE: {
    trend: 0,
    direction: "NONE",
  },
  UP_TRIPLE: {
    trend: 1,
    direction: "TripleUp",
  },
  UP_DOUBLE: {
    trend: 1,
    direction: "DoubleUp",
  },
  UP: {
    trend: 2,
    direction: "SingleUp",
  },
  DOWN: {
    trend: 6,
    direction: "SingleDown",
  },
  DOWN_DOUBLE: {
    trend: 7,
    direction: "DoubleDown",
  },
  DOWN_TRIPLE: {
    trend: 7,
    direction: "TripleDown",
  },
};

function parsePumpTime(
  pumpTimeString: string,
  offset: string,
  medicalDeviceFamily: string
) {
  // TODO: check this condition
  // if (
  //   process.env["MMCONNECT_SERVER"] === "EU" ||
  //   medicalDeviceFamily === "GUARDIAN"
  // ) {
  //   return Date.parse(pumpTimeString);
  // } else {
  //   return Date.parse(pumpTimeString + " " + offset);
  // }
  // logger.debug(
  //   { offset, medicalDeviceFamily, pumpTimeString },
  //   "parsePumpTime"
  // );
  return Date.parse(pumpTimeString.replace("Z", ""));
}

function timestampAsString(timestamp: number) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    logger.error("timestamp is not valid: %s", timestamp);
  }
  return date.toISOString();
}

function deviceName(data: ConnectData) {
  return `connect-${data["medicalDeviceFamily"].toLowerCase()}`;
}

const guessPumpOffset = (function () {
  let lastGuess = "";
  // From my observations, sMedicalDeviceTime is advanced by the server even when the app is
  // not reporting data or the pump is not connected, so its difference from server time is
  // always close to a whole number of hours, and can be used to guess the pump's timezone:
  // https://gist.github.com/mddub/f673570e6427c93784bf
  return function (data: ConnectData) {
    const pumpTimeAsIfUTC = Date.parse(data["sMedicalDeviceTime"]);
    const serverTimeUTC = data["currentServerTime"];
    const hours = Math.round(
      (pumpTimeAsIfUTC - serverTimeUTC) / (60 * 60 * 1000)
    );
    logger.debug(
      {
        pumpTimeAsIfUTC,
        sMedicalDeviceTime: data["sMedicalDeviceTime"],
        currentServerTime: data["currentServerTime"],
        hours,
      },
      "Guess offset: %d hours",
      hours
    );
    const offset =
      (hours >= 0 ? "+" : "-") + (hours * 100).toFixed(2).padStart(5, "0");
    if (offset !== lastGuess) {
      logger.debug(
        'Guessed pump timezone %s (pump time: "%s"; server time: %s)',
        offset,
        data["sMedicalDeviceTime"],
        new Date(data["currentServerTime"]).toString()
      );
    }
    lastGuess = offset;
    return offset;
  };
})();

function deviceStatusEntry(
  data: ConnectData,
  offset: string
): InsertDeviceStatus {
  if (data["medicalDeviceFamily"] === "GUARDIAN") {
    return {
      createdAt: new Date(data["lastMedicalDeviceDataUpdateServerTime"]),
      device: deviceName(data),
      uploaderBattery: data["medicalDeviceBatteryLevelPercent"],
      connect: JSON.stringify({
        sensorState: data["sensorState"],
        calibStatus: data["calibStatus"],
        sensorDurationHours: data["sensorDurationHours"],
        timeToNextCalibHours: data["timeToNextCalibHours"],
        conduitInRange: data["conduitInRange"],
        conduitMedicalDeviceInRange: data["conduitMedicalDeviceInRange"],
        conduitSensorInRange: data["conduitSensorInRange"],
        medicalDeviceBatteryLevelPercent:
          data["medicalDeviceBatteryLevelPercent"],
        medicalDeviceFamily: data["medicalDeviceFamily"],
      }),
    };
  } else {
    return {
      createdAt: new Date(data["lastMedicalDeviceDataUpdateServerTime"]),
      device: deviceName(data),
      uploaderBattery: data["conduitBatteryLevel"],
      pump: JSON.stringify({
        battery: {
          percent: data["medicalDeviceBatteryLevelPercent"],
        },
        reservoir: data["reservoirRemainingUnits"],
        iob: {
          timestamp: timestampAsString(
            data["lastMedicalDeviceDataUpdateServerTime"]
          ),
          bolusiob:
            data?.activeInsulin?.amount >= 0
              ? data.activeInsulin.amount
              : undefined,
        },
        // clock: data["sMedicalDeviceTime"],
        clock: timestampAsString(
          parsePumpTime(
            data["sMedicalDeviceTime"],
            offset,
            data["medicalDeviceFamily"]
          )
        ),
        // TODO: add last alarm from data['lastAlarm']['code'] and data['lastAlarm']['datetime']
        // https://gist.github.com/mddub/a95dc120d9d1414a433d#file-minimed-connect-codes-js-L79
      }),
      connect: JSON.stringify({
        // For the values these can take, see:
        // https://gist.github.com/mddub/5e4a585508c93249eb51
        sensorState: data["sensorState"],
        calibStatus: data["calibStatus"],
        sensorDurationHours: data["sensorDurationHours"],
        timeToNextCalibHours: data["timeToNextCalibHours"],
        conduitInRange: data["conduitInRange"],
        conduitMedicalDeviceInRange: data["conduitMedicalDeviceInRange"],
        conduitSensorInRange: data["conduitSensorInRange"],
      }),
    };
  }
}

function sgvEntries(data: ConnectData, offset: string): InsertEntry[] {
  if (!data["sgs"] || !data["sgs"].length) {
    return [];
  }

  const sgvs = data["sgs"]
    .filter(function (entry) {
      return entry["kind"] === "SG" && entry["sg"] !== 0;
    })
    .map(function (sgv) {
      // const timestamp = sgv["datetime"];
      const timestamp = parsePumpTime(
        sgv["datetime"],
        offset,
        data["medicalDeviceFamily"]
      );
      return {
        type: SENSOR_GLUCOSE_ENTRY_TYPE,
        sgv: sgv["sg"],
        date: new Date(timestamp),
        sysDate: new Date(timestamp),
        device: deviceName(data),
        utcOffset: parseFloat(offset) || 0,
      };
    });

  if (data.sgs && data.sgs.length > 0 && data.sgs.at(-1)?.sg !== 0) {
    logger.debug(
      {
        lastSGTrend: data["lastSGTrend"],
        trend:
          CARELINK_TREND_TO_NIGHTSCOUT_TREND[
            data[
              "lastSGTrend"
            ] as keyof typeof CARELINK_TREND_TO_NIGHTSCOUT_TREND
          ],
      },
      "Setting last trend"
    );
    sgvs[sgvs.length - 1] = {
      ...sgvs[sgvs.length - 1],
      ...CARELINK_TREND_TO_NIGHTSCOUT_TREND[
        data["lastSGTrend"] as keyof typeof CARELINK_TREND_TO_NIGHTSCOUT_TREND
      ],
    };
  }

  return sgvs;
}

export default function (data: ConnectData, sgvLimit: number) {
  const recency =
    (data["currentServerTime"] -
      data["lastMedicalDeviceDataUpdateServerTime"]) /
    (60 * 1000);
  if (recency > STALE_DATA_THRESHOLD_MINUTES) {
    logger.debug("Stale CareLink data: %s minutes old", recency.toFixed(2));
    return {
      devicestatus: [],
      entries: [],
    };
  }

  const offset = guessPumpOffset(data);
  if (sgvLimit === undefined) {
    sgvLimit = Infinity;
  }
  return {
    // XXX: lower-case and singular for consistency with cgm-remote-monitor collection name
    devicestatus: [deviceStatusEntry(data, offset)],
    entries: sgvEntries(data, offset).reverse().slice(0, sgvLimit),
  };
}
