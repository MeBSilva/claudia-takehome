export type Feature<T, U> = {
  call: (params: T) => U;
};
