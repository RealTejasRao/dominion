import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { startCronJobs } from "./src/cron/index.js";

const port = process.env.PORT || 3000;

connectDB();

app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});

startCronJobs();
