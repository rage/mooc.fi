import { toMatchSnapshot, type Context } from "jest-snapshot"
import { find, omit } from "lodash"
import { DateTime } from "luxon"

import { isNullOrUndefined } from "../../util/isNullOrUndefined"

export const ID_REGEX = new RegExp(
  /[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}/,
  "i",
)

export function fail(reason = "fail was called in a test") {
  throw new Error(reason)
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" &&
  !Array.isArray(value) &&
  value !== null &&
  !(value instanceof Date) &&
  !(value instanceof DateTime)

export function stripDates<T>(obj: T): T
export function stripDates<T>(obj: T): Omit<T, "created_at" | "updated_at">
export function stripDates<T>(obj: null): null
export function stripDates<T>(
  obj: T | null,
): Omit<T, "created_at" | "updated_at"> | null
export function stripDates<T>(obj: undefined): undefined
export function stripDates<T>(
  obj?: T | null,
): Omit<T, "created_at" | "updated_at"> | null | undefined {
  if (!isObject(obj) || isNullOrUndefined(obj)) {
    return obj
  }

  const ret = omit(obj, ["created_at", "updated_at"]) as Omit<
    T,
    "created_at" | "updated_at"
  >

  for (const key of Object.keys(obj) as Array<keyof typeof ret>) {
    const value = obj[key]
    if (Array.isArray(value)) {
      ret[key] = value.map(stripDates) as (typeof value)[number]
    } else if (isObject(value)) {
      ret[key] = stripDates(value)
    }
  }

  return ret
}

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never

type _DeepOmit<T, P> = T extends object
  ? P extends `${infer Head}.${infer Rest}`
    ? {
        [K in keyof T]: K extends Head ? DeepOmit<T[K], Rest> : T[K]
      }
    : P extends `${infer Head}`
    ? {
        [K in keyof T]: K extends Head
          ? never
          : T[K] extends object
          ? DeepOmit<T[K], P>
          : T[K]
      }
    : never
  : never

type DeepOmit<T, P> = UnionToIntersection<_DeepOmit<T, P>>

export type Path<T> = T extends Record<string, unknown>
  ? {
      [K in keyof T & string]:
        | K
        | `${K}.${Path<T[K]> extends infer U extends string ? U : never}`
    }[keyof T & string]
  : T extends Array<infer R>
  ? {
      [K in keyof R & string]:
        | K
        | `${K}.${Path<R[K]> extends infer U extends string ? U : never}`
    }[keyof R & string]
  : never

type Field<T> = T extends Record<string, unknown>
  ? {
      [K in keyof T & string]: Field<T[K]> extends infer U extends string
        ? K | U
        : K
    }[keyof T & string]
  : T extends Array<infer R>
  ? {
      [K in keyof R & string]: Field<R[K]> extends infer U extends string
        ? K | U
        : K
    }[keyof R & string]
  : never

export function stripFields<
  T,
  Fields extends Array<Field<T>> = Array<Field<T>>,
>(obj: T, fields: Fields): DeepOmit<T, Fields[number]> {
  if (Array.isArray(obj)) {
    return obj.map((item: (T & any[])[number]) =>
      stripFields(item, fields),
    ) as unknown as DeepOmit<T, Fields[number]>
  }

  if (!isObject(obj) || isNullOrUndefined(obj)) {
    return obj as DeepOmit<T, Fields[number]>
  }
  const ret = {} as DeepOmit<T, Fields[number]>

  for (const key of Object.keys(obj) as Array<keyof T>) {
    const value = obj[key]
    if (Array.isArray(value)) {
      ret[key as keyof typeof ret] = value.map(
        (item: (T[keyof T] & any[])[number]) => stripFields(item, fields),
      ) as DeepOmit<T, Fields[number]>[keyof typeof ret]
    } else if (isObject(value)) {
      ret[key as keyof typeof ret] = omit(value, fields) as DeepOmit<
        T,
        Fields[number]
      >[keyof typeof ret]
    } else {
      ret[key as keyof typeof ret] = value as DeepOmit<
        T,
        Fields[number]
      >[keyof typeof ret]
    }
  }
  return ret
}

/**
 * @template T
 *
 * @param field When the type is known to be a record, field is Path<T> or Field<T>; otherwise string
 * @param match regular expression or string to match the field/path
 */
type FieldWithMatch<T = string> = { field: T; match: RegExp | string }
/**
 * @template T
 *
 * When the type is known to be a record, a path, a field or FieldWithMatch
 */
type FieldOptionType<
  T,
  PF = T extends Record<string, unknown> ? Path<T> | Field<T> : string,
> = PF | FieldWithMatch<PF>
type ExcludePathsOptionType<
  T,
  P = T extends Record<string, unknown> ? Path<T> : string,
> = Array<P>
type ExcludeFieldsOptionType<
  T,
  F = T extends Record<string, unknown> ? Field<T> : string,
> = Array<F>

type StrippedSnapshotOptions<T> = {
  /**
   * @template T
   * Array of fields _not_ to be stripped
   */
  excludeFields?: ExcludeFieldsOptionType<T>
  /**
   * @template T
   * Array of paths _not_ to be stripped
   */
  excludePaths?: ExcludePathsOptionType<T>
  /**
   * @template T
   * @type {Array<FieldOptionType<Path<T> | Field<T>>>}
   * Array of fields or paths to be used as id fields, ie. matched with a regular expression or exact match
   */
  idFields?: Array<FieldOptionType<T>> // | Array<Path<T>>// IdFieldOptionType<T>
}

type StrippedSnapshotFinalOptions<T extends Record<string, unknown>> = {
  excludeFields: Array<Field<T>>
  excludePaths: Array<Path<T>>
  idFields: Array<FieldWithMatch<Path<T> | Field<T>>>
}

function isDefinedOrNull<T>(val: T | null): val is T | null {
  return typeof val !== "undefined"
}

const defaultIdFields: Array<FieldWithMatch<Path<{ id: string }>>> = [
  {
    field: "id",
    match: ID_REGEX,
  },
]

const normalizeOptions = <T, U extends T & Record<string, unknown>>(
  options: StrippedSnapshotOptions<T>,
): StrippedSnapshotFinalOptions<U> => {
  const {
    excludeFields = [],
    excludePaths = [],
    idFields: _idFields = defaultIdFields,
  } = options

  const idFields = _idFields.map((field) => {
    if (typeof field === "string") {
      return { field, match: ID_REGEX }
    }
    return field
  }) as Array<FieldWithMatch<Path<U> | Field<U>>>

  const _options = {
    idFields,
    excludeFields: excludeFields as Array<Field<U>>,
    excludePaths: excludePaths as Array<Path<U>>,
  }
  return _options
}

const pathname = <T>(path: Path<T>, key: keyof T): Path<T> =>
  (path ? `${String(path)}.${String(key)}` : key) as Path<T>

function isObjectOrArray(
  val: unknown,
): val is Array<unknown> | Record<string, unknown> {
  return isObject(val) || Array.isArray(val)
}

const getIdField = <T>(
  idFields: Array<FieldWithMatch<Path<T> | Field<T>>>,
  key: Path<T> | Field<T>,
) => {
  return find(idFields, (idField) => idField.field === key)
}

export function idsToExpect<
  T extends Record<string, unknown>,
  U extends { [K in keyof T]: any } = { [K in keyof T]: any },
>(
  obj: T | null,
  propertyMatchers: Partial<U> = {},
  options: StrippedSnapshotFinalOptions<T> = {} as StrippedSnapshotFinalOptions<T>,
  path = "" as Path<T>,
): Partial<U> {
  if (!isObject(obj) || Array.isArray(obj) || isNullOrUndefined(obj)) {
    return propertyMatchers
  }

  const { excludeFields, excludePaths, idFields } = options
  const ret = { ...propertyMatchers }

  for (const key of Object.keys(obj) as Array<keyof typeof obj>) {
    const currentPath = pathname(path, key)
    const value = obj[key]

    if (Array.isArray(value)) {
      const expectedArray = getExpectedArray(
        value,
        ret,
        key,
        options,
        currentPath,
      )
      if (
        expectedArray.length > 0 &&
        (!isObject(expectedArray[0]) ||
          (isObject(expectedArray[0]) &&
            expectedArray.every((val: any) => Object.keys(val).length > 0)))
      ) {
        ret[key] = expectedArray as any
      }
    } else if (isObject(value)) {
      const expectedObject = idsToExpect(
        value,
        ret[key],
        options as StrippedSnapshotFinalOptions<typeof value>,
        currentPath as Path<typeof value>,
      )
      if (Object.keys(expectedObject).length > 0) {
        ret[key] = expectedObject as any
      }
    } else {
      if (
        excludeFields.includes(key as Field<T>) ||
        excludePaths.includes(path) ||
        excludePaths.includes(currentPath)
      ) {
        continue
      }
      const idFieldKey = getIdField(idFields, key as Field<T>)
      const idFieldPath = getIdField(idFields, path)

      if (idFieldKey || (idFieldPath?.match && !isDefinedOrNull(ret[key]))) {
        ret[key] = expect.stringMatching(
          idFieldKey?.match ?? idFieldPath?.match ?? "",
        )
      }
    }
  }

  return ret
}

function getExpectedArray<
  T extends Record<string, unknown>,
  U extends {
    [K in keyof T]: any
  } = {
    [K in keyof T]: any
  },
>(
  value: T[keyof T] & any[],
  ret: Partial<U>,
  key: keyof T,
  options: StrippedSnapshotFinalOptions<T>,
  currentPath: string,
): Array<Partial<U[keyof U]>> {
  return value.map((val: (typeof value)[number], index: number) => {
    const matchers = getArrayMatchers(ret, key, index)
    if (!isObjectOrArray(val)) {
      return matchers ?? val
    }
    if (Array.isArray(val)) {
      return getExpectedArray(
        val as (typeof value)[number][number],
        ret,
        key,
        options,
        currentPath,
      )
    }

    return idsToExpect(val, matchers, options, currentPath)
  })
}

function getArrayMatchers<T extends Record<string, any>>(
  ret: Partial<T>,
  key: keyof T,
  index: number,
) {
  return Array.isArray(ret[key]) ? ret[key]?.[index] : ret[key]
}

type AnyOrArrayAnyObject<T> = T extends Array<infer R>
  ? { [K in keyof R]: any }
  : { [K in keyof T]: any }

/**
 *
 * @template {T}
 * @param {StrippedSnapshotOptions<T>} _options
 * @returns
 */
function toMatchStrippedSnapshot<
  T,
  U extends AnyOrArrayAnyObject<T> = AnyOrArrayAnyObject<T>,
  //R extends TypeOrArrayType<T> = TypeOrArrayType<T>,
>(
  this: jest.MatcherContext,
  actual: T,
  propertyMatchers: Partial<U> = {},
  _options: StrippedSnapshotOptions<T> = {} as StrippedSnapshotOptions<T>,
) {
  const options = normalizeOptions(_options)
  if (Array.isArray(actual)) {
    if (!isObject(actual[0])) {
      return toMatchSnapshot.call(
        this as Context,
        actual,
        propertyMatchers,
        "toMatchStrippedSnapshot",
      )
    }

    const strippedActual = actual.map(stripDates)
    const expected = actual.map((val) =>
      idsToExpect(val, propertyMatchers, options),
    )

    return toMatchSnapshot.call(
      this as Context,
      strippedActual,
      expected,
      "toMatchStrippedSnapshot",
    )
  }
  if (isObject(actual)) {
    const strippedActual = stripDates(actual)
    const expected = idsToExpect(
      strippedActual,
      propertyMatchers as Record<keyof typeof actual, any>,
      options,
    )

    return toMatchSnapshot.call(
      this as Context,
      strippedActual,
      expected,
      "toMatchStrippedSnapshot",
    )
  }
  return toMatchSnapshot.call(
    this as Context,
    actual,
    propertyMatchers,
    "toMatchStrippedSnapshot",
  )
}

expect.extend({
  toMatchStrippedSnapshot,
})

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T> {
      /**
       * Match snapshot, but strip all dates (`created_at`, `updated_at`), as well as replacing any specified fields with a regex match.
       * Default is to match any `id` field with a Prisma id regex.
       *
       * @template {T}
       * @param propertyMatchers
       * @param {StrippedSnapshotOptions<T>} options
       * @param {ExcludeFieldsOptionType<T>} options.excludeFields - Fields to _not_ strip. Will match all fields with this name, regardless of path.
       * @param {ExcludePathsOptionType<T>} options.excludePaths - Paths to _not_ strip. Will match only fields that match exactly..
       * @param {Array<FieldOptionType<T>>} options.idFields - fields to consider as id fields
       */
      toMatchStrippedSnapshot<
        U extends AnyOrArrayAnyObject<T> = AnyOrArrayAnyObject<T>,
      >(
        propertyMatchers?: Partial<U>,
        options?: StrippedSnapshotOptions<T>,
      ): R
    }
  }
}
