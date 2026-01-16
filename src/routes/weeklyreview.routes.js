import { Router } from "express";
import { generateWeeklyReview } from "../controllers/weeklyreview.controllers.js";
import { getWeeklyReview } from "../controllers/weeklyreview.controllers.js";
import { getWeeklyHistory } from "../controllers/weeklyreview.controllers.js";

const router = Router();

router.route("/generate").post(generateWeeklyReview);
router.route("/history").get(getWeeklyHistory);
router.route("/:weekStartDate").get(getWeeklyReview);

export default router;
