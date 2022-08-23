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
import {
  cancelEmailDeliveries,
  checkEmailValidity,
  createUserOrganizationJoinConfirmation,
  joinUserOrganization,
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
      },
      authorize: or(isUser, isAdmin),
      resolve: async (_, args, ctx) => {
        // TODO/FIXME: admin could query all user organizations?
        const { user_id: user_id_param, organization_id } = args

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
              user_id: user_id ?? ctx.user!.id,
              organization_id,
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
        organization_id: nonNull(idArg()),
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

        const organization = await ctx.prisma.organization.findUnique({
          where: { id: organization_id },
        })

        if (!organization) {
          throw new UserInputError("no such organization", {
            argumentName: "organization_id",
          })
        }

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
          const isEmailValid = checkEmailValidity(
            organizational_email ?? user.email,
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
              userOrganization,
              email: organizational_email ?? user.email,
              redirect,
              language,
            })

          if (createUserOrganizationJoinConfirmationResult.isErr()) {
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

        // confirmation required
        // TODO: if we ever get to upgrade prisma, wrap this in an interactive transaction
        await cancelEmailDeliveries({
          ctx,
          userOrganization,
          organization,
          email: organizational_email ?? user.email,
          errorMessage: `Organizational mail changed at ${currentDate}`,
        })

        const previousConfirmation =
          user_organization_join_confirmations?.find(
            (conf) => conf.email === organizational_email,
          ) ?? user_organization_join_confirmations?.[0]

        await ctx.prisma.userOrganizationJoinConfirmation.updateMany({
          where: {
            user_organization_id: userOrganization.id,
            confirmed: { not: true },
          },
          data: {
            expired: { set: true },
          },
        })

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
  },
})
