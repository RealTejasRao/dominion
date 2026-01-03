import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";

dotenv.config({
  path: "./.env", //looks for a .env file in the root directory
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});
