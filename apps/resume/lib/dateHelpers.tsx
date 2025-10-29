import { DateTime } from "luxon";

export const FormatDate = (
  date: string,
  format: string = "LLL yyyy",
  locale: string = "en"
) => DateTime.fromISO(date).setLocale(locale).toFormat(format);

export const FormatDates = (
  startDate?: string,
  endDate?: string,
  presentString: string = "Current",
  locale = "en",
  dateFormat = "LLL yyyy"
) => {
  let dates = "";
  if (startDate) {
    dates += FormatDate(startDate, dateFormat, locale) + "\u00A0";
  }
  if (endDate) {
    dates += FormatDate(endDate, dateFormat, locale);
  } else if (startDate) {
    dates += presentString;
  }

  return dates;
};
