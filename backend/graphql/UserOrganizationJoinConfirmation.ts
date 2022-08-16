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
    t.model.language()
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
        if (!ctx.user?.id) {
          // just to be sure, should never happen
          throw new Error("not logged in")
        }

        const userOrganizationJoinConfirmation =
          await ctx.prisma.userOrganizationJoinConfirmation.findFirst({
            where: {
              id,
              user_organization: {
                user: { id: ctx.user.id },
              },
            },
            include: {
              user_organization: {
                include: {
                  organization: true,
                },
              },
            },
          })

        // user is not associated with this confirmation or confirmation id is invalid
        if (!userOrganizationJoinConfirmation) {
          throw new Error("invalid confirmation id")
        }

        if (userOrganizationJoinConfirmation.confirmed) {
          // TODO: do I just return the existing membership or throw this?
          throw new Error(
            "this user organization membership has already been confirmed",
          )
        }

        const { user_organization } = userOrganizationJoinConfirmation

        if (!user_organization || !user_organization?.organization) {
          throw new Error("invalid user/organization relation")
        }

        const now = new Date()

        // confirmation expired or will expire now
        const confirmationWillExpire =
          userOrganizationJoinConfirmation.expires_at &&
          userOrganizationJoinConfirmation.expires_at < now

        if (
          userOrganizationJoinConfirmation.expired ||
          confirmationWillExpire
        ) {
          if (confirmationWillExpire) {
            await ctx.prisma.userOrganizationJoinConfirmation.update({
              where: { id },
              data: {
                expired: { set: true },
              },
            })
          }

          throw new Error("confirmation link has expired")
        }

        const activationCode = calculateActivationCode({
          user: ctx.user,
          organization: user_organization.organization,
          userOrganizationJoinConfirmation,
        })

        if (activationCode !== code) {
          throw new Error("invalid activation code")
        }

        return await ctx.prisma.userOrganizationJoinConfirmation.update({
          where: { id },
          data: {
            confirmed: { set: true },
            confirmed_at: now,
            user_organization: {
              update: {
                confirmed: { set: true },
                confirmed_at: now,
              },
            },
          },
        })
      },
    })

    t.field("refreshUserOrganizationJoinConfirmation", {
      type: "UserOrganizationJoinConfirmation",
      args: {
        id: nonNull(idArg()),
      },
      authorize: or(isUser, isAdmin),
      resolve: async (_, { id }, ctx) => {
        if (!ctx.user?.id) {
          // just to be sure, should never happen
          throw new Error("not logged in")
        }

        const userOrganizationJoinConfirmation =
          await ctx.prisma.userOrganizationJoinConfirmation.findFirst({
            where: {
              id,
              user_organization: {
                user: { id: ctx.user.id },
              },
            },
            include: {
              email_delivery: true,
              user_organization: {
                include: {
                  organization: {
                    select: {
                      id: true,
                      join_organization_email_template_id: true,
                    },
                  },
                },
              },
            },
          })

        if (!userOrganizationJoinConfirmation) {
          throw new Error("invalid confirmation id")
        }

        if (userOrganizationJoinConfirmation.confirmed) {
          throw new Error(
            "this user organization membership has already been confirmed",
          )
        }

        const { email, user_organization } = userOrganizationJoinConfirmation
        const { user_id, organization_id, organization } = user_organization

        if (!organization?.join_organization_email_template_id) {
          throw new Error("join organization email template is not set")
        }

        const now = Date.now()

        // find email deliveries for this user/organization that are still in the queue
        // and update them so that we don't accidentally send expired activation links
        const { count: expiredDeliveryCount } =
          await ctx.prisma.emailDelivery.updateMany({
            where: {
              user_id,
              email,
              email_template_id:
                organization.join_organization_email_template_id,
              organization_id,
              sent: false,
              error: false,
            },
            data: {
              error: { set: true },
              error_message: `New activation link requested at ${new Date(
                now,
              )}`,
            },
          })

        if (expiredDeliveryCount) {
          ctx.logger.info(
            `Found ${expiredDeliveryCount} expired email deliver${
              expiredDeliveryCount > 1 ? "ies" : "y"
            } still in the send queue; updated`,
          )
        }

        // TODO: or expire old confirmation and create new?
        // - will disconnect the existing email delivery
        return ctx.prisma.userOrganizationJoinConfirmation.update({
          where: { id },
          data: {
            email,
            user_organization: { connect: { id: user_organization.id } },
            email_delivery: {
              create: {
                user_id,
                email,
                email_template_id:
                  organization?.join_organization_email_template_id,
                organization_id,
                sent: false,
                error: false,
              },
            },
            expired: false,
            expires_at: new Date(now + 4 * 60 * 60 * 1000), // 4 hours for now
          },
        })
      },
    })
  },
})
