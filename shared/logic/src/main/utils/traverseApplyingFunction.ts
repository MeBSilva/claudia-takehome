export const traverseApplyingFunction = (
  object: unknown,
  fun: (key: string, value: unknown) => unknown,
) => JSON.parse(JSON.stringify(object, fun));
