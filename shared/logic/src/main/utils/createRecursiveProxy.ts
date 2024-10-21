export const createRecursiveProxy = (
  callback: (opts: {
    path: string[];
    args: unknown[];
  }) => unknown,
  path: string[],
) => {
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
};
