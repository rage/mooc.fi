export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && typeof value !== "undefined"
}

export function isNullOrUndefined<T>(
  value: T | null | undefined,
): value is null | undefined {
  return !isDefined(value)
}

export function isNull<T>(value: T | null): value is null {
  return value === null
}

export function isEmptyNullOrUndefined<T>(
  value: T | null | undefined,
): value is null | undefined {
  return isNullOrUndefined(value) || (typeof value === "string" && value === "")
}

export const isPromise = <T>(value: any): value is Promise<T> => {
  return value && typeof value.then === "function"
}

export const isAsync = <T>(
  fn: (...props: any[]) => Promise<T> | T,
): fn is (...props: any[]) => Promise<T> => {
  return (
    fn && typeof fn === "function" && fn.constructor.name === "AsyncFunction"
  )
}
