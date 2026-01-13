import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { markDayAsFailed } from "../controllers/failure.controllers.js";
import { getWeeklyFailures } from "../controllers/failure.controllers.js";

const router = Router();

router.route("/mark-failure").post(verifyJWT, markDayAsFailed);
router.route("/weekly").get(verifyJWT, getWeeklyFailures);

export default router;
