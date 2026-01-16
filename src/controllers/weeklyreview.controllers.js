import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { getWeekRange } from "../utils/getWeekRange.js";
import WeekReview from "../models/weeklyreview.models.js";
import { generateWeeklyReviewForUser } from "../services/weeklyreview.service.js";
import { DateTime } from "luxon";

const generateWeeklyReview = asyncHandler(async (req, res) => {
  const now = DateTime.now().setZone(req.user.timezone);
  const lastWeek = now.minus({ weeks: 1 });

  const { start, end } = getWeekRange(req.user.timezone, lastWeek);
  const review = await generateWeeklyReviewForUser({
    userId: req.user._id,
    start,
    end,
  });

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
