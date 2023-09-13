import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default function authMiddlleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.headers.authorization) {
    return res.sendStatus(401);
  }
  const [bearer, token] = req.headers.authorization?.split(" ");
  console.log(bearer, token);
  if (bearer !== "Bearer") {
    return res.sendStatus(401);
  }
  try {
    jwt.verify(token, process.env.SECRET as string);
  } catch {
    return res.sendStatus(401);
  }
  next();
}
