import { idArg } from "@nexus/schema"
import { schema } from "nexus"

schema.extendType({
  type: "Query",
  definition(t) {
    t.list.field("userOrganizations", {
      type: "user_organization",
      args: {
        user_id: idArg(),
        organization_id: idArg(),
      },
      resolve: async (_, args, ctx) => {
        const { user_id, organization_id } = args

        if (!user_id && !organization_id) {
          throw new Error("must provide at least one of user/organization id")
        }

        return ctx.db.user_organization.findMany({
          where: {
            user: user_id,
            organization: organization_id,
          },
        })
      },
    })
  },
})
