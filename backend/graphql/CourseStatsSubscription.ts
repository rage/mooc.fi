import { extendType, idArg, nonNull, objectType } from "nexus"

import { isAdmin, isUser, or, Role } from "../accessControl"

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
        const { user } = ctx
        return await ctx.prisma.courseStatsSubscription.create({
          data: {
            user: { connect: { id: user?.id } },
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
          const ownsSubscription = await ctx.prisma.courseStatsSubscription.findFirst(
            {
              where: {
                id,
                user: { id: user?.id },
              },
            },
          )

          if (!ownsSubscription) {
            throw new Error("You do not own this subscription")
          }
        }

        return await ctx.prisma.courseStatsSubscription.delete({
          where: {
            id,
          },
        })
      },
    })
  },
})
