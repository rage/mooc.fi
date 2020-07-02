import { ForbiddenError, UserInputError } from "apollo-server-errors"
import { intArg, stringArg, arg } from "@nexus/schema"
import { schema } from "nexus"
import { CompletionRegisteredWhereUniqueInput } from "@prisma/client"
import { isAdmin, isOrganization, or } from "../../../accessControl"

schema.extendType({
  type: "Query",
  definition(t) {
    t.crud.completionRegistereds({
      alias: "registeredCompletions",
      authorize: or(isOrganization, isAdmin),
    })

    t.list.field("registeredCompletions", {
      type: "CompletionRegistered",
      args: {
        course: stringArg(),
        skip: intArg(),
        take: intArg(),
        cursor: arg({ type: "CompletionRegisteredWhereUniqueInput" }),
      },
      authorize: or(isOrganization, isAdmin),
      resolve: async (_, args, ctx) => {
        const { course, skip, take, cursor } = args
        if ((take ?? 0) > 50) {
          throw new ForbiddenError("Cannot query more than 50 items")
        }
        if (course) {
          return await withCourse(
            course,
            skip ?? undefined,
            take ?? undefined,
            cursor ? { id: cursor.id ?? undefined } : undefined,
            ctx,
          )
        } else {
          return await all(
            skip ?? undefined,
            take ?? undefined,
            cursor ? { id: cursor.id ?? undefined } : undefined,
            ctx,
          )
        }
      },
    })
  },
})

const withCourse = async (
  course: string,
  skip: number | undefined,
  take: number | undefined,
  cursor: CompletionRegisteredWhereUniqueInput | undefined,
  ctx: NexusContext,
) => {
  let courseReference = await ctx.db.course.findOne({
    where: { slug: course },
  })

  if (!courseReference) {
    const courseFromAvoinCourse = await ctx.db.courseAlias
      .findOne({ where: { course_code: course } })
      .course()
    if (!courseFromAvoinCourse) {
      throw new UserInputError("Invalid course identifier")
    }

    // TODO: isn't this the same as courseFromAvoinCourse?
    courseReference = await ctx.db.course.findOne({
      where: { slug: courseFromAvoinCourse.slug },
    })
  }

  return await ctx.db.completionRegistered.findMany({
    where: {
      course_id: courseReference!.id,
    },
    skip,
    take,
    cursor,
  })
}

const all = async (
  skip: number | undefined,
  take: number | undefined,
  cursor: CompletionRegisteredWhereUniqueInput | undefined,
  ctx: NexusContext,
) => {
  return await ctx.db.completionRegistered.findMany({
    skip,
    take,
    cursor,
  })
}
