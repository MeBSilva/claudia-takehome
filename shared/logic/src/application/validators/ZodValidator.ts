import type { ZodSchema } from "zod";
import { ValidationError } from "../errors/Validation";
import type { Validator } from "../contracts/Validator";

export class ZodValidator<T> implements Validator<T> {
  constructor(private readonly schema: ZodSchema<T>) {}

  public validate(
    payload: unknown,
  ): { success: false; error: ValidationError } | { success: true; data: T } {
    const parsed = this.schema.safeParse(payload);

    if (parsed.success) return { data: parsed.data, success: true };

    return { error: new ValidationError(parsed.error.errors), success: false };
  }
}
