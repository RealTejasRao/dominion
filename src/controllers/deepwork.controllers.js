import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { getTodayDate } from "../utils/getTodayDateTime.js";
import Deepwork from "../models/deepwork.models.js";
import { nowTime } from "../utils/getTodayDateTime.js";
import { getWeekRange } from "../utils/getWeekRange.js";

const startDeepwork = asyncHandler(async (req, res) => {
  const today = getTodayDate();

  let deepworkSession;
  try {
    deepworkSession = await Deepwork.create({
      user: req.user._id,
      date: today,
      isActive: true,
      startedAt: nowTime(),
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "Deepwork session is already going on.");
    }
    throw error;
  }

  const responseFields = {
    id: deepworkSession._id,
    date: deepworkSession.date,
    startedAt: deepworkSession.startedAt,
    isActive: deepworkSession.isActive,
  };
  return res
    .status(201)
    .json(new ApiResponse(201, responseFields, "Deepwork session started"));
});

const endDeepwork = asyncHandler(async (req, res) => {
  const endTime = nowTime();
  const today = getTodayDate();

  const stopSession = await Deepwork.findOneAndUpdate(
    {
      user: req.user._id,
      isActive: true,
    },
    [
      {
        $set: {
          isActive: false,
          endedAt: endTime,
          durationMinutes: {
            $round: [
              {
                $divide: [
                  {
                    $subtract: [endTime, "$startedAt"],
                  },
                  60000,
                ],
              },
              0,
            ],
          },
        },
      },
    ],
    { new: true, updatePipeline: true },
  );

  if (!stopSession) {
    throw new ApiError(404, "No active session found.");
  }

  const responseFields = {
    id: stopSession._id,
    createdAt: stopSession.createdAt,
    endedAt: stopSession.endedAt,
    durationMinutes: stopSession.durationMinutes,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, responseFields, "Deepwork session stopped."));
});

const getTodayDeepwork = asyncHandler(async (req, res) => {
  const today = getTodayDate();

  const stats = await Deepwork.aggregate([
    {
      $match: {
        user: req.user._id,
        date: today,
        isActive: false,
      },
    },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        totalMinutes: { $sum: "$durationMinutes" },
        interruptedSessions: {
          $sum: {
            $cond: [{ $eq: ["$interrupted", true] }, 1, 0],
          },
        },
      },
    },
  ]);

  const result = stats[0] || {
    totalSessions: 0,
    totalMinutes: 0,
    interruptedSessions: 0,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Today's deepwork summary"));
});



const getWeeklyDeepworkSummary = asyncHandler(async (req, res) => {
  const { start, end } = getWeekRange();

  const stats = await Deepwork.aggregate([
    {
      $match: {
        user: req.user._id,
        isActive: false,
        date: { $gte: start, $lt: end },
      },
    },
    {
      $group: {
        _id: "$date",
        dailyMinutes: { $sum: "$durationMinutes" },
        dailySessions: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        totalMinutes: { $sum: "$dailyMinutes" },
        totalSessions: { $sum: "$dailySessions" },
        days: {
          $push: {
            date: "$_id",
            minutes: "$dailyMinutes",
          },
        },
      },
    },
  ]);

  if (!stats.length) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalMinutes: 0,
          totalSessions: 0,
          averagePerDay: 0,
          bestDay: null,
        },
        "Weekly deepwork summary",
      ),
    );
  }

  const data = stats[0];

  const bestDay = data.days.reduce((a, b) => (a.minutes > b.minutes ? a : b));

  const averagePerDay = Math.round(data.totalMinutes / 7);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalMinutes: data.totalMinutes,
        totalSessions: data.totalSessions,
        averagePerDay,
        bestDay,
      },
      "Weekly deepwork summary",
    ),
  );
});





export { startDeepwork, endDeepwork, getTodayDeepwork, getWeeklyDeepworkSummary };
