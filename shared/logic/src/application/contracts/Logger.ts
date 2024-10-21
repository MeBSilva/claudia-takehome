export type Logger = {
  log(msg: string, obj?: unknown): void;
  log(obj?: unknown): void;

  error(msg: string, obj?: unknown): void;
  error(obj?: unknown): void;

  warning(msg: string, obj?: unknown): void;
  warning(obj?: unknown): void;

  setContext(contextId: string, context?: Record<string, unknown>): Logger;
};
