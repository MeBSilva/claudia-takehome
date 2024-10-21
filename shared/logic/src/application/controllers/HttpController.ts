import { ApplicationError } from "../../domain/errors/ApplicationError";
import type { Feature } from "../../domain/feature";
import type { Controller } from "../contracts/Controller";
import type { HttpRequest, HttpResponse } from "../contracts/HttpClient";
import type { Logger } from "../contracts/Logger";
import type { Validator } from "../contracts/Validator";
import { handleHttpErrors, noContent, ok } from "../helpers/http";

export class HttpControllerDecorator<T, U>
  implements Controller<HttpRequest<T>, HttpResponse<U | Error>>
{
  constructor(
    private readonly featureDesignator: string,
    private readonly feature: Feature<T, U>,
    private readonly validator: Validator<T>,
    private readonly logger: Logger,
  ) {}

  public async handle(
    params: HttpRequest<T>,
  ): Promise<HttpResponse<U | Error>> {
    const requestLogger = this.logger.setContext(this.featureDesignator, {
      ...params,
      feature: this.featureDesignator,
      controller: "HttpControllerDecorator",
    });

    try {
      requestLogger.log("HTTP REQUEST HANDLING START");

      requestLogger.log("VALIDATING BODY");
      const validated = this.validator.validate(params.body);

      if (!validated.success) {
        requestLogger.warning("BODY VALIDATION ERROR", validated.error);
        return handleHttpErrors(validated.error);
      }
      requestLogger.log("CALLING FEATURE");

      const result = await this.feature.call(validated.data);

      requestLogger.log("FEATURE CALL RESULT", { result: result });

      if (result instanceof ApplicationError) return handleHttpErrors(result);

      if (result == null) return noContent() as HttpResponse<U>;

      return ok(result);
    } catch (error) {
      requestLogger.error("HTTP REQUEST HANDLING ERROR", error);
      if (error instanceof Error) return handleHttpErrors(error);

      return handleHttpErrors(new Error("unhandled error"));
    } finally {
      requestLogger.log("HTTP REQUEST HANDLING END");
    }
  }
}
