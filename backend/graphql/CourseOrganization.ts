import { schema } from "nexus"

import { or, isVisitor, isAdmin } from "../accessControl"

schema.objectType({
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

schema.extendType({
  type: "Query",
  definition(t) {
    t.list.field("courseOrganizations", {
      type: "CourseOrganization",
      args: {
        course_id: schema.idArg(),
        organization_id: schema.idArg(),
      },
      resolve: async (_, args, ctx) => {
        const { course_id, organization_id } = args

        return ctx.db.courseOrganization.findMany({
          where: {
            course_id: course_id ?? undefined,
            organization_id: organization_id ?? undefined,
          },
        })
      },
    })
  },
})

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCourseOrganization", {
      type: "CourseOrganization",
      args: {
        course_id: schema.idArg({ required: true }),
        organization_id: schema.idArg({ required: true }),
        creator: schema.booleanArg(),
      },
      authorize: or(isVisitor, isAdmin),
      resolve: async (_, args, ctx) => {
        const { course_id, organization_id, creator } = args

        const exists = await ctx.db.courseOrganization.findMany({
          where: {
            course_id: course_id,
            organization_id: organization_id,
          },
        })

        if (exists.length > 0) {
          throw new Error("this course/organization relation already exists")
        }

        return ctx.db.courseOrganization.create({
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
        id: schema.idArg({ required: true }),
      },
      authorize: isAdmin,
      resolve: async (_, { id }, ctx) => {
        return ctx.db.courseOrganization.delete({ where: { id } })
      },
    })
  },
})
