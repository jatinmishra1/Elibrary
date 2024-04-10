import express from "express";
const app = express();

//Routes

app.get("/", (req, res, next) => {
  res.json({ message: "this is your message" });
});

export default app;
