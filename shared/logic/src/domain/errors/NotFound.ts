import { ApplicationError } from "../../domain/errors/ApplicationError";

export class NotFoundError extends ApplicationError {
  constructor() {
    super("Not Found");
    this.name = "NotFoundError";
  }
}
