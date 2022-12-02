import { booleanArg, extendType, idArg, nonNull, objectType } from "nexus"

import { isAdmin, isVisitor, or } from "../accessControl"

export const CourseOrganization = objectType({
  name: "CourseOrganization",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.course_id()
    t.model.course()
    t.model.creator()
    t.model.organization_id()
    t.model.organization()
  },
})

export const CourseOrganizationQueries = extendType({
  type: "Query",
  definition(t) {
    t.list.nonNull.field("courseOrganizations", {
      type: "CourseOrganization",
      args: {
        course_id: idArg(),
        organization_id: idArg(),
      },
      resolve: async (_, args, ctx) => {
        const { course_id, organization_id } = args

        return ctx.prisma.courseOrganization.findMany({
          where: {
            course_id: course_id ?? undefined,
            organization_id: organization_id ?? undefined,
          },
        })
      },
    })
  },
})

export const CourseOrganizationMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCourseOrganization", {
      type: "CourseOrganization",
      args: {
        course_id: nonNull(idArg()),
        organization_id: nonNull(idArg()),
        creator: booleanArg(),
      },
      authorize: or(isVisitor, isAdmin),
      resolve: async (_, args, ctx) => {
        const { course_id, organization_id, creator } = args

        const exists = await ctx.prisma.courseOrganization.findMany({
          where: {
            course_id: course_id,
            organization_id: organization_id,
          },
        })

        if (exists.length > 0) {
          throw new Error("this course/organization relation already exists")
        }

        return ctx.prisma.courseOrganization.create({
          data: {
            course: { connect: { id: course_id } },
            organization: {
              connect: { id: organization_id },
            },
            creator: creator ? creator : false,
          },
        })
      },
    })

    t.field("deleteCourseOrganization", {
      type: "CourseOrganization",
      args: {
        id: nonNull(idArg()),
      },
      authorize: isAdmin,
      resolve: async (_, { id }, ctx) => {
        return ctx.prisma.courseOrganization.delete({ where: { id } })
      },
    })
  },
})
