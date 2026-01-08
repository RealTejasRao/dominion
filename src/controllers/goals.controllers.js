import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import Goal from "../models/goals.models.js";

const addGoal = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title || title.trim().length < 3) {
    throw new ApiError(
      400,
      "Goal title must be atleast three characters long.",
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  const count = await Goal.countDocuments({
    user: req.user._id,
    date: today,
  });

  if (count >= 5) {
    throw new ApiError(400, "Only 5 goals are allowed per day.");
  }

  const existedGoal = await Goal.findOne({
    user: req.user._id,
    date: today,
    title: title.trim(),
  });

  if (existedGoal) {
    throw new ApiError(409, "This goal already exists.");
  }

  const goal = await Goal.create({
    user: req.user._id,
    title: title.trim(),
    date: today,
  });

  const createdGoal = await Goal.findById(goal._id);

  if (!createdGoal) {
    throw new ApiError(500, "Something went wrong while creating a new goal.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, goal, "Goal added successfully."));
});

export { addGoal };
