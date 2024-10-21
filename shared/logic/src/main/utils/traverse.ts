export const traverse = <T>(
  object: Record<string, unknown>,
  keys: string[],
  predicate: (object: unknown) => object is T,
): T | undefined => {
  const [head, ...tail] = keys;

  const value = object[head];
  if (value == null) return undefined;

  if (predicate(value)) return value;

  return traverse(value as Record<string, unknown>, tail, predicate);
};
