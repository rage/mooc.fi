import { ForbiddenError } from "apollo-server-core"
import { omit } from "lodash"
import { extendType, idArg, nonNull, objectType, stringArg } from "nexus"

import { isAdmin, isUser, or, Role } from "../accessControl"
import {
  calculateActivationCode,
  cancelEmailDeliveries,
  checkEmailValidity,
} from "../util/userOrganizationUtilities"

export const UserOrganizationJoinConfirmation = objectType({
  name: "UserOrganizationJoinConfirmation",
  definition(t) {
    t.model.id()
    t.model.created_at()
    t.model.updated_at()
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
        user_id: idArg(),
        code: nonNull(stringArg()),
      },
      authorize: or(isUser, isAdmin),
      resolve: async (_, { id, user_id, code }, ctx) => {
        if (!ctx.user?.id) {
          // just to be sure, should never happen
          throw new Error("not logged in")
        }

        if (user_id && user_id !== ctx.user?.id && ctx.role !== Role.ADMIN) {
          throw new ForbiddenError("invalid credentials to do that")
        }

        const userOrganizationJoinConfirmation =
          await ctx.prisma.userOrganizationJoinConfirmation.findFirst({
            where: {
              id,
              user_organization: {
                user: { id: user_id ?? ctx.user.id },
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
          return omit(userOrganizationJoinConfirmation, "user_organization")
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
        organizational_email: stringArg({
          description:
            "If provided, organizational email is updated and new confirmation link is sent",
        }),
      },
      authorize: or(isUser, isAdmin),
      resolve: async (_, { id, organizational_email }, ctx) => {
        if (!ctx.user?.id) {
          // just to be sure, should never happen
          throw new Error("not logged in")
        }

        const userOrganizationJoinConfirmation =
          await ctx.prisma.userOrganizationJoinConfirmation.findFirst({
            where: {
              id,
              ...(ctx.role !== Role.ADMIN && {
                user_organization: {
                  user_id: ctx.user.id,
                },
              }),
            },
            include: {
              email_delivery: true,
              user_organization: {
                include: {
                  user: true,
                  organization: {
                    select: {
                      id: true,
                      required_confirmation: true,
                      required_organization_email: true,
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

        if (
          ctx.role !== Role.ADMIN &&
          userOrganizationJoinConfirmation.user_organization.user_id !==
            ctx.user.id
        ) {
          throw new ForbiddenError("invalid credentials to do that")
        }

        // TODO: will we send new confirmation on email change?
        if (userOrganizationJoinConfirmation.confirmed) {
          throw new Error(
            "this user organization membership has already been confirmed",
          )
        }

        const { user_organization } = userOrganizationJoinConfirmation
        const { user, organization } = user_organization

        if (!user_organization || !organization || !user) {
          throw new Error("invalid user/organization relation")
        }
        if (!organization.join_organization_email_template_id) {
          throw new Error("join organization email template is not set")
        }

        const now = Date.now()

        // find email deliveries for this user/organization that are still in the queue
        // and update them so that we don't accidentally send expired activation links
        await cancelEmailDeliveries({
          ctx,
          userOrganization: user_organization,
          organization,
          email: userOrganizationJoinConfirmation.email,
          errorMessage: `New activation link requested at ${new Date(now)}`,
        })

        if (
          organizational_email &&
          organizational_email !== user_organization.organizational_email
        ) {
          // a new organizational email is provided, cancel all possible pending email deliveries to old address,
          // expire old confirmation and create a new one

          const isEmailValid = checkEmailValidity(
            organizational_email,
            organization.required_organization_email,
          )

          if (isEmailValid.isErr()) {
            throw isEmailValid.error
          }

          // TODO: should we update the organizational email only when it is confirmed?
          await ctx.prisma.userOrganization.update({
            where: {
              id: user_organization.id,
            },
            data: {
              organizational_email,
            },
          })

          await ctx.prisma.userOrganizationJoinConfirmation.update({
            where: { id },
            data: {
              expired: { set: true },
            },
          })

          return ctx.prisma.userOrganizationJoinConfirmation.create({
            data: {
              user_organization: { connect: { id: user_organization.id } },
              email: organizational_email,
              email_delivery: {
                create: {
                  user_id: user.id,
                  email: organizational_email,
                  email_template_id:
                    organization.join_organization_email_template_id,
                  organization_id: organization.id,
                  sent: false,
                  error: false,
                },
              },
              expired: false,
              expires_at: new Date(now + 4 * 60 * 60 * 1000), // 4 hours for now
            },
          })
        }

        // TODO: or expire old confirmation and create new?
        // - will disconnect the existing email delivery
        return ctx.prisma.userOrganizationJoinConfirmation.update({
          where: { id },
          data: {
            user_organization: { connect: { id: user_organization.id } },
            email_delivery: {
              create: {
                user_id: user.id,
                email: user_organization.organizational_email ?? user.email,
                email_template_id:
                  organization.join_organization_email_template_id,
                organization_id: organization.id,
                sent: false,
                error: false,
              },
            },
            expired: { set: false },
            expires_at: new Date(now + 4 * 60 * 60 * 1000), // 4 hours for now
          },
        })
      },
    })
  },
})
