import { Router } from "express";
import { markDayAsFailed } from "../controllers/failure.controllers.js";
import { getWeeklyFailures } from "../controllers/failure.controllers.js";
import { getFailureHistory } from "../controllers/failure.controllers.js";

const router = Router();

router.route("/mark-failure").post(markDayAsFailed);
router.route("/weekly").get(getWeeklyFailures);
router.route("/history").get(getFailureHistory);

export default router;