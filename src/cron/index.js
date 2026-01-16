import { startFailureCron } from "./failure.cron.js";
import { startWeeklyReviewCron } from "./weeklyReview.cron.js";

export const startCronJobs = () => {
  startFailureCron();
  startWeeklyReviewCron();
};
