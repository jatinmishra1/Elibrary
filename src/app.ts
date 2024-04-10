import express, { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import { config } from "./config/config";
const app = express();
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./users/userRouter";

//Routes

app.get("/", (req, res, next) => {
  //   throw new Error("something went wrong");
  const error = createHttpError(400, "something went wrong");
  throw error;
  res.json({ message: "this is your message" });
});

app.use("/api/users", userRouter);

//global error handlers
app.use(globalErrorHandler);

export default app;
