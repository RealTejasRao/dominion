import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { getTodayDate } from "../utils/getTodayDateTime.js";
import Failure from "../models/failure.models.js";
import { getWeekRange } from "../utils/getWeekRange.js";
import { markDayAsFailedForUser } from "../services/failure.service.js";

const markDayAsFailed = asyncHandler(async (req, res) => {
  const today = getTodayDate(req.user.timezone);

  const failure = await markDayAsFailedForUser({
    userId: req.user._id,
    date: today,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        id: failure._id,
        date: failure.date,
        reason: failure.reason,
      },
      "Day marked as failed.",
    ),
  );
});

const getWeeklyFailures = asyncHandler(async (req, res) => {
  const { start, end } = getWeekRange(req.user.timezone);

  const failures = await Failure.find({
    user: req.user._id,
    date: { $gte: start, $lte: end },
  })
    .sort({ date: 1 })
    .lean();

  const response = failures.map((i) => ({
    id: i._id,
    date: i.date,
    reason: i.reason,
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalFailures: response.length,
        failures: response,
        weekRange: { start, end },
      },
      "Weekly failures fetched successfully.",
    ),
  );
});

const getFailureHistory = asyncHandler(async (req, res) => {
  const failures = await Failure.find({ user: req.user._id })
    .sort({ date: -1 })
    .lean();

  const response = failures.map((f) => ({
    id: f._id,
    date: f.date,
    reason: f.reason,
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalFailures: response.length,
        failures: response,
      },
      "Failure history fetched successfully.",
    ),
  );
});

export { markDayAsFailed, getWeeklyFailures, getFailureHistory };
