export function isNullOrUndefined<T>(
  obj: T | null | undefined,
): obj is null | undefined {
  return typeof obj === "undefined" || obj === null
}

export function isNotNullOrUndefined<T>(obj: T | null | undefined): obj is T {
  return !isNullOrUndefined(obj)
}

export function fieldIsNotNullOrUndefined<
  T extends object,
  Field extends keyof T,
>(
  obj: T | null | undefined,
  field: Field,
): obj is T & { [key in Field]-?: NonNullable<T[Field]> } {
  return !isNullOrUndefined(obj) && !isNullOrUndefined(obj[field])
}
