import { DateTime } from "luxon";

export const attachTimezone = async (req, res, next) => {
  const timezone = req.headers["x-timezone"];

  if (!timezone) return next();

  const dt = DateTime.now().setZone(timezone);

  if (!dt.isValid) return next();

  if (req.user && req.user.timezone !== timezone) {
    req.user.timezone = timezone;
    await req.user.save();
  }

  next();
};
