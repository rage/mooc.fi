import { ForbiddenError } from "apollo-server-express"
import {
  booleanArg,
  extendType,
  idArg,
  nonNull,
  objectType,
  stringArg,
} from "nexus"

import { OrganizationRole, User } from "@prisma/client"

import { isAdmin, isUser, or, Role } from "../accessControl"
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
    t.model.confirmed()
    t.model.confirmed_at()
    t.model.consented()
    t.model.user_organization_join_confirmations()
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
      authorize: or(isUser, isAdmin),
      resolve: async (_, args, ctx) => {
        // TODO/FIXME: admin could query all user organizations?
        const { user_id: user_id_param, organization_id } = args

        if (
          user_id_param &&
          user_id_param !== ctx.user?.id &&
          ctx.role !== Role.ADMIN
        ) {
          throw new ForbiddenError("invalid credentials to do that")
        }

        const user_id = user_id_param ?? ctx.user?.id

        if (!user_id) {
          throw new Error("no user id")
        }

        return ctx.prisma.user
          .findUnique({
            where: { id: user_id },
          })
          .user_organizations({
            where: {
              user_id: user_id ?? ctx.user!.id,
              organization_id,
            },
          })
      },
    })
  },
})

const checkUserCredentials = async (ctx: Context, id: any) => {
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
        user_id: idArg(),
        organization_id: nonNull(idArg()),
        email: stringArg(),
        redirect: stringArg(),
        language: stringArg(),
      },
      authorize: or(isUser, isAdmin),
      resolve: async (
        _,
        { user_id, organization_id, email, redirect, language },
        ctx,
      ) => {
        let user: User | null

        if (user_id && user_id !== ctx.user?.id) {
          if (ctx.role !== Role.ADMIN) {
            throw new ForbiddenError("invalid credentials to do that")
          }

          user = await ctx.prisma.user.findUnique({
            where: { id: user_id },
          })
        } else {
          user = ctx.user ?? null
        }

        if (!user) {
          throw new Error("no such user")
        }

        const organization = await ctx.prisma.organization.findUnique({
          where: { id: organization_id },
        })

        if (!organization) {
          throw new Error("no such organization")
        }

        const exists = await ctx.prisma.userOrganization.findFirst({
          select: {
            id: true,
          },
          where: {
            user_id: user.id,
            organization_id,
          },
        })

        if (exists) {
          throw new Error("this user/organization relation already exists")
        }

        const confirmed = !organization.required_confirmation

        const userOrganization = await ctx.prisma.userOrganization.create({
          data: {
            user: { connect: { id: user.id } },
            organization: {
              connect: { id: organization_id },
            },
            role: OrganizationRole.Student,
            confirmed,
            ...(confirmed ? { confirmed_at: new Date() } : {}),
            // we assume that the consent is given in the frontend
            consented: true,
          },
        })

        if (!confirmed) {
          const emailToSendTo = email ?? user.email
          if (!emailToSendTo) {
            throw new Error(
              "no email specified and no email found in user profile",
            )
          }

          const {
            required_organization_email,
            join_organization_email_template_id,
          } = organization

          if (required_organization_email) {
            if (!emailToSendTo.match(required_organization_email)) {
              throw new Error("user email does not match organization email")
            }
          }

          if (!join_organization_email_template_id) {
            throw new Error(
              "no email template associated with this organization",
            )
          }

          // TODO: wonder if we can ever run into a race condition where the email delivery
          // exists before the join confirmation and the template doesn't find it?
          await ctx.prisma.userOrganizationJoinConfirmation.create({
            data: {
              email: emailToSendTo,
              user_organization: { connect: { id: userOrganization.id } },
              email_delivery: {
                create: {
                  user_id: user.id,
                  email: emailToSendTo,
                  email_template_id: join_organization_email_template_id,
                  organization_id,
                  sent: false,
                  error: false,
                },
              },
              redirect,
              language,
              expires_at: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours for now
            },
          })
        }

        return userOrganization
      },
    })

    t.field("updateUserOrganization", {
      type: "UserOrganization",
      args: {
        id: nonNull(idArg()),
        consented: nonNull(booleanArg()),
      },
      authorize: or(isUser, isAdmin),
      resolve: async (_, { id, consented }, ctx: Context) => {
        await checkUserCredentials(ctx, id)

        return ctx.prisma.userOrganization.update({
          data: {
            ...(consented !== null && typeof consented !== "undefined"
              ? { consented: { set: consented } }
              : {}),
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
      authorize: or(isUser, isAdmin),
      resolve: async (_, args, ctx: Context) => {
        const { id } = args

        await checkUserCredentials(ctx, id)

        return ctx.prisma.userOrganization.delete({
          where: { id },
        })
      },
    })
  },
})
