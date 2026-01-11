import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { getTodayDate } from "../utils/getTodayDateTime.js";
import Goal from "../models/goals.models.js";
import DailyCounter from "../models/dailycounters.models.js";

const addGoal = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title || title.trim().length < 3) {
    throw new ApiError(
      400,
      "Goal title must be atleast three characters long.",
    );
  }

  const today = getTodayDate();

  const session = await Goal.startSession();

  try {
    session.startTransaction();
    const count = await DailyCounter.findOneAndUpdate(
      {
        user: req.user._id,
        date: today,
        goalCount: { $lt: 5 },
      },
      { $inc: { goalCount: 1 } },
      { new: true, upsert: true, session },
    );

    if (!count) {
      throw new ApiError(400, "Max 5 goals are allowed.");
    }

    let goal;
    try {
      [goal] = await Goal.create(
        [
          {
            user: req.user._id,
            title: title.trim(),
            date: today,
          },
        ],
        { session },
      );
    } catch (err) {
      if (err.code === 11000) {
        await DailyCounter.updateOne(
          { user: req.user._id, date: today },
          { $inc: { goalCount: -1 } },
          { session },
        );
        throw new ApiError(409, "Goal already exists.");
      }
      throw err;
    }

    await session.commitTransaction();

    return res
      .status(201)
      .json(new ApiResponse(201, goal, "Goal added successfully."));
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
});

const getTodayGoals = asyncHandler(async (req, res) => {
  const today = getTodayDate();

  const goals = await Goal.find(
    {
      user: req.user._id,
      date: today,
    },
    { title: 1, completed: 1, date: 1, createdAt: 1, updatedAt: 1 },
  )
    .sort({ createdAt: 1 })
    .lean();

  const responseGoals = goals.map((g) => ({
    id: g._id,
    title: g.title,
    completed: g.completed,
    date: g.date,
    createdAt: g.createdAt,
    updatedAt: g.updatedAt,
  }));
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { goals: responseGoals },
        "Today's goals listed successfully.",
      ),
    );
});

const completeGoal = asyncHandler(async (req, res) => {
  const today = getTodayDate();

  const { id: goalID } = req.params;

  const updatedGoal = await Goal.findOneAndUpdate(
    {
      _id: goalID,
      user: req.user._id,
      date: today,
    },

    [
      {
        $set: {
          completed: { $not: "$completed" },
        },
      },
    ],

    { new: true, updatePipeline: true },
  );

  if (!updatedGoal) {
    throw new ApiError(404, "Goal update has failed.");
  }

  const responseGoals = {
    id: updatedGoal._id,
    completed: updatedGoal.completed,
    date: updatedGoal.date,
    createdAt: updatedGoal.createdAt,
    updatedAt: updatedGoal.updatedAt,
  };
  return res
    .status(200)
    .json(new ApiResponse(200, responseGoals, "Updated Successfully"));
});

const deleteGoal = asyncHandler(async (req, res) => {
  const today = getTodayDate();

  const { id: goalID } = req.params;

  const goalToDelete = await Goal.findOneAndDelete({
    _id: goalID,
    user: req.user._id,
    date: today,
  });

  if (!goalToDelete) {
    throw new ApiError(404, "Goal was not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { id: goalToDelete._id }, "Deleted Successfully"),
    );
});

const updateGoal = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const { id: goalID } = req.params;
  const today = getTodayDate();

  if (!title || title.trim().length < 3) {
    throw new ApiError(400, "Goal title must be at least 3 characters long.");
  }

  let updatedGoal;

  try {
    updatedGoal = await Goal.findOneAndUpdate(
      { _id: goalID, user: req.user._id, date: today },
      { $set: { title: title.trim() } },
      { new: true, runValidators: true },
    );
  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(409, "Goal cannot be found or cannot be edited.");
    }
    throw err;
  }

  if (!updatedGoal) {
    throw new ApiError(404, "Goal not found or cannot be edited.");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        id: updatedGoal._id,
        title: updatedGoal.title,
      },
      "Goal updated successfully.",
    ),
  );
});

export { addGoal, getTodayGoals, completeGoal, deleteGoal, updateGoal };
