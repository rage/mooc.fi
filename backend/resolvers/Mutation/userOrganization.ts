import { Prisma, UserOrganization, UUID } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { idArg, stringArg, arg } from "nexus/dist"
import checkAccess, { Role } from "../../accessControl"
import { ForbiddenError } from "apollo-server-core"
import { Context } from "/context"

const checkUser = async (ctx: Context, id: UUID) => {
  const { user, role } = ctx

  const existingUser = await ctx.prisma.userOrganization({ id }).user()

  if (!existingUser) {
    throw new Error("no such organization")
  }

  if ((!user && role !== Role.ADMIN) || (user && user.id !== existingUser.id)) {
    throw new ForbiddenError("can't delete that user organization")
  }
}

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

const updateUserOrganization = (t: PrismaObjectDefinitionBlock<"Mutation">) => {
  t.field("updateUserOrganization", {
    type: "UserOrganization",
    args: {
      id: idArg(),
      role: arg({ type: "OrganizationRole" }),
      organization_ids: idArg({ list: true }),
    },
    resolve: (_, args, ctx) => {
      checkAccess(ctx, { allowVisitors: true })

      const { id, role } = args

      checkUser(ctx, id)

      const prisma: Prisma = ctx.prisma

      return prisma.updateUserOrganization({
        data: {
          role,
        },
        where: {
          id,
        },
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

      const { id } = args
      checkUser(ctx, id)

      const prisma: Prisma = ctx.prisma

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
  updateUserOrganization(t)
  deleteUserOrganization(t)
}

export default addUserOrganizationMutations
