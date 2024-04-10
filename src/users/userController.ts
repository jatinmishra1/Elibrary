import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  //validation
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    const error = createHttpError(400, "all fiels are required");
    return next(error);
  }
  const user = await userModel.findOne({ email: email });
  if (user) {
    const error = createHttpError(400, "already user exits");
    return next(error);
  }

  return res.json({ message: "from the cont" });
};

export { createUser };
