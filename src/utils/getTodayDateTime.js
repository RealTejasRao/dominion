import { DateTime } from "luxon";
import { ApiError } from "./api-error.js";

export const getTodayDate = (timezone) => {
  const dt = DateTime.now().setZone(timezone);

  if (!dt.isValid) {
    throw new ApiError(400, "Invalid timezone");
  }

  return dt.toISODate();
};

export const getYesterdayDate = (timezone) => {
  const dt = DateTime.now().setZone(timezone);

  if (!dt.isValid) {
    throw new ApiError(400, "Invalid timezone");
  }

  return dt.minus({ days: 1 }).toISODate(); // YYYY-MM-DD
};

export const nowTime = () => {
  return new Date();
};
