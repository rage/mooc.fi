import { idArg, booleanArg } from "@nexus/schema"
import { schema } from "nexus"
import { UserInputError } from "apollo-server-core"

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addCourseOrganization", {
      type: "course_organization",
      args: {
        course_id: idArg(),
        organization_id: idArg(),
        creator: booleanArg(),
      },
      resolve: async (_, args, ctx) => {
        const { course_id, organization_id, creator } = args

        if (!course_id || !organization_id) {
          throw new UserInputError("must provide course and organization")
        }
        const exists = ctx.db.course_organization.findMany({
          where: {
            course: course_id,
            organization: organization_id,
          },
        })

        if (exists) {
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
        id: idArg(),
      },
      resolve: async (_, args, ctx) => {
        const { id } = args

        if (!id) {
          throw new UserInputError("must provide id")
        }
        return ctx.db.course_organization.delete({ where: { id } })
      },
    })
  },
})
