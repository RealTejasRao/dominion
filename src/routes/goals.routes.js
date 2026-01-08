import { Router } from "express";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addGoal } from "../controllers/goals.controllers.js";
import { userCreateUpdateGoalValidator } from "../validators/index.js";
import { getTodayGoals } from "../controllers/goals.controllers.js";
import { completeGoal } from "../controllers/goals.controllers.js";
import { deleteGoal } from "../controllers/goals.controllers.js";
import { updateGoal } from "../controllers/goals.controllers.js";

const router = Router();

router
  .route("/")
  .post(verifyJWT, ...userCreateUpdateGoalValidator(), validate, addGoal);

router.route("/").get(verifyJWT, getTodayGoals);

router.route("/:id/complete").patch(verifyJWT, completeGoal);
router.route("/:id").delete(verifyJWT, deleteGoal);
router.route("/:id").patch(verifyJWT, ...userCreateUpdateGoalValidator(), validate, updateGoal)

export default router;
