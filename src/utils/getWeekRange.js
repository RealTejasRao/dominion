import { DateTime } from "luxon";
import { ApiError } from "./api-error.js";

export const getWeekRange = (timezone, baseDate = null) => {
  const now = baseDate
    ? baseDate.setZone(timezone)
    : DateTime.now().setZone(timezone);

  if (!now.isValid) {
    throw new ApiError(400, "Invalid timezone");
  }

  const weekStart = now.startOf("week");
  const weekEnd = weekStart.plus({ days: 7 });

  return {
    start: weekStart.toISODate(),
    end: weekEnd.toISODate(),
  };
};
