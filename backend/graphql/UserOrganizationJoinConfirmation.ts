import { extendType, idArg, nonNull, objectType, stringArg } from "nexus"

import { isAdmin, isUser, or } from "../accessControl"
import { calculateActivationCode } from "../util/calculate-activation-code"

export const UserOrganizationJoinConfirmation = objectType({
  name: "UserOrganizationJoinConfirmation",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.email()
    t.model.redirect()
    t.model.expired()
    t.model.expires_at()
    t.model.confirmed()
    t.model.confirmed_at()
    t.model.user_organization_id()
    t.model.user_organization()
    t.model.email_delivery_id()
    t.model.email_delivery()
  },
})

export const UserOrganizationJoinConfirmationQueries = extendType({
  type: "Query",
  definition(t) {
    t.field("userOrganizationJoinConfirmation", {
      type: "UserOrganizationJoinConfirmation",
      args: {
        id: nonNull(idArg()),
      },
      authorize: or(isUser, isAdmin),
      resolve: async (_, { id }, ctx) => {
        return ctx.prisma.userOrganizationJoinConfirmation.findFirst({
          where: {
            id,
            user_organization: {
              user: { id: ctx.user?.id },
            },
          },
        })
      },
    })
  },
})

export const UserOrganizationJoinConfirmationMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("confirmUserOrganizationJoin", {
      type: "UserOrganizationJoinConfirmation",
      args: {
        id: nonNull(idArg()),
        code: nonNull(stringArg()),
      },
      authorize: or(isUser, isAdmin),
      resolve: async (_, { id, code }, ctx) => {
        const userOrganizationJoinConfirmation =
          await ctx.prisma.userOrganizationJoinConfirmation.findFirst({
            where: {
              id,
              user_organization: {
                user: { id: ctx.user?.id },
              },
            },
          })

        if (!userOrganizationJoinConfirmation) {
          throw new Error("invalid confirmation id")
        }

        if (userOrganizationJoinConfirmation.confirmed) {
          // TODO: do I just return the existing membership or throw this?
          throw new Error(
            "this user organization membership has already been confirmed",
          )
        }

        if (userOrganizationJoinConfirmation.expired) {
          throw new Error("confirmation link has expired")
        }

        if (
          userOrganizationJoinConfirmation.expires_at &&
          userOrganizationJoinConfirmation.expires_at < new Date()
        ) {
          await ctx.prisma.userOrganizationJoinConfirmation.update({
            where: { id },
            data: {
              expired: { set: true },
            },
          })

          throw new Error("confirmation link has expired")
        }

        const userOrganization = await ctx.prisma.userOrganization.findFirst({
          where: {
            id: userOrganizationJoinConfirmation.user_organization_id,
          },
          include: {
            organization: true,
          },
        })

        if (!userOrganization || !userOrganization?.organization) {
          throw new Error("invalid user/organization relation")
        }

        const activationCode = calculateActivationCode({
          user: ctx.user!,
          organization: userOrganization.organization,
          userOrganizationJoinConfirmation,
        })

        if (activationCode !== code) {
          throw new Error("invalid activation code")
        }

        const confirmationDate = new Date()

        await ctx.prisma.userOrganization.update({
          where: { id: userOrganizationJoinConfirmation.user_organization_id },
          data: {
            confirmed: { set: true },
            confirmed_at: confirmationDate,
          },
        })

        return await ctx.prisma.userOrganizationJoinConfirmation.update({
          where: { id },
          data: {
            confirmed: { set: true },
            confirmed_at: confirmationDate,
          },
        })
      },
    })
  },
})
