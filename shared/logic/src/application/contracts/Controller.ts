export type Controller<T, U> = {
  handle: (params: T) => Promise<U>;
};
