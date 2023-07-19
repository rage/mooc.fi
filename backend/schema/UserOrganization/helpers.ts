import {
  EmailDelivery,
  EmailTemplate,
  Organization,
  OrganizationRole,
  User,
  UserOrganization,
  UserOrganizationJoinConfirmation,
} from "@prisma/client"

import { Role } from "../../accessControl"
import { DEFAULT_JOIN_ORGANIZATION_EMAIL_TEMPLATE_ID } from "../../config/defaultData"
import { Context } from "../../context"
import {
  GraphQLForbiddenError,
  GraphQLGenericError,
  GraphQLUserInputError,
} from "../../lib/errors"
import {
  emptyOrNullToUndefined,
  ensureDefinedArray,
  err,
  ok,
  Result,
} from "../../util"
import { ConfigurationError, ConflictError } from "../common"
import { ExtendedTransactionClient } from "/prisma"

export function assertUserIdOnlyForAdmin(ctx: Context, id?: User["id"] | null) {
  if (!id) {
    return
  }

  const { user, role } = ctx

  if (!user || (user && user.id !== id && role !== Role.ADMIN)) {
    throw new GraphQLForbiddenError("invalid credentials to do that")
  }
}

export async function assertUserOrganizationCredentials(
  ctx: Context,
  id: UserOrganization["id"],
) {
  const userOrganization = await ctx.prisma.userOrganization.findUnique({
    where: { id },
  })

  if (!userOrganization?.user_id) {
    throw new GraphQLUserInputError(
      "no such user/organization relation or no user in relation",
    )
  }

  assertUserIdOnlyForAdmin(ctx, userOrganization.user_id)
}

export const checkEmailValidity = (
  email?: string | null,
  requiredPattern?: string | null,
): Result<boolean, Error> => {
  if (!email) {
    return err(
      new GraphQLUserInputError(
        "no email specified and no email found in user profile",
      ),
    )
  }

  if (requiredPattern) {
    const emailRegex = new RegExp(requiredPattern)
    if (!emailRegex.test(email)) {
      return err(
        new GraphQLUserInputError(
          "given email does not fulfill organization email requirements",
        ),
      )
    }
  }

  return ok(true)
}

interface JoinUserOrganizationOptions {
  ctx: Context
  user: User
  organization: Organization
  organizational_email?: string | null
  organizational_identifier?: string | null
  redirect?: string | null
  language?: string | null
}

/**
 * Join user with organization and return the created `UserOrganization`.
 * If organization requires email confirmation to join, run the confirmation link
 * logic. Return an error and rollback the transaction if any of the steps fail.
 */
export const joinUserOrganization = async ({
  ctx,
  user,
  organization,
  organizational_email,
  organizational_identifier,
  redirect,
  language,
}: JoinUserOrganizationOptions) => {
  const exists = await ctx.prisma.userOrganization.findFirst({
    where: {
      user_id: user.id,
      organization_id: organization.id,
    },
    select: {
      id: true,
    },
  })

  if (exists) {
    return err(
      new ConflictError("this user/organization relation already exists"),
    )
  }

  const { required_confirmation } = organization

  const currentDate = new Date()

  return ctx.prisma.$transaction(async (trx) => {
    const userOrganization = await trx.userOrganization.create({
      data: {
        user: { connect: { id: user.id } },
        organization: {
          connect: { id: organization.id },
        },
        role: OrganizationRole.Student,
        organizational_email: emptyOrNullToUndefined(organizational_email),
        organizational_identifier: emptyOrNullToUndefined(
          organizational_identifier,
        ),
        ...(!required_confirmation && {
          confirmed: true,
          confirmed_at: currentDate,
        }),
        // we assume that the consent is given in the frontend
        consented: true,
      },
    })

    if (required_confirmation) {
      const createUserOrganizationJoinConfirmationResult =
        await createUserOrganizationJoinConfirmation({
          ctx,
          user,
          organization,
          userOrganization,
          email: organizational_email ?? user.email,
          redirect,
          language,
          trx,
        })

      if (createUserOrganizationJoinConfirmationResult.isErr()) {
        return createUserOrganizationJoinConfirmationResult
      }
    }
    return ok(userOrganization)
  })
}

interface CreateUserOrganizationJoinConfirmationOptions {
  ctx: Context
  user: User
  organization: Organization
  userOrganization: UserOrganization
  email: string
  redirect?: string | null
  language?: string | null
  trx?: ExtendedTransactionClient
}

/**
 * Create a confirmation link and an email delivery for the user to join the organization.
 * If creating the link or the email delivery somehow fails, return the error caught.
 */
export const createUserOrganizationJoinConfirmation = async ({
  ctx,
  user,
  organization,
  userOrganization,
  email,
  redirect,
  language,
  trx,
}: CreateUserOrganizationJoinConfirmationOptions) => {
  const prisma = trx ?? ctx.prisma
  const join_organization_email_template_id =
    organization.join_organization_email_template_id ??
    DEFAULT_JOIN_ORGANIZATION_EMAIL_TEMPLATE_ID

  if (!join_organization_email_template_id) {
    return err(
      new ConfigurationError(
        "no email template associated with this organization",
      ),
    )
  }

  const currentDate = new Date()

  try {
    const userOrganizationJoinConfirmation =
      await prisma.userOrganizationJoinConfirmation.create({
        data: {
          user_organization: { connect: { id: userOrganization.id } },
          email,
          email_delivery: {
            create: {
              user_id: user.id,
              email,
              email_template_id: join_organization_email_template_id,
              organization_id: organization.id,
              sent: false,
              error: false,
            },
          },
          redirect,
          language,
          expires_at: new Date(currentDate.getTime() + 4 * 60 * 60 * 1000), // 4 hours for now
        },
        include: {
          email_delivery: true,
        },
      })

    return ok(userOrganizationJoinConfirmation)
  } catch (e: unknown) {
    if (e instanceof Error) return err(e)

    return err(
      new GraphQLGenericError(
        (e as string) ?? "Unknown error creating confirmation",
      ),
    )
  }
}

interface CancelEmailDeliveriesOptions {
  ctx: Context
  userId: User["id"]
  organizationId: Organization["id"]
  emailTemplateId: EmailTemplate["id"]
  ignoreEmailDeliveries?:
    | EmailDelivery["id"]
    | Array<EmailDelivery["id"] | undefined | null>
    | null
  email?: string
  errorMessage?: string
}
/**
 * Cancel email deliveries attached to specific user, organization and its join template
 * that have not been sent nor failed. Optionally ignore specific email deliveries, ie.
 * if a new one has already been created.
 */
export const cancelEmailDeliveries = async ({
  ctx,
  userId,
  organizationId,
  emailTemplateId,
  email,
  errorMessage,
  ignoreEmailDeliveries,
}: CancelEmailDeliveriesOptions) => {
  const ignoredDeliveryIds = ensureDefinedArray(ignoreEmailDeliveries)

  const { count } = await ctx.prisma.emailDelivery.updateMany({
    where: {
      ...(ignoredDeliveryIds.length && {
        id: { notIn: ignoredDeliveryIds },
      }),
      user_id: userId,
      email,
      email_template_id: emailTemplateId,
      organization_id: organizationId,
      sent: false,
      error: false,
    },
    data: {
      error: { set: true },
      error_message:
        errorMessage ??
        `Email delivery canceled at ${new Date().toISOString()}`,
    },
  })

  if (count) {
    ctx.logger.info(
      `Expired ${count} user organization join email deliver${
        count > 1 ? "ies" : "y"
      } still in the send queue; updated`,
    )
  }
}

interface ExpirePreviousConfirmationsOptions {
  ctx: Context
  userOrganizationJoinConfirmation: UserOrganizationJoinConfirmation
}

/**
 * Expire previous unconfirmed confirmations for specific user/organization relation
 * except the one given as parameter that has just been created/updated.
 */
export const expirePreviousConfirmations = async ({
  ctx,
  userOrganizationJoinConfirmation,
}: ExpirePreviousConfirmationsOptions) => {
  const { count } =
    await ctx.prisma.userOrganizationJoinConfirmation.updateMany({
      where: {
        id: { not: userOrganizationJoinConfirmation.id },
        user_organization_id:
          userOrganizationJoinConfirmation.user_organization_id,
        confirmed: { not: true },
      },
      data: {
        expired: { set: true },
      },
    })

  return count > 0
}
