import express from "express";
import cors from "cors";


const app = express();

//basic configurations for express
app.use(express.json({ limit: "16kb" })); //allows Express to read JSON safely and blocks oversized payloads.
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //It lets Express read form submissions, including nested data.
app.use(express.static("public")); // It exposes the public folder so browsers can directly access static files.



// cors config
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

//import routes
import healthCheckRouter from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routes.js"


app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);



app.get("/", (req, res) => {
  res.send("TEJAS RAO");
});
export default app;
