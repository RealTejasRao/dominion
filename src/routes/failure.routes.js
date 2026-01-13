import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { markDayAsFailed } from "../controllers/failure.controllers.js";

const router = Router();

router.route("/mark-failure").post(verifyJWT, markDayAsFailed);


export default router;
