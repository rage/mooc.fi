import { Prisma } from "@prisma/client"

import { Context } from "../context"
import { GraphQLUserInputError } from "../lib/errors"

export const getCourseOrCompletionHandlerCourse =
  (ctx: Context) =>
  async ({ id, slug }: Prisma.CourseWhereUniqueInput) => {
    if (!id && !slug) {
      throw new GraphQLUserInputError("must provide id and/or slug")
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

    if (!course && slug) {
      const courseFromAlias = await ctx.prisma.courseAlias
        .findUnique({
          where: {
            course_code: slug,
          },
        })
        .course({
          include: {
            completions_handled_by: true,
          },
        })
      return courseFromAlias?.completions_handled_by ?? courseFromAlias
    }

    return course?.completions_handled_by ?? course
  }
