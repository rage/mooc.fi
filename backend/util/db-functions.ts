import fs from "fs"
import path from "path"

import { Knex } from "knex"

import { Course, Prisma } from "@prisma/client"

import { EXTENSION_PATH } from "../config"
import { BaseContext } from "../context"
import {
  isDefined,
  isNull,
  isNullish,
  isNullishOrEmpty,
  Nullish,
  Optional,
} from "./guards"

const getNameCombinations = (search: string) => {
  const parts = search.match(/[^\s\n]+/g) ?? []
  const combinations = []
  for (let i = 1; i < parts.length; i++) {
    combinations.push({
      first_name: parts.slice(0, i).join(" "),
      last_name: parts.slice(i).join(" "),
    })
  }
  return combinations
}

const defaultFields: Array<keyof Prisma.UserWhereInput | "full_name"> = [
  "full_name",
  "upstream_id",
  "email",
  "last_name",
  "first_name",
  "username",
  "student_number",
  "real_student_number",
]

export const buildUserSearch = (
  search?: string | null,
  fields: Array<keyof Prisma.UserWhereInput | "full_name"> = defaultFields,
): Array<Prisma.UserWhereInput> => {
  if (!isDefined(search)) {
    return []
  }

  const userSearchQuery: Array<Prisma.UserWhereInput> = []

  if (fields && fields.length === 0) {
    fields = defaultFields
  }

  for (const field of fields) {
    if (field === "full_name") {
      const possibleNameCombinations = getNameCombinations(search)

      if (possibleNameCombinations.length) {
        possibleNameCombinations.forEach(({ first_name, last_name }) => {
          userSearchQuery.push({
            first_name: { contains: first_name, mode: "insensitive" },
            last_name: { contains: last_name, mode: "insensitive" },
          })
        })
      }
    } else if (field === "upstream_id") {
      const searchAsNumber = parseInt(search)

      if (!isNaN(searchAsNumber)) {
        userSearchQuery.push({
          upstream_id: searchAsNumber,
        })
      }
    } else if (["student_number", "real_student_number"].includes(field)) {
      userSearchQuery.push({
        [field]: { contains: search },
      })
    } else {
      userSearchQuery.push({
        [field]: { contains: search, mode: "insensitive" },
      })
    }
  }

  return userSearchQuery
}

const wrapQueryString = (query: string) => `%${query}%`

export const buildUserSearchRaw = (
  search?: string | null,
  fields: Array<keyof Prisma.UserWhereInput | "full_name"> = defaultFields,
): Prisma.Sql | undefined => {
  if (!isDefined(search)) {
    return
  }

  if (fields && fields.length === 0) {
    fields = defaultFields
  }

  const conditions: Array<Prisma.Sql> = []

  for (const field of fields) {
    if (field === "full_name") {
      const possibleNameCombinations = getNameCombinations(search)

      if (possibleNameCombinations.length) {
        const nameQueries = possibleNameCombinations.map(
          ({ first_name, last_name }) =>
            Prisma.sql`(first_name ILIKE ${wrapQueryString(
              first_name,
            )} AND last_name ILIKE ${wrapQueryString(last_name)})`,
        )
        conditions.push(Prisma.sql`(${Prisma.join(nameQueries, " OR ")})`)
      }
    } else if (field === "upstream_id") {
      const searchAsNumber = parseInt(search)

      if (!isNaN(searchAsNumber)) {
        conditions.push(Prisma.sql`(upstream_id = ${searchAsNumber})`)
      }
    } else if (["student_number", "real_student_number"].includes(field)) {
      conditions.push(
        Prisma.sql`(${Prisma.raw(field)} LIKE ${wrapQueryString(search)})`,
      )
    } else {
      conditions.push(
        Prisma.sql`(${Prisma.raw(field)} ILIKE ${wrapQueryString(search)})`,
      )
    }
  }

  if (conditions.length === 0) {
    return
  }

  return Prisma.sql`
    SELECT * from "user"
    WHERE ${Prisma.join(conditions, " OR ")};
  `
}

interface ConvertPaginationInput {
  first?: number | null
  last?: number | null
  before?: string | null
  after?: string | null
  skip?: number | null
}

interface ConvertPaginationOptions {
  field?: string
}

interface ConvertPaginationOutput {
  skip?: number
  cursor?: { [key: string]: string }
  take?: number
}

export const convertPagination = (
  { first, last, before, after, skip: skipValue }: ConvertPaginationInput,
  options?: ConvertPaginationOptions,
): ConvertPaginationOutput => {
  const { field = "id" } = options ?? {}

  if (!first && !last) {
    throw new Error("first or last must be defined")
  }

  let skip = skipValue ?? 0
  let take = 0
  let cursor = undefined

  if (isDefined(before)) {
    skip += 1
    cursor = { [field]: before }
  } else if (isDefined(after)) {
    cursor = { [field]: after }
  }
  if (isDefined(last)) {
    take = -(last ?? 0)
  } else if (isDefined(first)) {
    take = first
  }

  return {
    skip,
    take,
    cursor,
  }
}

type NullFiltered<T> = T extends null
  ? Exclude<T, null>
  : T extends Array<infer R>
  ? Array<Exclude<NullFiltered<R>, null | undefined>>
  : T extends Record<PropertyKey, unknown>
  ? {
      [K in keyof T]: NullFiltered<T[K]>
    }
  : T

export const filterNull = <T extends object>(
  o?: T | null,
): NullFiltered<T> | undefined => {
  if (!o) {
    return undefined
  }
  if (Array.isArray(o)) {
    return o.map(filterNull).filter(isDefined) as NullFiltered<T>
  }

  return Object.fromEntries(
    Object.entries(o).map(([k, v]) => [k, v === null ? undefined : v]),
  ) as NullFiltered<T>
}

export const ensureDefinedArray = <T>(
  value: Optional<T | Array<Optional<T>>>,
): Array<T> => {
  if (!value) return []
  if (Array.isArray(value)) return value.filter(isDefined)

  return [value]
}

type OmitIndexSignature<ObjectType> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [KeyType in keyof ObjectType as {} extends Record<KeyType, unknown>
    ? never
    : KeyType]: ObjectType[KeyType]
}

type FilterNullRecursiveReturnType<T> = T extends object
  ? T extends Array<infer R>
    ? Array<NullFiltered<Exclude<R, undefined>>>
    : { [K in keyof OmitIndexSignature<T>]: NullFiltered<T[K]> }
  : T extends null
  ? undefined
  : T

export function filterNullRecursive<T extends object>(
  o?: T | null,
): FilterNullRecursiveReturnType<typeof o> {
  if (!o) {
    return undefined
  }

  if (Array.isArray(o)) {
    return o
      .map(filterNullRecursive)
      .filter(isDefined) as FilterNullRecursiveReturnType<typeof o>
  }
  const filtered = filterNull(o)

  if (!filtered) {
    return undefined
  }

  return Object.fromEntries(
    Object.entries(filtered).map(([k, v]) => {
      if (Array.isArray(v)) {
        return [k, v.map(filterNullRecursive)]
      }
      if (typeof v === "object" && v !== null) {
        return [k, filterNullRecursive(v as Record<PropertyKey, unknown>)]
      }
      return [k, v === null ? undefined : v]
    }),
  ) as FilterNullRecursiveReturnType<typeof o>
}

type NonNullable<T> = T extends null ? Exclude<T, null> : T

type NonNullFields<
  T extends Record<PropertyKey, any>,
  U = T | Nullish,
> = U extends Nullish // null or undefined returns undefined
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

export function filterNullFields<T extends Record<string, any>>(
  obj: Optional<T>,
): NonNullFields<T> {
  if (isNullish(obj)) {
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
export const createExtensions = async (knex: Knex) => {
  /*if (CIRCLECI) {
    return
  }*/
  const extensions = fs
    .readFileSync(path.resolve(__dirname, "../db/extensions"))
    .toString()
    .split("\n")
    .filter(Boolean)

  try {
    await knex.raw(`CREATE SCHEMA IF NOT EXISTS "${EXTENSION_PATH}";`)
    for (const extension of extensions) {
      await knex.raw(
        `CREATE EXTENSION IF NOT EXISTS "${extension}" SCHEMA "${EXTENSION_PATH}";`,
      )
    }
  } catch (error) {
    console.warn(
      "Error creating extensions. Ignore if this didn't fall on next hurdle",
      error,
    )
  }

  try {
    // if extensions already exist, but in another schema
    await knex.raw(`CREATE SCHEMA IF NOT EXISTS "${EXTENSION_PATH}";`)
    for (const extension of extensions) {
      await knex.raw(
        `ALTER EXTENSION "${extension}" SET SCHEMA "${EXTENSION_PATH}";`,
      )
    }
  } catch {
    // we can probably ignore this
  }
}

// https://github.com/prisma/prisma/issues/5042#issuecomment-1191275514
type A<T extends string> = T extends `${infer U}ScalarFieldEnum` ? U : never
type Entity = A<keyof typeof Prisma>
type Keys<T extends Entity> = Extract<
  keyof (typeof Prisma)[keyof Pick<typeof Prisma, `${T}ScalarFieldEnum`>],
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

export function emptyOrNullToUndefined<T>(value: T | Nullish): T | undefined {
  return isNullishOrEmpty(value) ? undefined : value
}

interface GetCourseInput {
  id?: string
  slug?: string
}

/**
 * Get course by id or slug, or course_alias course_code provided by slug.
 *
 * If slug is given, we also try to find a `course_alias` with that `course_code`.
 * Course found with slug is preferred to course found with course_code.
 */
export const getCourseOrAliasKnex =
  ({ knex }: BaseContext) =>
  async ({ id, slug }: GetCourseInput) => {
    if (!id && !slug) {
      throw new Error("provide at least one of id or slug")
    }

    if (id) {
      return knex<any, Course>("course").where({ id }).first()
    }

    const courses = await knex
      .select<any, Course[] | undefined>("course.*")
      .from("course")
      .leftJoin("course_alias", "course.id", "course_alias.course_id")
      .where("course.slug", slug)
      .orWhere("course_alias.course_code", slug)

    // prioritize course slug over course alias
    const slugCourse = courses?.filter((c) => c.slug === slug)?.[0]

    return slugCourse ?? courses?.[0]
  }
