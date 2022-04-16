import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-errors";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Something went wrong", err);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(400).send({
    errors: [{ message: err.message }],
  });
};

/**
 * Returns the below structure
 * {
 *  "errors": {
 *      "message": string, field?: string
 *  }[]
 * }
 */
