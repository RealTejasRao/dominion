import { Router } from "express";
import { startDeepwork } from "../controllers/deepwork.controllers.js";
import { endDeepwork } from "../controllers/deepwork.controllers.js";
import { getTodayDeepwork } from "../controllers/deepwork.controllers.js";
import { getWeeklyDeepworkSummary } from "../controllers/deepwork.controllers.js";

const router = Router();

router.route("/start").post(startDeepwork);
router.route("/stop").patch(endDeepwork);
router.route("/today").get(getTodayDeepwork);
router.route("/week").get(getWeeklyDeepworkSummary);

export default router;
