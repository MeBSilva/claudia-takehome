import { NotFoundError } from "../../domain/errors/NotFound";
import type { HttpResponse } from "../contracts/HttpClient";
import { ExternalApiError } from "../errors/ExternalApi";
import { ValidationError } from "../errors/Validation";

export const ok = <T extends Record<string, unknown>>(
  body: T,
): HttpResponse<T> => ({
  statusCode: 200,
  body,
});

export const noContent = (): HttpResponse<null> => ({
  statusCode: 204,
  body: null,
});

export const notFound = <T extends NotFoundError>(
  error: T,
): HttpResponse<T> => ({
  statusCode: 404,
  body: error,
});

export const badRequest = <T extends ValidationError>(
  error: T,
): HttpResponse<T> => ({
  statusCode: 400,
  body: error,
});

export const externalApiError = <T extends ExternalApiError>(
  error: T,
): HttpResponse<T> => ({
  statusCode: 503,
  body: error,
});

export const internalServerError = (error: Error): HttpResponse<Error> => ({
  statusCode: 500,
  body: { message: error.message, name: error.name },
});

export const handleHttpErrors = (error: Error): HttpResponse<Error> => {
  if (error instanceof NotFoundError) return notFound(error);
  if (error instanceof ValidationError) return badRequest(error);
  if (error instanceof ExternalApiError) return externalApiError(error);

  return internalServerError(error);
};
