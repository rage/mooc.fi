import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from "apollo-server-core"
import { extendType, idArg, nonNull, objectType, stringArg } from "nexus"

import { isAdmin, isUser, or, Role } from "../accessControl"
import { calculateActivationCode } from "../util"
import {
  cancelEmailDeliveries,
  checkEmailValidity,
  createUserOrganizationJoinConfirmation,
} from "./common"
import {
  ConfigurationError,
  ConflictError,
  OrphanedEntityError,
} from "./common"

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
            ...(ctx.role !== Role.ADMIN && {
              user_organization: {
                user: { id: ctx.user?.id },
              },
            }),
          },
          orderBy: {
            created_at: "desc",
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
          throw new AuthenticationError("not logged in")
        }

        const userOrganizationJoinConfirmation =
          await ctx.prisma.userOrganizationJoinConfirmation.findFirst({
            where: {
              id,
              ...(ctx.role !== Role.ADMIN && {
                user_organization: {
                  user: { id: ctx.user.id },
                },
              }),
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
          throw new UserInputError("invalid confirmation id", {
            argumentName: "id",
          })
        }

        if (userOrganizationJoinConfirmation.confirmed) {
          throw new ConflictError(
            "this user organization membership has already been confirmed",
          )
          // return omit(userOrganizationJoinConfirmation, "user_organization")
        }

        const { user_organization } = userOrganizationJoinConfirmation

        if (!user_organization || !user_organization?.organization) {
          throw new OrphanedEntityError("invalid user/organization relation", {
            parent: "UserOrganizationJoinConfirmation",
            entity: "UserOrganization",
          })
        }

        const currentDate = new Date()

        // confirmation expired or will expire now
        const confirmationWillExpire =
          userOrganizationJoinConfirmation.expires_at &&
          userOrganizationJoinConfirmation.expires_at < currentDate

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

          // TODO: should we just return the expired confirmation?
          throw new ForbiddenError("confirmation link has expired")
        }

        const activationCode = await calculateActivationCode({
          prisma: ctx.prisma,
          userOrganizationJoinConfirmation,
        })

        if (activationCode !== code) {
          throw new ForbiddenError("invalid activation code")
        }

        return await ctx.prisma.userOrganizationJoinConfirmation.update({
          where: { id },
          data: {
            confirmed: { set: true },
            confirmed_at: currentDate,
            user_organization: {
              update: {
                confirmed: { set: true },
                confirmed_at: currentDate,
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
        redirect: stringArg(),
        language: stringArg(),
      },
      authorize: or(isUser, isAdmin),
      resolve: async (
        _,
        { id, organizational_email, redirect, language },
        ctx,
      ) => {
        if (!ctx.user?.id) {
          // just to be sure, should never happen
          throw new AuthenticationError("not logged in")
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
                  // even if we could get the current user from the context,
                  // we'll query the user here in case we are confirming another user with admin credentials
                  user: true,
                  organization: true,
                },
              },
            },
          })

        if (!userOrganizationJoinConfirmation) {
          throw new UserInputError("invalid confirmation id", {
            argumentName: "id",
          })
        }

        if (
          ctx.role !== Role.ADMIN &&
          userOrganizationJoinConfirmation.user_organization.user_id !==
            ctx.user.id
        ) {
          throw new ForbiddenError("invalid credentials to do that")
        }

        const { user_organization } = userOrganizationJoinConfirmation
        const { user, organization } = user_organization

        if (!user_organization || !organization || !user) {
          throw new OrphanedEntityError("invalid user/organization relation", {
            parent: "UserOrganizationJoinConfirmation",
            entity: "UserOrganization",
          })
        }

        const emailChanged =
          organizational_email &&
          organizational_email !== user_organization.organizational_email

        // TODO: will we send new confirmation on email change?
        if (userOrganizationJoinConfirmation.confirmed && !emailChanged) {
          throw new ConflictError(
            "this user organization membership has already been confirmed",
          )
        }

        if (!organization.join_organization_email_template_id) {
          throw new ConfigurationError(
            "join organization email template is not set",
          )
        }

        const currentDate = new Date()

        // find email deliveries for this user/organization that are still in the queue
        // and update them so that we don't accidentally send expired activation links
        await cancelEmailDeliveries({
          ctx,
          userOrganization: user_organization,
          organization,
          email: userOrganizationJoinConfirmation.email,
          errorMessage: `New activation link requested at ${currentDate}`,
        })

        if (emailChanged) {
          // a new organizational email is provided, expire old confirmation and create a new one
          const isEmailValid = checkEmailValidity(
            organizational_email,
            organization.required_organization_email,
          )

          if (isEmailValid.isErr()) {
            throw isEmailValid.error
          }

          const createUserOrganizationJoinConfirmationResult =
            await createUserOrganizationJoinConfirmation({
              ctx,
              user,
              organization,
              email: organizational_email,
              userOrganization: user_organization,
              redirect: redirect ?? userOrganizationJoinConfirmation?.redirect,
              language: language ?? userOrganizationJoinConfirmation?.language,
            })

          if (createUserOrganizationJoinConfirmationResult.isErr()) {
            throw createUserOrganizationJoinConfirmationResult.error
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

          return createUserOrganizationJoinConfirmationResult.value
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
            redirect: redirect ?? userOrganizationJoinConfirmation.redirect,
            language: language ?? userOrganizationJoinConfirmation.language,
            expired: { set: false },
            expires_at: new Date(currentDate.getTime() + 4 * 60 * 60 * 1000), // 4 hours for now
          },
        })
      },
    })
  },
})
