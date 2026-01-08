import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { getTodayDate } from "../utils/getTodayDate.js";
import Goal from "../models/goals.models.js";

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
  session.startTransaction();

  try {
    const count = await Goal.countDocuments(
      {
        user: req.user._id,
        date: today,
      },
      { session },
    );

    if (count >= 5) {
      throw new ApiError(400, "Only 5 goals are allowed per day.");
    }

    const existedGoal = await Goal.findOne(
      {
        user: req.user._id,
        date: today,
        title: title.trim(),
      },
      null,
      { session },
    );

    if (existedGoal) {
      throw new ApiError(409, "This goal already exists.");
    }

    const goal = await Goal.create(
      [
        {
          user: req.user._id,
          title: title.trim(),
          date: today,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    return res
      .status(201)
      .json(new ApiResponse(201, goal[0], "Goal added successfully."));
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
});

const getTodayGoals = asyncHandler(async (req, res) => {
  const today = getTodayDate();

  const goals = await Goal.find({
    user: req.user._id,
    date: today,
  }).sort({ createdAt: 1 });

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

  const goalToComplete = await Goal.findOne({
    _id: goalID,
    user: req.user._id,
    date: today,
  });

  if (!goalToComplete) {
    throw new ApiError(404, "This goal does not exists / Cannot be modified.");
  }

  const updatedGoal = await Goal.findOneAndUpdate(
    {
      _id: goalID,
      user: req.user._id,
      date: today,
    },

    {
      $set: {
        completed: !goalToComplete.completed,
      },
    },

    { new: true },
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

export { addGoal, getTodayGoals, completeGoal, deleteGoal };
