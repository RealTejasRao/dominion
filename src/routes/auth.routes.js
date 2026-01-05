import { Router } from "express";
import { registerUser } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegisterValidator } from "../validators/index.js";
import { login } from "../controllers/auth.controllers.js";
import { userLoginValidator } from "../validators/index.js";
import { logoutUser } from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getCurrentUser } from "../controllers/auth.controllers.js";
import { verifyEmail } from "../controllers/auth.controllers.js";
import { resendEmailVerification } from "../controllers/auth.controllers.js";
import { refreshAccessToken } from "../controllers/auth.controllers.js";

const router = Router();

router.route("/register").post(...userRegisterValidator(), validate, registerUser);
router.route("/login").post(...userLoginValidator(), validate, login);
router.route("/logout").post(verifyJWT, logoutUser);  //We do not () with middlewares
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/resend-email-verification").post(verifyJWT, resendEmailVerification);
router.route("/refresh-token").post(refreshAccessToken);



export default router;
