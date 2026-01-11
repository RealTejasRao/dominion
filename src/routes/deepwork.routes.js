import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { startDeepwork } from "../controllers/deepwork.controllers.js";
import { endDeepwork } from "../controllers/deepwork.controllers.js";
import { getTodayDeepwork } from "../controllers/deepwork.controllers.js";
import { getWeeklyDeepworkSummary } from "../controllers/deepwork.controllers.js";

const router = Router();

router.route("/start").post(verifyJWT, startDeepwork);
router.route("/stop").patch(verifyJWT, endDeepwork);
router.route("/today").get(verifyJWT, getTodayDeepwork);
router.route("/week").get(verifyJWT, getWeeklyDeepworkSummary);

export default router;
