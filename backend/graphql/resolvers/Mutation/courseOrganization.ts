import { idArg, booleanArg } from "@nexus/schema"
import { schema } from "nexus"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCourseOrganization", {
      type: "course_organization",
      args: {
        course_id: idArg({ required: true }),
        organization_id: idArg({ required: true }),
        creator: booleanArg(),
      },
      resolve: async (_, args, ctx) => {
        const { course_id, organization_id, creator } = args

        const exists = await ctx.db.course_organization.findMany({
          where: {
            course: course_id,
            organization: organization_id,
          },
        })

        if (exists.length > 0) {
          throw new Error("this course/organization relation already exists")
        }

        return ctx.db.course_organization.create({
          data: {
            course_courseTocourse_organization: { connect: { id: course_id } },
            organization_course_organizationToorganization: {
              connect: { id: organization_id },
            },
            creator: creator ? creator : false,
          },
        })
      },
    })

    t.field("deleteCourseOrganization", {
      type: "course_organization",
      args: {
        id: idArg({ required: true }),
      },
      resolve: async (_, { id }, ctx) => {
        return ctx.db.course_organization.delete({ where: { id } })
      },
    })
  },
})
