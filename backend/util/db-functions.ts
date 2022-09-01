import { UserInputError } from "apollo-server-express"
import { Knex } from "knex"
import { omit } from "lodash"

import { Course, Prisma, PrismaClient } from "@prisma/client"

import { CIRCLECI } from "../config"
import { BaseContext } from "../context"
import { isEmptyNullOrUndefined, isNull, isNullOrUndefined } from "./guards"

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

export const getCourseOrCompletionHandlerCourse =
  (ctx: BaseContext) =>
  async ({ id, slug }: Prisma.CourseWhereUniqueInput) => {
    if (!id && !slug) {
      throw new UserInputError("must provide id and/or slug", {
        argumentName: ["id", "slug"],
      })
    }

    const course = await ctx.prisma.course.findUnique({
      where: {
        id,
        slug,
      },
      include: {
        completions_handled_by: true,
      },
    })

    return course?.completions_handled_by ?? course
  }
