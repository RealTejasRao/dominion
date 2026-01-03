import express from "express";

const app = express();

//basic configurations for express
app.use(express.json({ limit: "16kb" })); //allows Express to read JSON safely and blocks oversized payloads.
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //It lets Express read form submissions, including nested data.
app.use(express.static("public")); // It exposes the public folder so browsers can directly access static files.

app.get("/", (req, res) => {
  res.send("TEJAS RAO");
});

export default app;
