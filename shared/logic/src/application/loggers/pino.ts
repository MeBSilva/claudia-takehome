import pino, { type Logger as Pino } from "pino";
import type { Logger } from "../contracts/Logger";

export class PinoLogger implements Logger {
  private instance: Pino;

  constructor(
    private readonly environment: string,
    parentLogger?: Pino,
  ) {
    this.instance = parentLogger
      ? parentLogger
      : environment === "development"
        ? pino({
            transport: {
              target: "pino-pretty",
            },
          })
        : pino();
  }

  public log(msg: string | unknown, obj?: unknown) {
    if (typeof msg === "string") this.instance.info(obj, msg);
    else this.instance.info(msg);
  }

  public warning(msg: string | unknown, obj?: unknown) {
    if (typeof msg === "string") this.instance.warn(obj, msg);
    else this.instance.warn(msg);
  }

  public error(msg: string | unknown, obj?: unknown) {
    if (typeof msg === "string") this.instance.error(obj, msg);
    else this.instance.error(msg);
  }

  public setContext(
    contextId: string,
    context?: { [key: string]: unknown; id: string } | undefined,
  ) {
    return new PinoLogger(
      this.environment,
      this.instance.child({ context, contextId }),
    );
  }
}
