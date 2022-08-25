import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from "apollo-server-express"
import { omit } from "lodash"
import {
  booleanArg,
  extendType,
  idArg,
  nonNull,
  objectType,
  stringArg,
} from "nexus"

import { User, UserOrganization as UserOrganizationType } from "@prisma/client"

import { isAdmin, isUser, or, Role } from "../accessControl"
import { Context } from "../context"
import { calculateActivationCode } from "../util"
import {
  cancelEmailDeliveries,
  checkEmailValidity,
  ConfigurationError,
  ConflictError,
  createUserOrganizationJoinConfirmation,
  joinUserOrganization,
  OrphanedEntityError,
} from "./common"

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
    t.model.organizational_email()
    t.model.organizational_identifier()
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
        organization_slug: stringArg(),
      },
      authorize: or(isUser, isAdmin),
      resolve: async (_, args, ctx) => {
        // TODO/FIXME: admin could query all user organizations?
        const {
          user_id: user_id_param,
          organization_id,
          organization_slug,
        } = args

        assertUserIdOnlyForAdmin(ctx, user_id_param)

        const user_id = user_id_param ?? ctx.user?.id

        if (!user_id) {
          throw new AuthenticationError("not logged in or no user id")
        }

        return ctx.prisma.user
          .findUnique({
            where: { id: user_id },
          })
          .user_organizations({
            where: {
              user_id,
              organization_id: organization_id ?? undefined,
              ...(organization_slug && {
                organization: { slug: organization_slug },
              }),
            },
          })
      },
    })
  },
})

const assertUserIdOnlyForAdmin = (ctx: Context, id?: User["id"] | null) => {
  if (!id) {
    return
  }

  const { user, role } = ctx

  if (!user || (user && user.id !== id && role !== Role.ADMIN)) {
    throw new ForbiddenError("invalid credentials to do that")
  }
}

const assertUserOrganizationCredentials = async (
  ctx: Context,
  id: UserOrganizationType["id"],
) => {
  const userOrganization = await ctx.prisma.userOrganization.findUnique({
    where: { id },
  })

  if (!userOrganization?.user_id) {
    throw new UserInputError(
      "no such user/organization relation or no user in relation",
    )
  }

  assertUserIdOnlyForAdmin(ctx, userOrganization.user_id)
}

export const UserOrganizationMutations = extendType({
  type: "Mutation",
  definition(t) {
    t.field("addUserOrganization", {
      type: "UserOrganization",
      args: {
        user_id: idArg(),
        organization_id: idArg(),
        organization_slug: stringArg(),
        organizational_email: stringArg(),
        organizational_identifier: stringArg(),
        redirect: stringArg(),
        language: stringArg(),
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
          throw new UserInputError("no such user", { argumentName: "user_id" })
        }

        if (!organization_id && !organization_slug) {
          throw new UserInputError(
            "no organization id or slug - provide at least one",
            {
              argumentName: ["organization_id", "organization_slug"],
            },
          )
        }

        const organization = await ctx.prisma.organization.findUnique({
          where: {
            id: organization_id ?? undefined,
            slug: organization_slug ?? undefined,
          },
        })

        if (!organization) {
          throw new UserInputError("no such organization", {
            argumentName: "organization_id",
          })
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

        // TODO: wrap in transaction once we update prisma
        const joinUserOrganizationResult = await joinUserOrganization({
          ctx,
          user,
          organization,
          organizational_email,
          organizational_identifier,
        })

        if (joinUserOrganizationResult.isErr()) {
          throw joinUserOrganizationResult.error
        }

        const userOrganization = joinUserOrganizationResult.value

        if (organization.required_confirmation) {
          const createUserOrganizationJoinConfirmationResult =
            await createUserOrganizationJoinConfirmation({
              ctx,
              user,
              organization,
              userOrganization,
              email: organizational_email ?? user.email,
              redirect,
              language,
            })

          if (createUserOrganizationJoinConfirmationResult.isErr()) {
            await ctx.prisma.userOrganization.delete({
              where: { id: userOrganization.id },
            })
            throw createUserOrganizationJoinConfirmationResult.error
          }
        }

        return userOrganization
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

        const { organization, user, user_organization_join_confirmations } =
          userOrganization ?? {}

        if (!userOrganization || !user || !organization) {
          throw new UserInputError(
            "no user organization found or invalid user/organization relation",
            { argumentName: "id" },
          )
        }

        const { required_confirmation } = organization

        // no changes, return original
        if (organizational_email === userOrganization.organizational_email) {
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
            (conf) => conf.email === organizational_email,
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
            redirect: redirect ?? previousConfirmation?.redirect,
          })

        if (createUserOrganizationJoinConfirmationResult.isErr()) {
          throw createUserOrganizationJoinConfirmationResult.error
        }

        const userOrganizationJoinConfirmation =
          createUserOrganizationJoinConfirmationResult.value

        await cancelEmailDeliveries({
          ctx,
          ignoreEmailDeliveries: [
            userOrganizationJoinConfirmation.email_delivery_id!,
          ],
          userOrganization,
          organization,
          email: organizational_email ?? user.email,
          errorMessage: `Organizational mail changed at ${currentDate}`,
        })

        await ctx.prisma.userOrganizationJoinConfirmation.updateMany({
          where: {
            id: { not: userOrganizationJoinConfirmation.id },
            user_organization_id: userOrganization.id,
            confirmed: { not: true },
          },
          data: {
            expired: { set: true },
          },
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
      resolve: async (_, args, ctx: Context) => {
        const { id } = args
        await assertUserOrganizationCredentials(ctx, id)

        return ctx.prisma.userOrganization.delete({
          where: { id },
        })
      },
    })

    t.field("confirmUserOrganizationJoin", {
      type: "UserOrganization",
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
          throw new AuthenticationError("not logged in")
        }

        const userOrganization = await ctx.prisma.userOrganization.findUnique({
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
          throw new UserInputError("invalid user organization id", {
            argumentName: "id",
          })
        }

        if (
          ctx.role !== Role.ADMIN &&
          userOrganization.user_id !== ctx.user.id
        ) {
          throw new ForbiddenError("invalid credentials to do that")
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

        if (!organization.join_organization_email_template_id) {
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

        const previousConfirmation =
          user_organization_join_confirmations?.find(
            (conf) => conf.email === userOrganization.organizational_email,
          ) ?? user_organization_join_confirmations?.[0]

        const createUserOrganizationJoinConfirmationResult =
          await createUserOrganizationJoinConfirmation({
            ctx,
            user,
            organization,
            email: newUserOrganizationJoinConfirmationEmail,
            userOrganization,
            redirect: redirect ?? previousConfirmation?.redirect,
            language: language ?? previousConfirmation?.language,
          })

        if (createUserOrganizationJoinConfirmationResult.isErr()) {
          throw createUserOrganizationJoinConfirmationResult.error
        }

        const newUserOrganizationJoinConfirmation =
          createUserOrganizationJoinConfirmationResult.value

        await cancelEmailDeliveries({
          ctx,
          userOrganization,
          organization,
          errorMessage: `New activation link requested at ${currentDate}`,
          ignoreEmailDeliveries: [
            newUserOrganizationJoinConfirmation.email_delivery_id!,
          ],
        })

        await ctx.prisma.userOrganizationJoinConfirmation.updateMany({
          where: {
            id: { not: newUserOrganizationJoinConfirmation.id },
            user_organization_id: userOrganization.id,
          },
          data: {
            expired: { set: true },
          },
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
  },
})
