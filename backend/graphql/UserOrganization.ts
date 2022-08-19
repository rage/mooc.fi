import { ForbiddenError } from "apollo-server-express"
import { omit } from "lodash"
import {
  booleanArg,
  extendType,
  idArg,
  nonNull,
  objectType,
  stringArg,
} from "nexus"

import {
  OrganizationRole,
  User,
  UserOrganization as UserOrganizationType,
} from "@prisma/client"

import { isAdmin, isUser, or, Role } from "../accessControl"
import { Context } from "../context"
import {
  checkEmailValidity,
  createUserOrganizationJoinConfirmation,
  joinUserOrganization,
} from "../util/userOrganizationUtilities"

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

const assertUserIdOnlyForAdmin = (ctx: Context, id?: User["id"] | null) => {
  if (!id) {
    return
  }

  const { user, role } = ctx

  if (user && user.id !== id && role !== Role.ADMIN) {
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
    throw new Error("no such user/organization relation or no user in relation")
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
          throw new Error("no such user")
        }

        const organization = await ctx.prisma.organization.findUnique({
          where: { id: organization_id },
        })

        if (!organization) {
          throw new Error("no such organization")
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

          return createUserOrganizationJoinConfirmationResult.value
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

    /*
    // TODO: mutation for updating organizational email
    //    - we check the mail validity if a pattern is required for organization and throw if invalid
    //    - we check if the organization membership is already confirmed
    //      - if it isn't we flag the unsent confirmation mails as errors,
    //        refresh the join confirmation and create a new email delivery to the new address
    //    - update the data in the user/organization relation

    const userOrganization = await ctx.prisma.userOrganization.findUnique({
          where: { id },
          include: {
            user: true,
            organization: {
              select: {
                id: true,
                required_organization_email: true,
                required_confirmation: true,
                join_organization_email_template_id: true,
              },
            },
          },
        })

        const { organization, user } = userOrganization ?? {}

        if (!userOrganization || !user || !organization) {
          throw new Error("invalid user/organization relation")
        }

        if (
          isNullOrUndefined(consented) &&
          isNullOrUndefined(organizational_email) &&
          isNullOrUndefined(organizational_identifier)
        ) {
          throw new Error("no fields to update")
        }

        const { required_confirmation, required_organization_email } =
          organization ?? {}

        if (organizational_email) {
          if (organizational_email !== userOrganization.organizational_email) {
            if (required_confirmation) {
              const isEmailValid = checkEmailValidity(
                organizational_email,
                required_organization_email,
              )
              if (isEmailValid.isErr()) {
                throw isEmailValid.error
              }
            }
          }

          if (!userOrganization.confirmed && required_confirmation) {
            const now = Date.now()

            if (!organization.join_organization_email_template_id) {
              throw new Error(
                "no email template associated with this organization",
              )
            }

            const { count: undeliveredCount } =
              await ctx.prisma.emailDelivery.updateMany({
                where: {
                  user_id: user.id,
                  email_template_id:
                    organization.join_organization_email_template_id,
                  organization_id: organization.id,
                  sent: false,
                  error: false,
                },
                data: {
                  error: { set: true },
                  error_message: `Organizational email changed at ${new Date(
                    now,
                  )}`,
                },
              })

            if (undeliveredCount > 0) {
              ctx.logger.info(
                `Found ${undeliveredCount} undelivered mail${
                  undeliveredCount > 1 ? "s" : ""
                } still in the send queue; updated`,
              )
            }

            // TODO: or expire old confirmation and create new?
            // - will disconnect the existing email delivery
            await ctx.prisma.userOrganizationJoinConfirmation.update({
              where: { id },
              data: {
                email: organizational_email,
                user_organization: { connect: { id: userOrganization.id } },
                email_delivery: {
                  create: {
                    user_id: userOrganization.user_id,
                    email: organizational_email,
                    email_template_id:
                      organization.join_organization_email_template_id,
                    organization_id: userOrganization.organization_id,
                    sent: false,
                    error: false,
                  },
                },
                expired: { set: false },
                expires_at: new Date(now + 4 * 60 * 60 * 1000), // 4 hours for now
              },
            })
          }
        }

    */

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
