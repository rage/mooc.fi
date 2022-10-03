export type Optional<T> = T | undefined | null
export type Nullish = null | undefined

export function isDefined<T>(value: T | Nullish): value is T {
  return value !== null && typeof value !== "undefined"
}

export function isNullish<T>(value: T | Nullish): value is Nullish {
  return !isDefined(value)
}

export function isNull<T>(value: T | null): value is null {
  return value === null
}

export function isNotNull<T>(value: T | null): value is T {
  return value !== null
}

export function isNullishOrEmpty<T>(
  value: T | Nullish | "",
): value is Nullish | "" {
  return isNullish(value) || (typeof value === "string" && value === "")
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
