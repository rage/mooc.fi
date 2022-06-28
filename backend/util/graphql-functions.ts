import { UserInputError } from "apollo-server-express"

import { Context } from "../context"

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
        throw new UserInputError("course or course alias not found")
      }
    }

    return course
  }

interface CourseUniqueIdentifier {
  id?: string
  slug?: string
}

export const getCourseOrCompletionHandlerCourse =
  (ctx: Context) =>
  async ({ id, slug }: CourseUniqueIdentifier) => {
    if (!id && !slug) {
      throw new UserInputError("must provide id and/or slug")
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
