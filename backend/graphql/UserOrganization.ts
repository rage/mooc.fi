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
import { isNullOrUndefined } from "../util/isNullOrUndefined"
import { err, ok, Result } from "../util/result"

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

const assertUserCredentials = async (ctx: Context, id: string) => {
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

const checkEmailValidity = (
  email?: string | null,
  requiredPattern?: string | null,
): Result<boolean, Error> => {
  if (!email) {
    return err(
      new Error("no email specified and no email found in user profile"),
    )
  }

  if (requiredPattern) {
    if (!email.match(requiredPattern)) {
      return err(
        new Error(
          "given email does not fulfill organization email requirements",
        ),
      )
    }
  }

  return ok(true)
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
          where: {
            user_id: user.id,
            organization_id,
          },
          select: {
            id: true,
          },
        })

        if (exists) {
          throw new Error("this user/organization relation already exists")
        }

        const {
          required_confirmation,
          required_organization_email,
          join_organization_email_template_id,
        } = organization

        const now = Date.now()
        const userOrganization = await ctx.prisma.userOrganization.create({
          data: {
            user: { connect: { id: user.id } },
            organization: {
              connect: { id: organization_id },
            },
            role: OrganizationRole.Student,
            organizational_email: organizational_email ?? undefined,
            organizational_identifier: organizational_identifier ?? undefined,
            ...(!required_confirmation && {
              confirmed: true,
              confirmed_at: new Date(now),
            }),
            // we assume that the consent is given in the frontend
            consented: true,
          },
        })

        if (!required_confirmation) {
          return userOrganization
        }

        const organizationOrUserEmail = organizational_email ?? user.email

        const isValid = checkEmailValidity(
          organizationOrUserEmail,
          required_organization_email,
        )

        if (isValid.isErr()) {
          throw isValid.error
        }

        if (!join_organization_email_template_id) {
          throw new Error("no email template associated with this organization")
        }

        // TODO: wonder if we can ever run into a race condition where the email delivery
        // exists before the join confirmation and the template doesn't find it?
        await ctx.prisma.userOrganizationJoinConfirmation.create({
          data: {
            email: organizationOrUserEmail,
            user_organization: { connect: { id: userOrganization.id } },
            email_delivery: {
              create: {
                user_id: user.id,
                email: organizationOrUserEmail,
                email_template_id: join_organization_email_template_id,
                organization_id,
                sent: false,
                error: false,
              },
            },
            redirect,
            language,
            expires_at: new Date(now + 4 * 60 * 60 * 1000), // 4 hours for now
          },
        })

        return userOrganization
      },
    })

    // TODO: now this might do a bit more than it should and may be split to other mutations:
    // - if we specify an organizational email:
    //    - we check the mail validity if a pattern is required for organization and throw if invalid
    //    - we check if the organization membership is already confirmed
    //      - if it isn't we flag the unsent confirmation mails as errors,
    //        refresh the join confirmation and create a new email delivery to the new address
    //    - update the data in the user/organization relation
    t.field("updateUserOrganization", {
      type: "UserOrganization",
      args: {
        id: nonNull(idArg()),
        consented: booleanArg(),
        organizational_email: stringArg(),
        organizational_identifier: stringArg(),
      },
      authorize: or(isUser, isAdmin),
      resolve: async (
        _,
        { id, consented, organizational_email, organizational_identifier },
        ctx: Context,
      ) => {
        await assertUserCredentials(ctx, id)

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
        /*if (!userOrganization.confirmed) {
          if (consented === false || 
            ((consented === null || typeof consented === "undefined") && !userOrganization.consented)
          ) {
            throw new Error(
              "user must consent to join organization",
            )
          }
        }*/

        return ctx.prisma.userOrganization.update({
          data: {
            ...(consented !== null && typeof consented !== "undefined"
              ? { consented: { set: consented } }
              : {}),
            ...(organizational_email !== null &&
              organizational_email !== "" && { organizational_email }),
            ...(organizational_identifier !== null &&
              organizational_identifier !== "" && {
                organizational_identifier,
              }),
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
        await assertUserCredentials(ctx, id)

        return ctx.prisma.userOrganization.delete({
          where: { id },
        })
      },
    })
  },
})
