import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { generateWeeklyReview } from "../controllers/weeklyreview.controllers.js";
import { getWeeklyReview } from "../controllers/weeklyreview.controllers.js";
import { getWeeklyHistory } from "../controllers/weeklyreview.controllers.js";

const router = Router();

router.route("/generate").post(verifyJWT, generateWeeklyReview);
router.route("/history").get(verifyJWT, getWeeklyHistory);
router.route("/:weekStartDate").get(verifyJWT, getWeeklyReview);

export default router;
