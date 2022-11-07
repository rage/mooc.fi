import { UserInputError } from "apollo-server-express"
import { Knex } from "knex"
import { omit } from "lodash"

import { Course, Prisma, PrismaClient } from "@prisma/client"

import { EXTENSION_PATH } from "../config"
import { BaseContext } from "../context"
import { isNullOrUndefined } from "./isNullOrUndefined"
import { notEmpty } from "./notEmpty"

const flatten = <T>(arr: T[]) =>
  arr.reduce<T[]>((acc, val) => acc.concat(val), [])
const titleCase = (s?: string) =>
  s && s.length > 0
    ? s.toLowerCase()[0].toUpperCase() + s.toLowerCase().slice(1)
    : undefined

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

export const buildUserSearch = (
  search?: string | null,
): Prisma.UserWhereInput => {
  if (isNullOrUndefined(search)) {
    return {}
  }

  const possibleNameCombinations = getNameCombinations(search)

  const userSearchQuery: Prisma.UserWhereInput["OR"] = [
    {
      first_name: { contains: search, mode: "insensitive" },
    },
    {
      last_name: { contains: search, mode: "insensitive" },
    },
    {
      username: { contains: search, mode: "insensitive" },
    },
    {
      email: { contains: search, mode: "insensitive" },
    },
    {
      student_number: { contains: search },
    },
    {
      real_student_number: { contains: search },
    },
  ]

  const searchAsNumber = parseInt(search)

  if (!isNaN(searchAsNumber)) {
    userSearchQuery.push({
      upstream_id: searchAsNumber,
    })
  }

  if (possibleNameCombinations.length) {
    possibleNameCombinations.forEach(({ first_name, last_name }) => {
      userSearchQuery.push({
        first_name: { contains: first_name, mode: "insensitive" },
        last_name: { contains: last_name, mode: "insensitive" },
      })
    })
  }

  return {
    OR: userSearchQuery,
  }
}

export const buildSearch = (fields: string[], search?: string) =>
  search
    ? flatten(
        fields.map((f) => [
          { [f]: { contains: search } },
          { [f]: { contains: titleCase(search) } },
          { [f]: { contains: search.toLowerCase() } },
        ]),
      )
    : undefined

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
  { first, last, before, after, skip }: ConvertPaginationInput,
  options?: ConvertPaginationOptions,
): ConvertPaginationOutput => {
  const skipValue = skip || 0
  const { field = "id" } = options ?? {}

  if (!first && !last) {
    throw new Error("first or last must be defined")
  }

  return {
    skip: notEmpty(before) ? skipValue + 1 : skipValue,
    take: notEmpty(last) ? -(last ?? 0) : notEmpty(first) ? first : 0,
    cursor: notEmpty(before)
      ? { [field]: before }
      : notEmpty(after)
      ? { [field]: after }
      : undefined,
  }
}

export const filterNull = <T>(o: T): T | undefined =>
  o
    ? Object.entries(o).reduce(
        (acc, [k, v]) => ({ ...acc, [k]: v == null ? undefined : v }),
        {} as T,
      )
    : undefined

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

export const createExtensions = async (knex: Knex) => {
  /*if (CIRCLECI) {
    return
  }*/

  try {
    await knex.raw(`CREATE SCHEMA IF NOT EXISTS "${EXTENSION_PATH}";`)
    await knex.raw(
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA "${EXTENSION_PATH}";`,
    )
    await knex.raw(
      `CREATE EXTENSION IF NOT EXISTS "pg_trgm" SCHEMA "${EXTENSION_PATH}";`,
    )
    await knex.raw(
      `CREATE EXTENSION IF NOT EXISTS "btree_gin" SCHEMA "${EXTENSION_PATH}";`,
    )
  } catch (error) {
    console.warn(
      "Error creating extensions. Ignore if this didn't fall on next hurdle",
      error,
    )
  }

  try {
    // if extensions already exist, but in another schema
    await knex.raw(`CREATE SCHEMA IF NOT EXISTS "${EXTENSION_PATH}";`)
    await knex.raw(
      `ALTER EXTENSION "uuid-ossp" SET SCHEMA "${EXTENSION_PATH}";`,
    )
    await knex.raw(`ALTER EXTENSION "pg_trgm" SET SCHEMA "${EXTENSION_PATH}";`)
    await knex.raw(
      `ALTER EXTENSION "btree_gin" SET SCHEMA "${EXTENSION_PATH}";`,
    )
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
    // TODO: actually accept both id and slug?
    if ((!id && !slug) || (id && slug)) {
      throw new Error("provide exactly one of id or slug")
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

type InferPrismaClientGlobalReject<C extends PrismaClient> =
  C extends PrismaClient<any, any, infer GlobalReject> ? GlobalReject : never

type FindUniqueCourseType<ClientType extends PrismaClient> =
  Prisma.CourseDelegate<InferPrismaClientGlobalReject<ClientType>>["findUnique"]

/**
 * Get course by id or slug, or course_alias course_code provided by slug.
 *
 * If slug is given, we also try to find a `course_alias` with that `course_code`.
 * Course found with slug is preferred to course found with course_code.
 */
export const getCourseOrAlias = <T extends Prisma.CourseFindUniqueArgs>(
  ctx: BaseContext,
) =>
  ((args: Prisma.SelectSubset<T, Prisma.CourseFindUniqueArgs>) => {
    const { id, slug } = args?.where ?? {}
    const { select, include } = args ?? {}

    if (!id && !slug) {
      throw new UserInputError("You must provide either an id or a slug")
    }

    if (include && select) {
      throw new UserInputError("Only provide one of include or select")
    }

    if (id) {
      return ctx.prisma.course.findUnique({
        where: {
          id,
          slug: slug ?? undefined,
        },
        ...omit(args, "where"),
      })
    }

    const course = ctx.prisma.course.findUnique({
      where: {
        slug,
      },
      ...omit(args, "where"),
    })

    if (course) {
      return course
    }

    const selectOrInclude: {
      select?: Prisma.CourseSelect | null
      include?: Prisma.CourseInclude | null
    } = include ? { include } : { select }

    const alias = ctx.prisma.courseAlias
      .findUnique({
        where: {
          course_code: slug,
        },
      })
      .course({
        ...selectOrInclude,
      })

    return alias
  }) as FindUniqueCourseType<typeof ctx["prisma"]>
// we're telling TS that this is a course findUnique when in reality
// it isn't strictly speaking. But it's close enough for our purposes
// to get the type inference we want.
