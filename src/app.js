import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";
import helmet from "helmet";
import { attachTimezone } from "./middlewares/timezone.middleware.js";
import { verifyJWT } from "./middlewares/auth.middleware.js";

const app = express();

// security headers
app.use(
  helmet({
    frameguard: { action: "deny" },

    noSniff: true,

    dnsPrefetchControl: { allow: false },

    hidePoweredBy: true,
  }),
);

//basic configurations for express
app.use(express.json({ limit: "16kb" })); //allows Express to read JSON safely and blocks oversized payloads.
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //It lets Express read form submissions, including nested data.
app.use(express.static("public")); // It exposes the public folder so browsers can directly access static files.

// cookie-parser
app.use(cookieParser());

// cors config
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Timezone"],
    maxAge: 86400,
  }),
);

//import routes
import healthCheckRouter from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routes.js";
import goalRouter from "./routes/goals.routes.js";
import deepworkRouter from "./routes/deepwork.routes.js";
import failureRouter from "./routes/failure.routes.js";
import weeklyreviewRouter from "./routes/weeklyreview.routes.js";
import internalRouter from "./routes/internal.routes.js";

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use(verifyJWT);
app.use(attachTimezone);
app.use("/api/v1/goal", goalRouter);
app.use("/api/v1/deepwork", deepworkRouter);
app.use("/api/v1/failure", failureRouter);
app.use("/api/v1/weeklyreview", weeklyreviewRouter);
app.use("/api/v1/internal", internalRouter);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("TEJAS RAO");
});
export default app;
