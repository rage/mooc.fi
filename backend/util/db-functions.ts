import fs from "fs"
import path from "path"

import { Knex } from "knex"

import { Course, Prisma } from "@prisma/client"

import { EXTENSION_PATH } from "../config"
import { BaseContext } from "../context"
import { isNullOrUndefined } from "./isNullOrUndefined"
import { notEmpty } from "./notEmpty"

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
  if (isNullOrUndefined(search)) {
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

  if (notEmpty(before)) {
    skip += 1
    cursor = { [field]: before }
  } else if (notEmpty(after)) {
    cursor = { [field]: after }
  }
  if (notEmpty(last)) {
    take = -(last ?? 0)
  } else if (notEmpty(first)) {
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
  ? Array<NullFiltered<R>>
  : T extends Record<string | symbol | number, unknown>
  ? {
      [K in keyof T]: NullFiltered<T[K]>
    }
  : T

export const filterNull = <T extends Record<string | symbol | number, unknown>>(
  o?: T | null,
): NullFiltered<T> | undefined =>
  o
    ? (Object.fromEntries(
        Object.entries(o).map(([k, v]) => [k, v === null ? undefined : v]),
      ) as NullFiltered<T>)
    : undefined

export const filterNullRecursive = <
  T extends Record<string | symbol | number, unknown>,
>(
  o?: T | null,
): NullFiltered<T> | undefined => {
  if (!o) {
    return undefined
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
        return [
          k,
          filterNullRecursive(v as Record<string | symbol | number, unknown>),
        ]
      }
      return [k, v === null ? undefined : v]
    }),
  ) as NullFiltered<T>
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
