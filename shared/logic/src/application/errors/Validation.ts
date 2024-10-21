import { ApplicationError } from "../../domain/errors/ApplicationError";

export class ValidationError extends ApplicationError {
  constructor(public readonly details: unknown[]) {
    super("Invalid Input");
    this.name = "ValidationError";
  }
}
