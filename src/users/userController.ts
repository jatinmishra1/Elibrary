import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  //validation
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    const error = createHttpError(400, "all fiels are required");
    return next(error);
  }
  try {
    const user = await userModel.findOne({ email: email });
    if (user) {
      const error = createHttpError(400, "already user exits");
      return next(error);
    }
  } catch (err) {
    return next(createHttpError(500, "eroor while getting user"));
  }

  //password->hash
  const hashedPassword = await bcrypt.hash(password, 10);
  let newUser: User;
  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (err) {
    return next(createHttpError(500, "error while creating user"));
  }

  try {
    //token generation jwt
    const token = sign({ sub: newUser._id }, config.jwtSecretKey as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });

    return res.status(201).json({ accessToken: token });
  } catch (err) {
    return next(createHttpError(500, "token generation failed"));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  //validation
  const { email, password } = req.body;
  if (!email || !password) {
    const error = createHttpError(400, "all fiels are required");
    return next(error);
  }
  let user;
  try {
    user = await userModel.findOne({ email: email });
    if (!user) {
      const error = createHttpError(404, "user Not Find");
      return next(error);
    }
  } catch (err) {
    return next(createHttpError(500, "eroor while getting user"));
  }
  let isMatch;
  try {
    isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return next(createHttpError(400, "username or password is incorrect"));
    }
  } catch (err) {
    return next(createHttpError(400, "something went wrong"));
  }

  try {
    const token = sign({ sub: user._id }, config.jwtSecretKey as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });
    res.json({ accessToken: token });
  } catch (err) {
    return next(createHttpError(404, "something went wrong"));
  }
  //create accesstoken
};

export { createUser, loginUser };
