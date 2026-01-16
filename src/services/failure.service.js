import Failure from "../models/failure.models.js";
import Goal from "../models/goals.models.js";
import Deepwork from "../models/deepwork.models.js";
import { ApiError } from "../utils/api-error.js";

const markDayAsFailedForUser = async ({ userId, date }) => {
  const session = await Failure.startSession();

  try {
    session.startTransaction();

    const check = await Failure.findOne(
      {
        user: userId,
        date,
      },
      null,
      {
        session,
      },
    );

    if (check) {
      throw new ApiError(409, "Day already marked as failed.");
    }

    const goals = await Goal.find(
      { user: userId, date },
      { completed: 1 },
      { session },
    );

    const totalGoals = goals.length;
    const completedGoals = goals.filter((g) => g.completed === true).length;

    const completionRatio = totalGoals === 0 ? 0 : completedGoals / totalGoals;

    const deepworkAgg = await Deepwork.aggregate([
      {
        $match: {
          user: userId,
          date,
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

    const totalMinutes = deepworkAgg[0]?.totalMinutes || 0;

    const shouldFail = completionRatio < 0.5 && totalMinutes < 30;

    if (!shouldFail) {
      throw new ApiError(409, "Day does not meet failure conditions.");
    }

    const [failure] = await Failure.create(
      [
        {
          user: userId,
          date,
          reason: `Completed ${completedGoals}/${totalGoals} goals and ${totalMinutes} minutes deepwork.`,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    return failure;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export { markDayAsFailedForUser };
