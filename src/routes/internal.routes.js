import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { runWeeklyReviewJob } from "../cron/weeklyReview.cron.js";
import { ApiError } from "../utils/api-error.js";

const router = Router();

router.post(
  "/run-weekly-review",
  asyncHandler(async (req, res) => {
    if (process.env.NODE_ENV !== "development") {
      throw new ApiError(403, "Not available");
    }
    await runWeeklyReviewJob();
    res.status(200).json({
      success: true,
      message: "Weekly review job executed",
    });
  }),
);

export default router;
