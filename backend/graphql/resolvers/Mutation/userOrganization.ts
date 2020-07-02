import { idArg, arg } from "@nexus/schema"
import { ForbiddenError } from "apollo-server-errors"
import { NexusContext } from "/context"
import { schema } from "nexus"
import { Role, or, isVisitor, isAdmin } from "../../../accessControl"
import { OrganizationRole } from "@prisma/client"

const checkUser = async (ctx: NexusContext, id: any) => {
  const { user, role } = ctx

  let existingUser

  try {
    existingUser = await ctx.db.userOrganization
      .findOne({ where: { id } })
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

schema.extendType({
  type: "Mutation",
  definition(t) {
    t.field("addUserOrganization", {
      type: "UserOrganization",
      args: {
        user_id: idArg({ required: true }),
        organization_id: idArg({ required: true }),
      },
      authorize: or(isVisitor, isAdmin),
      resolve: async (_, args, ctx) => {
        const { user_id, organization_id } = args

        const exists =
          (
            await ctx.db.userOrganization.findMany({
              where: {
                user_id,
                organization_id,
              },
            })
          ).length > 0

        if (exists) {
          throw new Error("this user/organization relation already exists")
        }

        return ctx.db.userOrganization.create({
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
        id: idArg({ required: true }),
        /*       userId: idArg(),
        organizationId: idArg(), */
        role: arg({ type: "OrganizationRole" }),
      },
      authorize: or(isVisitor, isAdmin),
      resolve: (_, args, ctx: NexusContext) => {
        const { id, role } = args

        checkUser(ctx, id)

        return ctx.db.userOrganization.update({
          data: {
            role: role ? role : OrganizationRole.Student,
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
        id: idArg({ required: true }),
      },
      authorize: or(isVisitor, isAdmin),
      resolve: async (_, args, ctx: NexusContext) => {
        const { id } = args
        checkUser(ctx, id)

        return ctx.db.userOrganization.delete({
          where: { id },
        })
      },
    })
  },
})
