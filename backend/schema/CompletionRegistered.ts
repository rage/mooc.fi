import { chunk } from "lodash"
import {
  arg,
  extendType,
  intArg,
  list,
  nonNull,
  objectType,
  stringArg,
} from "nexus"
import { type NexusGenInputs } from "nexus-typegen"

import { isAdmin, isOrganization, or } from "../accessControl"
import { Context } from "../context"
import { GraphQLForbiddenError } from "../lib/errors"
import { filterNullFields } from "../util"

export const CompletionRegistered = objectType({
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
    t.model.registration_date()
  },
})

/************************* QUERIES **********************/

export const CompletionRegisteredQueries = extendType({
  type: "Query",
  definition(t) {
    t.list.nonNull.field("registeredCompletions", {
      type: "CompletionRegistered",
      args: {
        course: stringArg({ description: "course slug or course alias" }),
        skip: intArg(),
        take: intArg(),
        cursor: arg({ type: "CompletionRegisteredWhereUniqueInput" }),
      },
      authorize: or(isOrganization, isAdmin),
      resolve: async (_, args, ctx) => {
        const { course: slug, skip, take, cursor } = args

        if ((take ?? 0) > 50) {
          throw new GraphQLForbiddenError("Cannot query more than 50 items")
        }

        const queryParams = {
          ...filterNullFields({
            skip,
            take,
          }),
          ...(cursor?.id && { cursor: { id: cursor.id } }),
        }

        if (slug) {
          return ctx.prisma.course
            .findUniqueOrAlias({
              where: {
                slug,
              },
            })
            .completions_registered(queryParams)
        }

        return ctx.prisma.completionRegistered.findMany(queryParams)
      },
    })
  },
})

/************************ MUTATIONS *********************/
export const CompletionRegisteredMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("registerCompletion", {
      type: "String",
      args: {
        completions: nonNull(list(nonNull(arg({ type: "CompletionArg" })))),
      },
      authorize: isOrganization,
      resolve: async (_, args, ctx: Context) => {
        const queue = chunk(args.completions, 500)

        for (const element of queue) {
          const promises = buildPromises(element, ctx)
          await Promise.all(promises)
        }
        return "success"
      },
    })
  },
})

const buildPromises = (
  array: Array<NexusGenInputs["CompletionArg"]>,
  ctx: Context,
) => {
  return array.map(async (entry) => {
    const completion = await ctx.prisma.completion.findUnique({
      where: { id: entry.completion_id },
      select: {
        course_id: true,
        user_id: true,
      },
    })

    const { course_id, user_id } = completion ?? {}

    if (!course_id || !user_id) {
      // TODO/FIXME: we now fail silently if course/user not found
      return Promise.resolve()
    }

    return ctx.prisma.completionRegistered.create({
      data: {
        completion: {
          connect: { id: entry.completion_id },
        },
        organization: {
          connect: { id: ctx.organization?.id },
        },
        course: { connect: { id: course_id } },
        real_student_number: entry.student_number,
        // TODO: where to get registration_date here?
        // receives CompletionArg as parameter! Is this used anywhere?
        user: { connect: { id: user_id } },
      },
    })
  })
}
