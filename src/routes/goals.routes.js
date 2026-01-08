import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addGoal } from "../controllers/goals.controllers.js";
import { userCreateGoalValidator } from "../validators/index.js";
import { getTodayGoals } from "../controllers/goals.controllers.js";
import { completeGoal } from "../controllers/goals.controllers.js";

const router = Router();

router
  .route("/")
  .post(verifyJWT, ...userCreateGoalValidator(), validate, addGoal);

router.route("/").get(verifyJWT, getTodayGoals);

router.route("/:id/complete").patch(verifyJWT, completeGoal);

export default router;
