import { idArg, arg } from "@nexus/schema"
import { ForbiddenError } from "apollo-server-errors"
import { NexusContext } from "/context"
import { schema } from "nexus"
import { Role } from "../../../accessControl"
import { organization_role } from "@prisma/client"

const checkUser = async (ctx: NexusContext, id: any) => {
  const { user, role } = ctx

  let existingUser

  try {
    existingUser = await ctx.db.user_organization
      .findOne({ where: { id } })
      .user_userTouser_organization()
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
      type: "user_organization",
      args: {
        user_id: idArg({ required: true }),
        organization_id: idArg({ required: true }),
      },
      resolve: async (_, args, ctx) => {
        const { user_id, organization_id } = args

        const exists =
          (
            await ctx.db.user_organization.findMany({
              where: {
                user: user_id,
                organization: organization_id,
              },
            })
          ).length > 0

        if (exists) {
          throw new Error("this user/organization relation already exists")
        }

        return ctx.db.user_organization.create({
          data: {
            user_userTouser_organization: { connect: { id: user_id } },
            organization_organizationTouser_organization: {
              connect: { id: organization_id },
            },
            role: organization_role.Student,
          },
        })
      },
    })

    t.field("updateUserOrganization", {
      type: "user_organization",
      args: {
        id: idArg({ required: true }),
        /*       userId: idArg(),
        organizationId: idArg(), */
        role: arg({ type: "organization_role" }),
      },
      resolve: (_, args, ctx: NexusContext) => {
        const { id, role } = args

        checkUser(ctx, id)

        return ctx.db.user_organization.update({
          data: {
            role: role ? role : organization_role.Student,
          },
          where: {
            id,
          },
        })
      },
    })

    t.field("deleteUserOrganization", {
      type: "user_organization",
      args: {
        id: idArg({ required: true }),
      },
      resolve: async (_, args, ctx: NexusContext) => {
        const { id } = args
        checkUser(ctx, id)

        return ctx.db.user_organization.delete({
          where: { id },
        })
      },
    })
  },
})
