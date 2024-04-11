import { NextFunction, Request, Response, raw } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
  userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token) {
    return next(createHttpError(401, "authorization token is required"));
  }

  try {
    const parsedToken = token.split(" ")[1];
    const decoded = verify(parsedToken, config.jwtSecretKey as string);
    const _req = req as AuthRequest;
    _req.userId = decoded.sub as string;
    next();
  } catch (err) {
    console.log(err);
    return next(createHttpError(500, "token verification failed"));
  }
};

export default authenticate;
