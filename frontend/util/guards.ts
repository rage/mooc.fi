import {
  Completion,
  CompletionDetailedFieldsWithCourseFragment,
} from "/graphql/generated"

export const completionHasCourse = (
  completion: CompletionDetailedFieldsWithCourseFragment,
): completion is CompletionDetailedFieldsWithCourseFragment & {
  course: NonNullable<Completion["course"]>
} => Boolean(completion.course)

export type Optional<T> = T | undefined | null
export type Nullish = null | undefined
export type Empty = "" | Nullish
export type Falsy = false | 0 | 0n | "" | Nullish
export type PromiseReturnType<T> = T extends (
  ...args: any[]
) => Promise<infer R>
  ? R
  : never

export function isDefined<T>(value: T | Nullish): value is T {
  return value !== null && typeof value !== "undefined"
}

export function isFalsy(value: unknown): value is Falsy {
  return !value
}

export function isEmptyString(value: unknown): value is "" {
  return typeof value === "string" && value === ""
}

export function isDefinedAndNotEmpty<T>(value: T | Empty): value is T {
  return isDefined(value) && !isEmptyString(value)
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

export function isNullishOrEmpty<T>(value: T | Empty): value is Empty {
  return isNullish(value) || isEmptyString(value)
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
