import { UserInputError } from "apollo-server-express"

import { Prisma } from "@prisma/client"

import { Context } from "../../context"
import { isDefined, isNullOrUndefined } from "../../util"

export const buildUserSearch = (
  search?: string | null,
): Prisma.UserWhereInput => {
  if (isNullOrUndefined(search)) {
    return {}
  }
  return {
    OR: [
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
        user_organizations: {
          some: {
            organizational_email: { contains: search, mode: "insensitive" },
          },
        },
      },
      {
        student_number: { contains: search },
      },
      {
        real_student_number: { contains: search },
      },
      {
        upstream_id: parseInt(search) || undefined,
      },
    ],
  }
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
  { first, last, before, after, skip }: ConvertPaginationInput,
  options?: ConvertPaginationOptions,
): ConvertPaginationOutput => {
  const skipValue = skip || 0
  const { field = "id" } = options || {}

  if (!first && !last) {
    throw new Error("first or last must be defined")
  }

  return {
    skip: isDefined(before) ? skipValue + 1 : skipValue,
    take: isDefined(last) ? -(last ?? 0) : isDefined(first) ? first : 0,
    cursor: isDefined(before)
      ? { [field]: before }
      : isDefined(after)
      ? { [field]: after }
      : undefined,
  }
}

export const getCourseOrAliasBySlug =
  (ctx: Context) => async (slug: string) => {
    let course = await ctx.prisma.course.findUnique({
      where: { slug },
    })

    if (!course) {
      course = await ctx.prisma.courseAlias
        .findUnique({
          where: {
            course_code: slug,
          },
        })
        .course()

      if (!course) {
        throw new UserInputError("course or course alias not found", {
          argumentName: "slug",
        })
      }
    }

    return course
  }

export const getCourseOrCompletionHandlerCourse =
  (ctx: Context) =>
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
