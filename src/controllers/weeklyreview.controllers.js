import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { getWeekRange } from "../utils/getWeekRange.js";
import WeekReview from "../models/weeklyreview.models.js";
import Goal from "../models/goals.models.js";
import Deepwork from "../models/deepwork.models.js";
import Failure from "../models/failure.models.js";

const generateWeeklyReview = asyncHandler(async (req, res) => {
  const { start, end } = getWeekRange();

  const goalsCompleted = await Goal.countDocuments({
    user: req.user._id,
    completed: true,
    date: { $gte: start, $lt: end },
  });

  const deepwork = await Deepwork.aggregate([
    {
      $match: {
        user: req.user._id,
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

  const failureCount = await Failure.countDocuments({
    user: req.user._id,
    date: { $gte: start, $lt: end },
  });

  const review = await WeekReview.findOneAndUpdate(
    { user: req.user._id, weekStartDate: start },
    {
      goalsCompleted,
      deepworkMinutes: deepwork[0]?.total || 0,
      failureCount,
      summary: `Completed ${goalsCompleted} goals, ${deepwork[0]?.total || 0} minutes deepwork, ${failureCount} failed days.`,
    },
    { upsert: true, new: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Weekly review generated."));
});

const getWeeklyReview = asyncHandler(async (req, res) => {
  const { weekStartDate } = req.params;

  const review = await WeekReview.findOne({
    user: req.user._id,
    weekStartDate,
  });

  if (!review) {
    throw new ApiError(404, "No review for this week.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Weekly review fetched."));
});

const getWeeklyHistory = asyncHandler(async (req, res) => {
  const reviews = await WeekReview.find({ user: req.user._id })
    .sort({ weekStartDate: -1 })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, reviews, "Weekly history fetched."));
});

export { generateWeeklyReview, getWeeklyReview, getWeeklyHistory };
