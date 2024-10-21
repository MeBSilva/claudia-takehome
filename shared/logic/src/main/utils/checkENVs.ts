import * as envs from "../constants/server";
import { traverseApplyingFunction } from "./traverseApplyingFunction";

export const checkENVs = () => {
  traverseApplyingFunction(envs, (key: string, value: unknown) => {
    if (value == null)
      throw new Error(
        `Missing ENV. Did you remember to add the env '${key}' to the current environment?`,
      );

    return value;
  });
};
