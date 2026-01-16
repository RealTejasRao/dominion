import cron from "node-cron";
import User from "../models/users.models.js";
import { getYesterdayDate } from "../utils/getTodayDateTime.js";
import { markDayAsFailedForUser } from "../services/failure.service.js";

export const startFailureCron = () => {
  cron.schedule(
    "*/10 * * * *", // every 10 minutes
    async () => {
      console.log("[CRON] Daily failure evaluation started");

      try {
        const users = await User.find({}, { _id: 1, timezone: 1 }).lean();

        for (const user of users) {
          try {
            const yesterday = getYesterdayDate(user.timezone);

            await markDayAsFailedForUser({
              userId: user._id,
              date: yesterday,
            });
          } catch (error) {
            if (error.statusCode !== 409) {
              console.error(
                `[CRON] Error in marking failure for user ${user._id}`,
                error,
              );
            }
          }
        }

        console.log("[CRON] Daily failure evaluation completed");
      } catch (error) {
        console.error("[CRON] Failure cron crashed", error);
      }
    },
    {
      timezone: "UTC",
    },
  );
};
