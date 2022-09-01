import { UserInputError } from "apollo-server-express"

import { Prisma } from "@prisma/client"

import { Context } from "../context"

export const getCourseOrCompletionHandlerCourse =
  (ctx: Context) =>
  async ({ id, slug }: Prisma.CourseWhereUniqueInput) => {
    if (!id && !slug) {
      throw new UserInputError("must provide id and/or slug")
    }

    // TODO: use course alias?
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
