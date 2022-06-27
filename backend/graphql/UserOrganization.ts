import { OrganizationRole } from "@prisma/client"
import { ForbiddenError } from "apollo-server-express"
import { arg, extendType, idArg, nonNull, objectType } from "nexus"

import { isAdmin, isVisitor, or, Role } from "../accessControl"
import { Context } from "../context"

export const UserOrganization = objectType({
  name: "UserOrganization",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.organization_id()
    t.model.organization()
    t.model.role()
    t.model.user_id()
    t.model.user()
  },
})

export const UserOrganizationQueries = extendType({
  type: "Query",
  definition(t) {
    t.list.field("userOrganizations", {
      type: "UserOrganization",
      args: {
        user_id: idArg(),
        organization_id: idArg(),
      },
      resolve: async (_, args, ctx) => {
        const { user_id, organization_id } = args

        let baseQuery
        if (user_id) {
          baseQuery = ctx.prisma.user.findUnique({
            where: { id: user_id },
          })
        } else if (organization_id) {
          baseQuery = ctx.prisma.organization.findUnique({
            where: { id: organization_id },
          })
        }
        if (!baseQuery) {
          throw new Error("must provide at least one of user/organization id")
        }

        return baseQuery.user_organizations({
          where: {
            user_id,
            organization_id,
          },
        })
      },
    })
  },
})

const checkUser = async (ctx: Context, id: any) => {
  const { user, role } = ctx

  let existingUser

  try {
    existingUser = await ctx.prisma.userOrganization
      .findUnique({ where: { id } })
      .user()
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

export const UserOrganizationMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addUserOrganization", {
      type: "UserOrganization",
      args: {
        user_id: nonNull(idArg()),
        organization_id: nonNull(idArg()),
      },
      authorize: or(isVisitor, isAdmin),
      resolve: async (_, args, ctx) => {
        const { user_id, organization_id } = args

        const exists = await ctx.prisma.userOrganization.findFirst({
          select: {
            id: true,
          },
          where: {
            user_id,
            organization_id,
          },
        })

        if (exists) {
          throw new Error("this user/organization relation already exists")
        }

        return ctx.prisma.userOrganization.create({
          data: {
            user: { connect: { id: user_id } },
            organization: {
              connect: { id: organization_id },
            },
            role: OrganizationRole.Student,
          },
        })
      },
    })

    t.field("updateUserOrganization", {
      type: "UserOrganization",
      args: {
        id: nonNull(idArg()),
        role: arg({ type: "OrganizationRole" }),
      },
      authorize: or(isVisitor, isAdmin),
      resolve: (_, args, ctx: Context) => {
        const { id, role } = args

        checkUser(ctx, id)

        return ctx.prisma.userOrganization.update({
          data: {
            role: { set: role ?? OrganizationRole.Student },
          },
          where: {
            id,
          },
        })
      },
    })

    t.field("deleteUserOrganization", {
      type: "UserOrganization",
      args: {
        id: nonNull(idArg()),
      },
      authorize: or(isVisitor, isAdmin),
      resolve: async (_, args, ctx: Context) => {
        const { id } = args
        checkUser(ctx, id)

        return ctx.prisma.userOrganization.delete({
          where: { id },
        })
      },
    })
  },
})
