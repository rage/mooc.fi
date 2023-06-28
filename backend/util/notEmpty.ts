export function notEmpty<TValue>(
  value: TValue | null | undefined,
): value is TValue {
  return value !== null && typeof value !== "undefined"
}

export function notEmptyOrEmptyString<TValue>(
  value: TValue | null | undefined | string,
): value is TValue {
  return notEmpty(value) && value !== ""
}
