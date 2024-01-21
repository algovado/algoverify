import { Response, Request, NextFunction } from "express";
import { rateLimit } from "express-rate-limit";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.message);
  res.status(500).send(err.message);
  console.error(err.stack);
};

export const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 50,
  standardHeaders: "draft-7",
});
