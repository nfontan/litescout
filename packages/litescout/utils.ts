import config from "./config.js";

export function minutesAgo(date: Date, compareTo?: Date) {
  const relativeFormat = new Intl.RelativeTimeFormat(config.language || "es", {
    numeric: "auto",
  });
  const minutesDiff = Math.round(
    (date.getTime() - (compareTo || new Date()).getTime()) / 60 / 1000
  );
  return relativeFormat.format(minutesDiff, "minutes");
}
