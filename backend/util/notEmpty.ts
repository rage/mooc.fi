export function notEmpty<TValue>(
  value: TValue | null | undefined,
): value is TValue {
  return value !== null && typeof value !== "undefined"
}
