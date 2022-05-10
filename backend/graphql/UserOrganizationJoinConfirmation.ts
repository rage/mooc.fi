import { extendType, idArg, nonNull, objectType } from "nexus"

import { isUser } from "../accessControl"

export const UserOrganizationJoinConfirmation = objectType({
  name: "UserOrganizationJoinConfirmation",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
    t.model.email()
    t.model.confirmation_link()
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

export const UserOrganizationJoinConfirmationMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("confirmUserOrganizationJoin", {
      type: "UserOrganizationJoinConfirmation",
      args: {
        id: nonNull(idArg()),
        // TODO: some sort of token etc.
      },
      authorize: isUser,
      resolve: async (_, { id }, ctx) => {
        const userOrganizationJoinConfirmation =
          await ctx.prisma.userOrganizationJoinConfirmation.findUnique({
            where: { id },
          })

        if (!userOrganizationJoinConfirmation) {
          throw new Error("invalid confirmation id")
        }

        if (userOrganizationJoinConfirmation.confirmed) {
          // hunky dory, or should I error?
          return userOrganizationJoinConfirmation
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
