import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addGoal } from "../controllers/goals.controllers.js";
import { userCreateGoalValidator } from "../validators/index.js";

const router = Router();

router
  .route("/")
  .post(verifyJWT, ...userCreateGoalValidator(), validate, addGoal);

export default router;
