import { extendType, idArg, nonNull, objectType } from "nexus"

import { isAdmin, isUser, or, Role } from "../accessControl"
import {
  GraphQLAuthenticationError,
  GraphQLForbiddenError,
} from "../lib/errors"

export const CourseStatsSubscription = objectType({
  name: "CourseStatsSubscription",
  definition(t) {
    t.model.id()
    t.model.user_id()
    t.model.email_template_id()
    t.model.user()
    t.model.email_template()
    t.model.created_at()
    t.model.updated_at()
  },
})

export const CourseStatsSubscriptionMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createCourseStatsSubscription", {
      type: "CourseStatsSubscription",
      args: {
        id: nonNull(idArg()),
      },
      authorize: or(isUser, isAdmin),
      resolve: async (_, { id }, ctx) => {
        const { role, user } = ctx

        if (!user) {
          throw new GraphQLAuthenticationError("not logged in")
        }

        if (role !== Role.ADMIN) {
          const ownsCourse = await ctx.prisma.course.findFirst({
            select: { id: true },
            where: {
              course_stats_email_id: id,
              ownerships: { some: { user_id: user.id } },
            },
          })

          if (!ownsCourse) {
            throw new GraphQLForbiddenError(
              "subscribing requires ownership of a course using this template",
            )
          }
        }

        return ctx.prisma.courseStatsSubscription.create({
          data: {
            user: { connect: { id: user.id } },
            email_template: { connect: { id } },
          },
        })
      },
    })
    t.field("deleteCourseStatsSubscription", {
      type: "CourseStatsSubscription",
      args: {
        id: nonNull(idArg()),
      },
      authorize: or(isUser, isAdmin),
      resolve: async (_, { id }, ctx) => {
        const { role, user } = ctx

        if (role === Role.USER) {
          const ownsSubscription =
            await ctx.prisma.courseStatsSubscription.findFirst({
              where: {
                id,
                user: { id: user?.id },
              },
            })

          if (!ownsSubscription) {
            throw new GraphQLAuthenticationError(
              "this course stats subscription requires ownership",
            )
          }
        }

        return ctx.prisma.courseStatsSubscription.delete({
          where: {
            id,
          },
        })
      },
    })
  },
})
