import { schema } from "nexus"
import { idArg, booleanArg } from "@nexus/schema"
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
    t.crud.courseOrganizations({
      filtering: {
        course_id: true,
        organization_id: true,
      },
    })

    /*t.list.field("courseOrganizations", {
      type: "course_organization",
      args: {
        course_id: idArg(),
        organization_id: idArg(),
      },
      resolve: async (_, args, ctx) => {
        const { course_id, organization_id } = args

        return ctx.db.course_organization.findMany({
          where: {
            course: course_id,
            organization: organization_id,
          },
        })
      },
    })*/
  },
})

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCourseOrganization", {
      type: "CourseOrganization",
      args: {
        course_id: idArg({ required: true }),
        organization_id: idArg({ required: true }),
        creator: booleanArg(),
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
        id: idArg({ required: true }),
      },
      authorize: isAdmin,
      resolve: async (_, { id }, ctx) => {
        return ctx.db.courseOrganization.delete({ where: { id } })
      },
    })
  },
})
