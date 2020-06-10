import { ForbiddenError, UserInputError } from "apollo-server-core"
import { Course, Maybe } from "../../../generated/prisma-client"
import { intArg, stringArg, idArg } from "@nexus/schema"
import checkAccess from "../../../accessControl"
import { Context } from "/context"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const registeredCompletions = async (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("registeredCompletions", {
    type: "completion_registered",
    args: {
      course: stringArg(),
      first: intArg(),
      after: idArg(),
      last: intArg(),
      before: idArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx, { allowOrganizations: true })
      const { course, first, after, last, before } = args
      if ((!first && !last) || (first ?? 0) > 50 || (last ?? 0) > 50) {
        throw new ForbiddenError("Cannot query more than 50 items")
      }
      if (course) {
        return await withCourse(
          course,
          first ?? undefined,
          after ?? undefined,
          last ?? undefined,
          before ?? undefined,
          ctx,
        )
      } else {
        return await all(
          first ?? undefined,
          after ?? undefined,
          last ?? undefined,
          before ?? undefined,
          ctx,
        )
      }
    },
  })
}

const withCourse = async (
  course: string,
  first: number | undefined,
  after: string | undefined,
  last: number | undefined,
  before: string | undefined,
  ctx: Context,
) => {
  const courseWithSlug: Maybe<Course> = await ctx.prisma.course({
    slug: course,
  })

  if (!courseWithSlug) {
    const courseFromAvoinCourse: Course = await ctx.prisma
      .courseAlias({ course_code: course })
      .course()
    if (!courseFromAvoinCourse) {
      throw new UserInputError("Invalid course identifier")
    }
    course = courseFromAvoinCourse.slug
  }

  const courseReference: Maybe<Course> = await ctx.prisma.course({
    slug: course,
  })
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

const all = async (
  first: number | undefined,
  after: string | undefined,
  last: number | undefined,
  before: string | undefined,
  ctx: Context,
) => {
  return await ctx.prisma.completionRegistereds({
    first: first,
    after: after,
    last: last,
    before: before,
  })
}

const addCompletionRegisteredQueries = (t: ObjectDefinitionBlock<"Query">) => {
  registeredCompletions(t)
}

export default addCompletionRegisteredQueries
