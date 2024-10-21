import type { ValidationError } from "../errors/Validation";

export type Validator<T> = {
  validate: (
    payload: unknown,
  ) => { success: false; error: ValidationError } | { success: true; data: T };
};
