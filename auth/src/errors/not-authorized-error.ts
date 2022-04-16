import { CustomError } from "./custom-errors";

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super("unauthorized");
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }
  serializeErrors() {
    return [{ message: "Not authorized" }];
  }
}
