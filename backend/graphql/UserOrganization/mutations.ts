import { omit } from "lodash"
import { booleanArg, extendType, idArg, nonNull, stringArg } from "nexus"

import { User } from "@prisma/client"

import { isAdmin, isUser, or, Role } from "../../accessControl"
import { DEFAULT_JOIN_ORGANIZATION_EMAIL_TEMPLATE_ID } from "../../config/defaultData"
import { Context } from "../../context"
import {
  GraphQLAuthenticationError,
  GraphQLForbiddenError,
  GraphQLUserInputError,
} from "../../lib/errors"
import { calculateActivationCode, filterNullFields } from "../../util"
import {
  ConfigurationError,
  ConflictError,
  OrphanedEntityError,
} from "../common"
import {
  assertUserIdOnlyForAdmin,
  assertUserOrganizationCredentials,
  cancelEmailDeliveries,
  checkEmailValidity,
  createUserOrganizationJoinConfirmation,
  expirePreviousConfirmations,
  joinUserOrganization,
} from "./helpers"

export const UserOrganizationMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addUserOrganization", {
      type: "UserOrganization",
      args: {
        user_id: idArg({
          description:
            "Admin only. Specify user to add other than the current user.",
        }),
        organization_id: idArg({
          description:
            "Organization database id. Specify at least one of `organization_id` and `organization_slug`.",
        }),
        organization_slug: stringArg({
          description:
            "Organization slug. Specify at least one of `organization_id` and `organization_slug`.",
        }),
        organizational_email: stringArg({
          description:
            "Optional organizational email to use. If organization requires a specific email pattern, will be check against it.",
        }),
        organizational_identifier: stringArg({
          description: "Optional organizational identifier.",
        }),
        redirect: stringArg({
          description: "Optional redirect URL to store in confirmation.",
        }),
        language: stringArg({ description: "Optional language information." }),
      },
      authorize: or(isUser, isAdmin),
      resolve: async (
        _,
        {
          user_id,
          organization_id,
          organization_slug,
          organizational_email,
          organizational_identifier,
          redirect,
          language,
        },
        ctx,
      ) => {
        let user: User | null

        assertUserIdOnlyForAdmin(ctx, user_id)

        if (user_id && user_id !== ctx.user?.id) {
          user = await ctx.prisma.user.findUnique({
            where: { id: user_id },
          })
        } else {
          user = ctx.user ?? null
        }

        if (!user) {
          throw new GraphQLUserInputError("no such user", "user_id")
        }

        if (!organization_id && !organization_slug) {
          throw new GraphQLUserInputError(
            "no organization_id nor organization_slug provided",
            ["organization_id", "organization_slug"],
          )
        }

        const organization = await ctx.prisma.organization.findFirst({
          where: {
            ...filterNullFields({
              id: organization_id,
              slug: organization_slug,
            }),
            OR: [
              {
                disabled: false,
              },
              {
                disabled: null,
              },
            ],
          },
        })

        if (!organization) {
          throw new GraphQLUserInputError("no such organization", [
            "organization_id",
            "organization_slug",
          ])
        }

        if (organization.required_confirmation) {
          const isEmailValid = checkEmailValidity(
            organizational_email ?? user.email,
            organization.required_organization_email,
          )

          if (isEmailValid.isErr()) {
            throw isEmailValid.error
          }
        }

        const joinUserOrganizationResult = await joinUserOrganization({
          ctx,
          user,
          organization,
          organizational_email,
          organizational_identifier,
          redirect,
          language,
        })

        if (joinUserOrganizationResult.isErr()) {
          throw joinUserOrganizationResult.error
        }

        return joinUserOrganizationResult.value
      },
    })

    t.field("confirmUserOrganizationJoin", {
      type: "UserOrganization",
      args: {
        id: nonNull(
          idArg({ description: "user organization join confirmation id" }),
        ),
        code: nonNull(stringArg()),
      },
      authorize: or(isUser, isAdmin),
      resolve: async (_, { id, code }, ctx) => {
        if (!ctx.user?.id) {
          // just to be sure, should never happen
          throw new GraphQLAuthenticationError("not logged in")
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
                  user: true,
                },
              },
            },
          })

        // user is not associated with this confirmation or confirmation id is invalid
        if (!userOrganizationJoinConfirmation) {
          throw new GraphQLUserInputError("invalid confirmation id", "id")
        }

        const { user_organization } = userOrganizationJoinConfirmation

        if (!user_organization || !user_organization?.organization) {
          throw new OrphanedEntityError("invalid user/organization relation", {
            parent: "UserOrganizationJoinConfirmation",
            entity: "UserOrganization",
          })
        }

        if (user_organization.confirmed) {
          throw new ConflictError(
            "this user organization membership has already been confirmed",
          )
          // return omit(userOrganizationJoinConfirmation, "user_organization")
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
          throw new GraphQLForbiddenError("confirmation link has expired")
        }

        const activationCodeResult = await calculateActivationCode({
          prisma: ctx.prisma,
          userOrganizationJoinConfirmation,
        })

        if (activationCodeResult.isErr()) {
          throw activationCodeResult.error
        }

        if (activationCodeResult.value !== code) {
          throw new GraphQLForbiddenError("invalid activation code")
        }

        const newUserOrganizationJoinConfirmation =
          await ctx.prisma.userOrganizationJoinConfirmation.update({
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

        return ctx.prisma.userOrganization.findUnique({
          where: {
            id: newUserOrganizationJoinConfirmation.user_organization_id,
          },
        })
      },
    })

    t.field("requestNewUserOrganizationJoinConfirmation", {
      type: "UserOrganizationJoinConfirmation",
      args: {
        id: nonNull(idArg({ description: "user organization id" })),
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
          throw new GraphQLAuthenticationError("not logged in")
        }

        const userOrganization = await ctx.prisma.userOrganization.findFirst({
          where: {
            id,
            ...(ctx.role !== Role.ADMIN && { user_id: ctx.user.id }),
          },
          include: {
            user: true,
            organization: true,
            user_organization_join_confirmations: {
              include: {
                email_delivery: true,
              },
              orderBy: {
                created_at: "desc",
              },
            },
          },
        })

        if (!userOrganization) {
          throw new GraphQLUserInputError("invalid user organization id", "id")
        }

        const { user, organization, user_organization_join_confirmations } =
          userOrganization

        if (!user) {
          throw new OrphanedEntityError(
            "user organization relation not related to user",
            {
              parent: "User",
              entity: "UserOrganization",
            },
          )
        }

        if (!organization) {
          throw new OrphanedEntityError(
            "user organization relation not related to organization",
            {
              parent: "Organization",
              entity: "UserOrganization",
            },
          )
        }

        const emailChanged =
          organizational_email &&
          organizational_email !== userOrganization.organizational_email

        // TODO: will we send new confirmation on email change?
        if (userOrganization.confirmed) {
          throw new ConflictError(
            "this user organization membership has already been confirmed",
          )
        }

        const join_organization_email_template_id =
          organization.join_organization_email_template_id ??
          DEFAULT_JOIN_ORGANIZATION_EMAIL_TEMPLATE_ID

        if (!join_organization_email_template_id) {
          throw new ConfigurationError(
            "join organization email template is not set",
          )
        }

        const currentDate = new Date()

        if (emailChanged) {
          const isEmailValid = checkEmailValidity(
            organizational_email,
            organization.required_organization_email,
          )

          if (isEmailValid.isErr()) {
            throw isEmailValid.error
          }
        }

        const newUserOrganizationJoinConfirmationEmail = emailChanged
          ? organizational_email
          : userOrganization.organizational_email ?? user.email

        const previousConfirmation = user_organization_join_confirmations?.[0]
        // or do we get some according to the last email, or expired, or what?

        const createUserOrganizationJoinConfirmationResult =
          await createUserOrganizationJoinConfirmation({
            ctx,
            user,
            organization,
            email: newUserOrganizationJoinConfirmationEmail,
            userOrganization,
            language: language ?? previousConfirmation?.language,
            redirect,
          })

        if (createUserOrganizationJoinConfirmationResult.isErr()) {
          throw createUserOrganizationJoinConfirmationResult.error
        }

        const newUserOrganizationJoinConfirmation =
          createUserOrganizationJoinConfirmationResult.value

        await cancelEmailDeliveries({
          ctx,
          userId: user.id,
          organizationId: organization.id,
          emailTemplateId: join_organization_email_template_id,
          errorMessage: `New activation link requested at ${currentDate.toISOString()}`,
          ignoreEmailDeliveries:
            newUserOrganizationJoinConfirmation.email_delivery_id,
        })

        await expirePreviousConfirmations({
          ctx,
          userOrganizationJoinConfirmation: newUserOrganizationJoinConfirmation,
        })

        if (emailChanged) {
          // TODO: should we update the organizational email only when it is confirmed?
          await ctx.prisma.userOrganization.update({
            where: {
              id: userOrganization.id,
            },
            data: {
              organizational_email,
            },
          })
        }

        return newUserOrganizationJoinConfirmation
      },
    })

    t.field("updateUserOrganizationConsent", {
      type: "UserOrganization",
      args: {
        id: nonNull(idArg()),
        consented: booleanArg(),
      },
      authorize: or(isUser, isAdmin),
      resolve: async (_, { id, consented }, ctx: Context) => {
        await assertUserOrganizationCredentials(ctx, id)

        // TODO: if we remove consent and the confirmation is still pending, should we deactivate it?
        // TODO: does removing a consent also make a confirmed membership false?
        return ctx.prisma.userOrganization.update({
          data: {
            ...(consented !== null &&
              typeof consented !== "undefined" && {
                consented: { set: consented },
              }),
          },
          where: {
            id,
          },
        })
      },
    })

    t.field("updateUserOrganizationOrganizationalMail", {
      type: "UserOrganization",
      args: {
        id: nonNull(idArg()),
        organizational_email: nonNull(stringArg()),
        redirect: stringArg(),
        language: stringArg(),
      },
      authorize: or(isUser, isAdmin),
      resolve: async (
        _,
        { id, organizational_email, redirect, language },
        ctx: Context,
      ) => {
        await assertUserOrganizationCredentials(ctx, id)

        const userOrganization = await ctx.prisma.userOrganization.findUnique({
          where: {
            id,
          },
          include: {
            organization: true,
            user: true,
            user_organization_join_confirmations: {
              orderBy: {
                created_at: "desc",
              },
            },
          },
        })

        const {
          organization,
          user,
          user_organization_join_confirmations,
          organizational_email: previousOrganizationalEmail,
        } = userOrganization ?? {}

        if (!userOrganization || !user || !organization) {
          throw new GraphQLUserInputError(
            "no user organization found or invalid user/organization relation",
            "id",
          )
        }

        const { required_confirmation } = organization

        // no changes, return original
        if (organizational_email === previousOrganizationalEmail) {
          return omit(userOrganization, ["organization", "user"])
        }

        const currentDate = new Date()

        // no confirmation required, update and return
        if (!required_confirmation) {
          return ctx.prisma.userOrganization.update({
            data: {
              organizational_email,
            },
            where: {
              id,
            },
          })
        }

        const isEmailValid = checkEmailValidity(
          organizational_email,
          organization.required_organization_email,
        )

        if (isEmailValid.isErr()) {
          throw isEmailValid.error
        }

        const previousConfirmation =
          user_organization_join_confirmations?.find(
            (conf) =>
              conf.email === (previousOrganizationalEmail ?? user.email),
          ) ?? user_organization_join_confirmations?.[0]

        // confirmation required
        // TODO: if we ever get to upgrade prisma, wrap this in an interactive transaction
        const createUserOrganizationJoinConfirmationResult =
          await createUserOrganizationJoinConfirmation({
            ctx,
            user,
            organization,
            userOrganization,
            email: organizational_email,
            language: language ?? previousConfirmation?.language,
            redirect,
          })

        if (createUserOrganizationJoinConfirmationResult.isErr()) {
          throw createUserOrganizationJoinConfirmationResult.error
        }

        const userOrganizationJoinConfirmation =
          createUserOrganizationJoinConfirmationResult.value

        await cancelEmailDeliveries({
          ctx,
          ignoreEmailDeliveries:
            userOrganizationJoinConfirmation.email_delivery_id,
          userId: user.id,
          organizationId: organization.id,
          emailTemplateId: organization.join_organization_email_template_id!,
          email: previousOrganizationalEmail ?? user.email,
          errorMessage: `Organizational mail changed at ${currentDate.toISOString()}`,
        })

        await expirePreviousConfirmations({
          ctx,
          userOrganizationJoinConfirmation,
        })

        return ctx.prisma.userOrganization.update({
          where: {
            id,
          },
          data: {
            organizational_email,
            confirmed: { set: false },
            confirmed_at: { set: null },
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
      resolve: async (_, { id }, ctx: Context) => {
        await assertUserOrganizationCredentials(ctx, id)

        const userOrganization = await ctx.prisma.userOrganization.findUnique({
          where: {
            id,
            ...(ctx.role !== Role.ADMIN && { user_id: ctx.user?.id }),
          },
          include: {
            organization: true,
          },
        })

        if (!userOrganization) {
          throw new GraphQLUserInputError("no user organization found", "id")
        }

        const { user_id, organization_id, organization } = userOrganization

        if (user_id && organization_id) {
          await cancelEmailDeliveries({
            ctx,
            userId: user_id,
            organizationId: organization_id,
            emailTemplateId:
              organization?.join_organization_email_template_id ??
              DEFAULT_JOIN_ORGANIZATION_EMAIL_TEMPLATE_ID,
            errorMessage: `User organization membership deleted at ${new Date().toISOString()}`,
          })
        }

        return ctx.prisma.userOrganization.delete({
          where: { id },
        })
      },
    })
  },
})
