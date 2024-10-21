import type { AllRoutes } from "logic";

interface ProxyCallbackOptions {
  path: string[];
  args: unknown[];
}

type ProxyCallback = (opts: ProxyCallbackOptions) => unknown;

function createRecursiveProxy(callback: ProxyCallback, path: string[]) {
  const proxy: unknown = new Proxy(() => null, {
    get(_obj, key) {
      if (typeof key !== "string") return undefined;

      return createRecursiveProxy(callback, [...path, key]);
    },
    apply(_1, _2, args) {
      return callback({
        path,
        args,
      });
    },
  });

  return proxy;
}

const defaultProxy = (apiEndpoint: string) =>
  createRecursiveProxy(async (opts) => {
    const path = [...opts.path];
    const slashPath = path.join("/");

    const result = await fetch(`${apiEndpoint}/features/${slashPath}`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(opts.args[0]),
      method: "POST",
    });

    return result.json();
  }, []) as AllRoutes;

export const features = defaultProxy(
  process.env.API_URL ?? "http://localhost:3333",
);
