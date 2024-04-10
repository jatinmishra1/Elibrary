import { NextFunction, Request, Response } from "express";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  return res.json({ message: "from the cont" });
};

export { createUser };
