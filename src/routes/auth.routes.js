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
import { forgotPasswordRequest } from "../controllers/auth.controllers.js";
import { userForgotPasswordValidator } from "../validators/index.js";
import { resetForgotPassword } from "../controllers/auth.controllers.js";
import { userResetForgotPasswordValidator } from "../validators/index.js";
import { changeCurrentPassword } from "../controllers/auth.controllers.js";
import { userChangeCurrentPasswordValidator } from "../validators/index.js";

const router = Router();

router
  .route("/register")
  .post(...userRegisterValidator(), validate, registerUser);
router.route("/login").post(...userLoginValidator(), validate, login);
router.route("/logout").post(verifyJWT, logoutUser); //We do not () with middlewares
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router
  .route("/resend-email-verification")
  .post(verifyJWT, resendEmailVerification);
router.route("/refresh-token").post(refreshAccessToken);
router
  .route("/forgot-password")
  .post(...userForgotPasswordValidator(), validate, forgotPasswordRequest);
router
  .route("/reset-password/:resetToken")
  .post(...userResetForgotPasswordValidator(), validate, resetForgotPassword);
router
  .route("/change-password")
  .post(
    verifyJWT,
    userChangeCurrentPasswordValidator(),
    validate,
    changeCurrentPassword,
  );

export default router;
