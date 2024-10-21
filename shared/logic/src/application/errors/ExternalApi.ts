import { ApplicationError } from "../../domain/errors/ApplicationError";

export class ExternalApiError extends ApplicationError {
  constructor(
    public readonly serviceName: string,
    private readonly error?: unknown,
  ) {
    super(`The service: ${serviceName} returned an error response`);
    this.name = "ExternalServiceError";
  }
}
