import WeekReview from "../models/weeklyreview.models.js";
import Goal from "../models/goals.models.js";
import Deepwork from "../models/deepwork.models.js";
import Failure from "../models/failure.models.js";
import { ApiError } from "../utils/api-error.js";

export const generateWeeklyReviewForUser = async ({ userId, start, end }) => {
  const existing = await WeekReview.findOne({
    user: userId,
    weekStartDate: start,
  });

  if (existing) {
    throw new ApiError(409, "Weekly review already generated.");
  }

  const goalsCompleted = await Goal.countDocuments({
    user: userId,
    completed: true,
    date: { $gte: start, $lt: end },
  });

  const deepwork = await Deepwork.aggregate([
    {
      $match: {
        user: userId,
        isActive: false,
        date: { $gte: start, $lt: end },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$durationMinutes" },
      },
    },
  ]);

  const deepworkMinutes = deepwork[0]?.total || 0;

  const failureCount = await Failure.countDocuments({
    user: userId,
    date: { $gte: start, $lt: end },
  });

  const review = await WeekReview.create({
    user: userId,
    weekStartDate: start,
    weekEndDate: end,
    goalsCompleted,
    deepworkMinutes,
    failureCount,
    summary: `Completed ${goalsCompleted} goals, ${deepworkMinutes} minutes deepwork, ${failureCount} failed days.`,
  });

  return review;
};
