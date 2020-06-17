import { ForbiddenError, UserInputError } from "apollo-server-core"
import { intArg, stringArg, idArg } from "@nexus/schema"
import { schema } from "nexus"

schema.extendType({
  type: "Query",
  definition(t) {
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
  },
})

const withCourse = async (
  course: string,
  first: number | undefined,
  after: string | undefined,
  last: number | undefined,
  before: string | undefined,
  ctx: NexusContext,
) => {
  let courseReference = await ctx.db.course.findOne({
    where: { slug: course },
  })

  if (!courseReference) {
    const courseFromAvoinCourse = await ctx.db.course_alias
      .findOne({ where: { course_code: course } })
      .course_courseTocourse_alias()
    if (!courseFromAvoinCourse) {
      throw new UserInputError("Invalid course identifier")
    }

    // TODO: isn't this the same as courseFromAvoinCourse?
    courseReference = await ctx.db.course.findOne({
      where: { slug: courseFromAvoinCourse.slug },
    })
  }

  return await ctx.db.completion_registered.findMany({
    where: {
      course: courseReference!.id,
    },
    first: first ?? undefined,
    after: after ? { id: after } : undefined,
    last: last ?? undefined,
    before: before ? { id: before } : undefined,
  })
}

const all = async (
  first: number | undefined,
  after: string | undefined,
  last: number | undefined,
  before: string | undefined,
  ctx: NexusContext,
) => {
  return await ctx.db.completion_registered.findMany({
    first: first ?? undefined,
    after: after ? { id: after } : undefined,
    last: last ?? undefined,
    before: before ? { id: before } : undefined,
  })
}
