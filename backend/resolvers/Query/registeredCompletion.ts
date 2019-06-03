import { ForbiddenError, UserInputError } from "apollo-server-core"
import { Course } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { intArg, stringArg, idArg } from "nexus/dist"

const registeredCompletions = async (
  t: PrismaObjectDefinitionBlock<"Query">,
) => {
  t.list.field("registeredCompletions", {
    type: "CompletionRegistered",
    args: {
      course: stringArg(),
      first: intArg(),
      after: idArg(),
      last: intArg(),
      before: idArg(),
    },
    resolve: async (_, args, ctx) => {
      if (!ctx.organization) {
        if (!ctx.user.administrator) {
          throw new ForbiddenError("Access Denied")
        }
      }
      const { course, first, after, last, before } = args
      if ((!first && !last) || (first > 50 || last > 50)) {
        throw new ForbiddenError("Cannot query more than 50 items")
      }
      if (course) {
        return await withCourse(course, first, after, last, before, ctx)
      } else {
        return await all(first, after, last, before, ctx)
      }
    },
  })
}

const withCourse = async (course, first, after, last, before, ctx) => {
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
  const courseReference: Course = await ctx.prisma.course({ slug: course })
  return await ctx.prisma.completionRegistereds({
    where: {
      course: courseReference,
    },
    first: first,
    after: after,
    last: last,
    before: before,
  })
}

const all = async (first, after, last, before, ctx) => {
  return await ctx.prisma.completionRegistereds({
    first: first,
    after: after,
    last: last,
    before: before,
  })
}

const addCompletionRegisteredQueries = (
  t: PrismaObjectDefinitionBlock<"Query">,
) => {
  registeredCompletions(t)
}

export default addCompletionRegisteredQueries
