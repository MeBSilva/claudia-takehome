import { HttpControllerDecorator } from "../application/controllers/HttpController";
import { routes, type AllRoutes } from "./routes";
import { checkENVs } from "./utils/checkENVs";
import { traverse } from "./utils/traverse";

checkENVs();

export const getHttpController = (path: string[]) => {
  const controller = traverse(
    routes,
    path,
    (object: unknown): object is HttpControllerDecorator<unknown, unknown> =>
      object instanceof HttpControllerDecorator,
  );

  return controller;
};

export type { AllRoutes };
