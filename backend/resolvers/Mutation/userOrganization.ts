import { Prisma, UserOrganization } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { idArg, stringArg } from "nexus/dist"
import checkAccess, { Role } from "../../accessControl"
import { ForbiddenError } from "apollo-server-core"

const addUserOrganization = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("addUserOrganization", {
    type: "UserOrganization",
    args: {
      user_id: idArg({ required: true }),
      organization_id: idArg({ required: true }),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx, { allowVisitors: true })

      const { user_id, organization_id } = args
      const prisma: Prisma = ctx.prisma

      return prisma.createUserOrganization({
        user: { connect: { id: user_id } },
        organization: { connect: { id: organization_id } },
        role: "Student",
      })
    },
  })
}

const deleteUserOrganization = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("deleteUserOrganization", {
    type: "UserOrganization",
    args: {
      id: idArg(),
    },
    resolve: async (_, args, ctx) => {
      checkAccess(ctx, { allowVisitors: true })

      // TODO: check if user is same as removable id from context
      const { id } = args
      const prisma: Prisma = ctx.prisma
      const { user, role } = ctx

      const existingUser = await prisma.userOrganization({ id }).user()

      if (!existingUser) {
        throw new Error("no such organization")
      }

      if (
        (!user && role !== Role.ADMIN) ||
        (user && user.id !== existingUser.id)
      ) {
        throw new ForbiddenError("can't delete that user organization")
      }

      return prisma.deleteUserOrganization({
        id,
      })
    },
  })
}

const addUserOrganizationMutations = (
  t: PrismaObjectDefinitionBlock<"Mutation">,
) => {
  addUserOrganization(t)
  deleteUserOrganization(t)
}

export default addUserOrganizationMutations
