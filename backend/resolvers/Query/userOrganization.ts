import { Prisma } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { idArg } from "nexus/dist"

const userOrganizations = async (t: PrismaObjectDefinitionBlock<"Query">) => {
  t.list.field("userOrganizations", {
    type: "UserOrganization",
    args: {
      user_id: idArg(),
      organization_id: idArg(),
    },
    resolve: async (_, args, ctx) => {
      const { user_id, organization_id } = args
      const prisma: Prisma = ctx.prisma

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

const addUserOrganizationQueries = (
  t: PrismaObjectDefinitionBlock<"Query">,
) => {
  userOrganizations(t)
}

export default addUserOrganizationQueries
