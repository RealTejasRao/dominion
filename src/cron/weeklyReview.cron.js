import User from "../models/users.models.js";
import { DateTime } from "luxon";
import { getWeekRange } from "../utils/getWeekRange.js";
import { generateWeeklyReviewForUser } from "../services/weeklyreview.service.js";
import cron from "node-cron";

export const runWeeklyReviewJob = async () => {
  console.log("[CRON] Weekly review job started");

  const users = await User.find({}, { _id: 1, timezone: 1 }).lean();

  for (const user of users) {
    try {
      const now = DateTime.now().setZone(user.timezone);

      if (!now.isValid) continue;

      // (Monday)
      // console.log(
      //   `[CRON] DEBUG user=${user._id} weekday=${now.weekday} timezone=${user.timezone}`,
      // );

      if (now.weekday !== 1) continue;

      const lastWeek = now.minus({ weeks: 1 });
      const { start, end } = getWeekRange(user.timezone, lastWeek);
      // console.log(
      //   `[CRON] Debug Processing user ${user._id} for week ${start} to ${end}`,
      // );

      await generateWeeklyReviewForUser({
        userId: user._id,
        start,
        end,
      });
    } catch (error) {
      if (error.statusCode !== 409) {
        console.error(`[CRON] Weekly review error for user ${user._id}`, error);
      }
    }
  }

  console.log("[CRON] Weekly review job completed");
};

export const startWeeklyReviewCron = () => {
  cron.schedule("0 */6 * * *", runWeeklyReviewJob, { timezone: "UTC" });
};
