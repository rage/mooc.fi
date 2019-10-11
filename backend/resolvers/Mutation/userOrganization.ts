import { Prisma, UUID, User } from "../../generated/prisma-client"
import { PrismaObjectDefinitionBlock } from "nexus-prisma/dist/blocks/objectType"
import { idArg, arg } from "nexus/dist"
import checkAccess, { Role } from "../../accessControl"
import { ForbiddenError } from "apollo-server-core"
import { Context } from "/context"

const checkUser = async (ctx: Context, id: UUID) => {
  const { user, role } = ctx

  let existingUser: User
  try {
    existingUser = await ctx.prisma.userOrganization({ id }).user()
  } catch {
    throw new Error("no such user/organization relation")
  }

  if (!existingUser) {
    throw new Error("relation has no user - wonder how that happened")
  }

  if (!user || (user && user.id !== existingUser.id && role !== Role.ADMIN)) {
    throw new ForbiddenError("invalid credentials to do that")
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

      const exists = prisma.$exists.userOrganization({
        user: { id: user_id },
        organization: { id: organization_id },
      })

      if (exists) {
        throw new Error("this user/organization relation already exists")
      }

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
