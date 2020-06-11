import { idArg } from "@nexus/schema"
import { schema } from "nexus"

schema.extendType({
  type: "Query",
  definition(t) {
    t.crud.courseOrganizations({
      filtering: {
        course: true,
        organization: true,
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
