import { ApolloError, ForbiddenError, UserInputError } from "apollo-server-core"

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
import { Context } from "../../context"
import { emptyOrNullToUndefined, ensureDefinedArray, err, isDefined, ok, Result } from "../../util"
import { ConfigurationError, ConflictError } from "../common"

export function assertUserIdOnlyForAdmin(ctx: Context, id?: User["id"] | null) {
  if (!id) {
    return
  }

  const { user, role } = ctx

  if (!user || (user && user.id !== id && role !== Role.ADMIN)) {
    throw new ForbiddenError("invalid credentials to do that")
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
    throw new UserInputError(
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
      new UserInputError(
        "no email specified and no email found in user profile",
      ),
    )
  }

  if (requiredPattern) {
    const emailRegex = new RegExp(requiredPattern)
    if (!emailRegex.test(email)) {
      return err(
        new UserInputError(
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
 * logic. If this somehow fails, delete the created relation (primitive rollback, it really is)
 * and return an error.
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

  const { required_confirmation, join_organization_email_template_id } =
    organization

  if (required_confirmation && !join_organization_email_template_id) {
    return err(
      new ConfigurationError(
        "no email template associated with this organization",
      ),
    )
  }

  const currentDate = new Date()

  // TODO: wrap all in transaction once prisma is updated, so we don't need to do the deletion manually
  const userOrganization = await ctx.prisma.userOrganization.create({
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
      })

    if (createUserOrganizationJoinConfirmationResult.isErr()) {
      await ctx.prisma.userOrganization.delete({
        where: { id: userOrganization.id },
      })

      return createUserOrganizationJoinConfirmationResult
    }
  }

  return ok(userOrganization)
}

interface CreateUserOrganizationJoinConfirmationOptions {
  ctx: Context
  user: User
  organization: Organization
  userOrganization: UserOrganization
  email: string
  redirect?: string | null
  language?: string | null
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
}: CreateUserOrganizationJoinConfirmationOptions) => {
  const { join_organization_email_template_id } = organization

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
      await ctx.prisma.userOrganizationJoinConfirmation.create({
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
      new ApolloError((e as string) ?? "Unknown error creating confirmation"),
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
        id: { not: { in: ignoredDeliveryIds } },
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
