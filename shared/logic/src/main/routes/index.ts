import type { Controller } from "../../application/contracts/Controller";
import * as message from "./message";

export const routes = { message };

// biome-ignore lint/suspicious/noExplicitAny: this time it's warranted
type Route = Controller<any, any>;
type Router = { [K in string]: Route | Router };

type RemoveDeps<T extends Route> = (
  args: Parameters<T["handle"]>[0]["body"],
) => Promise<Exclude<Awaited<ReturnType<T["handle"]>>["body"], Error>>;

type Routes<T extends Router> = {
  [Key in keyof T]: T[Key] extends Route
    ? RemoveDeps<T[Key]>
    : T[Key] extends Router
      ? Routes<T[Key]>
      : never;
};

export type AllRoutes = Routes<typeof routes>;
