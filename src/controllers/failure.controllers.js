import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { getTodayDate } from "../utils/getTodayDateTime.js";
import Failure from "../models/failure.models.js";
import Goal from "../models/goals.models.js";
import Deepwork from "../models/deepwork.models.js";

const markDayAsFailed = asyncHandler(async (req, res) => {
  const today = getTodayDate();

  const session = await Failure.startSession();

  try {
    session.startTransaction();
    const check = await Failure.findOne(
      {
        user: req.user._id,
        date: today,
      },
      null,
      { session },
    );

    if (check) {
      throw new ApiError(409, "Day Already marked as failed.");
    }

    const goals = await Goal.find(
      { user: req.user._id, date: today },
      { completed: 1 },
      { session },
    );

    const totalGoals = goals.length;
    const completedGoals = goals.filter((g) => g.completed === true).length;

    const completionRatio = totalGoals === 0 ? 0 : completedGoals / totalGoals;

    const deepworkMinutes = await Deepwork.aggregate([
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
          totalMinutes: { $sum: "$durationMinutes" },
        },
      },
    ]).session(session);

    const totalMinutes = deepworkMinutes[0]?.totalMinutes || 0;

    const shouldFail = completionRatio < 0.5 && totalMinutes === 0;

    if (!shouldFail) {
      throw new ApiError(409, "Day does not meet failure conditions.");
    }

    const [failure] = await Failure.create(
      [
        {
          user: req.user._id,
          date: today,
          reason: `Completed ${completedGoals}/${totalGoals} goals and ${totalMinutes} minutes deepwork.`,
        },
      ],
      { session },
    );

    await session.commitTransaction();

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
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export { markDayAsFailed };
