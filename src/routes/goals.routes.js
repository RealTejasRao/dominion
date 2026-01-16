import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";
import { addGoal } from "../controllers/goals.controllers.js";
import { userCreateUpdateGoalValidator } from "../validators/index.js";
import { getTodayGoals } from "../controllers/goals.controllers.js";
import { completeGoal } from "../controllers/goals.controllers.js";
import { deleteGoal } from "../controllers/goals.controllers.js";
import { updateGoal } from "../controllers/goals.controllers.js";

const router = Router();

router
  .route("/")
  .post(...userCreateUpdateGoalValidator(), validate, addGoal);

router.route("/").get(getTodayGoals);

router.route("/:id/complete").patch(completeGoal);
router.route("/:id").delete(deleteGoal);
router.route("/:id").patch(...userCreateUpdateGoalValidator(), validate, updateGoal)

export default router;
