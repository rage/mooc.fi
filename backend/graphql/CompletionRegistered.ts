import { schema } from "nexus"
import { chunk } from "lodash"
import { or, isOrganization, isAdmin } from "../accessControl"
import { ForbiddenError, UserInputError } from "apollo-server-core"
import { CompletionRegisteredWhereUniqueInput } from "@prisma/client"

schema.objectType({
  name: "CompletionRegistered",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.completion_id()
    t.model.course_id()
    t.model.organization_id()
    t.model.real_student_number()
    t.model.user_id()
    t.model.completion()
    t.model.course()
    t.model.organization()
    t.model.user()
  },
})

/************************* QUERIES **********************/

schema.extendType({
  type: "Query",
  definition(t) {
    t.list.field("registeredCompletions", {
      type: "CompletionRegistered",
      args: {
        course: schema.stringArg(),
        skip: schema.intArg(),
        take: schema.intArg(),
        cursor: schema.arg({ type: "CompletionRegisteredWhereUniqueInput" }),
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

/************************ MUTATIONS *********************/
schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("registerCompletion", {
      type: "String",
      args: {
        completions: schema.arg({ type: "CompletionArg", list: true }),
      },
      authorize: isOrganization,
      resolve: async (_, args, ctx: NexusContext) => {
        let queue = chunk(args.completions, 500)

        for (let i = 0; i < queue.length; i++) {
          const promises = buildPromises(queue[i], ctx)
          await Promise.all(promises)
        }
        return "success"
      },
    })
  },
})

const buildPromises = (array: any[], ctx: NexusContext) => {
  return array.map(async (entry) => {
    const course = await ctx.db.completion
      .findOne({ where: { id: entry.completion_id } })
      .course()
    const user = await ctx.db.completion
      .findOne({ where: { id: entry.completion_id } })
      .user()

    if (!course || !user) {
      // TODO/FIXME: we now fail silently if course/user not found
      return Promise.resolve()
    }

    return ctx.db.completionRegistered.create({
      data: {
        completion: {
          connect: { id: entry.completion_id },
        },
        organization: {
          connect: { id: ctx.organization?.id },
        },
        course: { connect: { id: course.id } },
        real_student_number: entry.student_number,
        user: { connect: { id: user.id } },
      },
    })
  })
}
