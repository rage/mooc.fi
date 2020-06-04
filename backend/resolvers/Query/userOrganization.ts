import { Prisma } from "../../generated/prisma-client"
import { idArg } from "@nexus/schema"
import { ObjectDefinitionBlock } from "@nexus/schema/dist/core"

const userOrganizations = async (t: ObjectDefinitionBlock<"Query">) => {
  t.list.field("userOrganizations", {
    type: "UserOrganization",
    args: {
      user_id: idArg(),
      organization_id: idArg(),
    },
    resolve: async (_, args, ctx) => {
      const { user_id, organization_id } = args
      const prisma: Prisma = ctx.prisma

      if (!user_id && !organization_id) {
        throw new Error("must provide at least one of user/organization id")
      }

      return prisma.userOrganizations({
        where: {
          user: {
            id: user_id,
          },
          organization: {
            id: organization_id,
          },
        },
      })
    },
  })
}

const addUserOrganizationQueries = (t: ObjectDefinitionBlock<"Query">) => {
  userOrganizations(t)
}

export default addUserOrganizationQueries
