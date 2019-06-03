import { ForbiddenError, UserInputError } from "apollo-server-core"
import { Course } from "../../generated/prisma-client"
import fetchCompletions from "../../middlewares/fetchCompletions"

const completions = async (_, args, ctx) => {
  if (!ctx.organization) {
    if (!ctx.user.administrator) {
      throw new ForbiddenError("Access Denied")
    }
  }
  const { first, after, last, before } = args
  let { course } = args
  if ((!first && !last) || (first > 50 || last > 50)) {
    ctx.disableRelations = true
  }
  const courseWithSlug: Course = await ctx.prisma.course({ slug: course })
  if (!courseWithSlug) {
    const courseFromAvoinCourse: Course = await ctx.prisma
      .CourseAlias({ course_code: course })
      .course()
    if (!courseFromAvoinCourse) {
      throw new UserInputError("Invalid course identifier")
    }
    course = courseFromAvoinCourse.slug
  }
  const completions = await fetchCompletions(
    { course, first, after, last, before },
    ctx,
  )

  return completions
}

export default completions
