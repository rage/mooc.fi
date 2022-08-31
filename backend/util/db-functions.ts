import { Knex } from "knex"

import { Prisma } from "@prisma/client"

import { CIRCLECI } from "../config"
import { isEmptyNullOrUndefined, isNull, isNullOrUndefined } from "../util"

// helper function to convert to atomicNumberOperations
// https://github.com/prisma/prisma/issues/3491#issuecomment-689542237
export const convertUpdate = <T extends object>(input: {
  [key: string]: any
}): T =>
  Object.entries(input).reduce(
    (acc: any, [key, value]: [string, any]) => ({
      ...acc,
      [key]: Array.isArray(value)
        ? value.map(convertUpdate)
        : typeof value === "object" &&
          value !== null &&
          !(value instanceof Date)
        ? typeof value === "object" && convertUpdate(value)
        : value instanceof Date
        ? value.toISOString()
        : typeof value === "number"
        ? Number.isNaN(value)
          ? undefined
          : { set: value }
        : typeof value === "boolean"
        ? { set: value }
        : value,
    }),
    {},
  )

type NonNullable<T> = T extends null ? Exclude<T, null> : T

type NonNullFields<
  T extends Record<PropertyKey, any>,
  U = T | null | undefined,
> = U extends undefined // null or undefined returns undefined
  ? undefined
  : U extends null
  ? undefined
  : [keyof T] extends [never] // empty object returns undefined
  ? undefined
  : Partial<T> extends T // all fields are optional, can be undefined as well
  ?
      | {
          [K in keyof T]: NonNullable<T[K]>
        }
      | undefined
  : {
      [K in keyof T]: NonNullable<T[K]>
    }

function isFilteredNullOrUndefined<T extends Record<string, any>>(
  obj: T | null | undefined,
): obj is null | undefined {
  return isNullOrUndefined(obj)
}

type Optional<T> = T | undefined | null

export function filterNullFields<T extends Record<string, any>>(
  obj: Optional<T>,
): NonNullFields<T> {
  if (isFilteredNullOrUndefined(obj)) {
    return undefined
  }

  const ret = { ...obj }

  for (const key in obj) {
    if (isNull(obj[key])) {
      delete ret[key]
    }
  }

  if (Object.keys(ret).length === 0) {
    return undefined
  }

  return ret as NonNullFields<T>
}

export const createUUIDExtension = async (knex: Knex) => {
  if (CIRCLECI) {
    return
  }

  try {
    await knex.raw(`CREATE SCHEMA IF NOT EXISTS "extensions";`)
    await knex.raw(
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA "extensions";`,
    )
  } catch (error) {
    console.warn(
      "Error creating uuid-ossp extension. Ignore if this didn't fall on next hurdle",
      error,
    )
  }

  try {
    // if uuid-ossp already exists, but in another schema
    await knex.raw(`CREATE SCHEMA IF NOT EXISTS "extensions";`)
    await knex.raw(`ALTER EXTENSION "uuid-ossp" SET SCHEMA "extensions";`)
  } catch {
    // we can probably ignore this
  }
}

// https://github.com/prisma/prisma/issues/5042#issuecomment-1191275514
type A<T extends string> = T extends `${infer U}ScalarFieldEnum` ? U : never
type Entity = A<keyof typeof Prisma>
type Keys<T extends Entity> = Extract<
  keyof typeof Prisma[keyof Pick<typeof Prisma, `${T}ScalarFieldEnum`>],
  string
>

export function excludeFields<T extends Entity, K extends Keys<T>>(
  type: T,
  omit: K[],
) {
  type Key = Exclude<Keys<T>, K>
  type TMap = Record<Key, true>
  const result: TMap = {} as TMap
  for (const key in Prisma[`${type}ScalarFieldEnum`]) {
    if (!omit.includes(key as K)) {
      result[key as Key] = true
    }
  }
  return result
}

export function includeFields<T extends Entity, K extends Keys<T>>(
  _type: T,
  inc: K[],
) {
  type TMap = Record<K, true>
  const result: TMap = {} as TMap
  for (const key of inc) {
    result[key as K] = true
  }
  return result
}

export function emptyOrNullToUndefined<T>(
  value: T | null | undefined,
): T | undefined {
  return isEmptyNullOrUndefined(value) ? undefined : value
}
