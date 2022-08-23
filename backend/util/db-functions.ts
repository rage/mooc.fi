import { Knex } from "knex"

import { Prisma } from "@prisma/client"

import { CIRCLECI } from "../config"

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
        : typeof value === "object" && value !== null
        ? convertUpdate(value)
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

export const filterNull = <T>(o: T): T | undefined =>
  o
    ? Object.entries(o).reduce(
        (acc, [k, v]) => ({ ...acc, [k]: v == null ? undefined : v }),
        {} as T,
      )
    : undefined

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
