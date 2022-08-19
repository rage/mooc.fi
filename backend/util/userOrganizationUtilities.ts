import { omit } from "lodash"

import {
  Organization,
  OrganizationRole,
  User,
  UserOrganization,
  UserOrganizationJoinConfirmation,
} from "@prisma/client"

import { Context } from "../context"
import { err, ok, Result } from "./result"

const crypto = require("crypto")

interface CalculateActivationCodeOptions {
  userOrganizationJoinConfirmation: UserOrganizationJoinConfirmation
  user: User
  organization: Organization
}

export const calculateActivationCode = ({
  user,
  organization,
  userOrganizationJoinConfirmation,
}: CalculateActivationCodeOptions): string => {
  const activationCode = crypto
    .createHash("sha256")
    .update(
      userOrganizationJoinConfirmation.id +
        userOrganizationJoinConfirmation.expires_at +
        userOrganizationJoinConfirmation.updated_at +
        userOrganizationJoinConfirmation.email +
        userOrganizationJoinConfirmation.email_delivery_id +
        organization.id +
        user.id +
        organization.secret_key,
    )
    .digest("base64")
    .split("")
    .reduce(
      (acc: number, curr: string, index: number) =>
        (acc * Math.max(1, curr.charCodeAt(0)) * (index + 1)) % 99999,
      1,
    )
    .toString()
    .padStart(5, "0")

  return activationCode
}

export const checkEmailValidity = (
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

interface JoinUserOrganizationOptions {
  ctx: Context
  user: User
  organization: Organization
  organizational_email?: string | null
  organizational_identifier?: string | null
  redirect?: string | null
  language?: string | null
}

export const joinUserOrganization = async ({
  ctx,
  user,
  organization,
  organizational_email,
  organizational_identifier,
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
    return err(new Error("this user/organization relation already exists"))
  }

  const { required_confirmation } = organization

  const now = Date.now()

  const userOrganization = await ctx.prisma.userOrganization.create({
    data: {
      user: { connect: { id: user.id } },
      organization: {
        connect: { id: organization.id },
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

  return ok(userOrganization)
}

interface CancelEmailDeliveriesOptions {
  ctx: Context
  userOrganization: UserOrganization
  organization: Partial<Organization>
  email?: string
  errorMessage?: string
}
export const cancelEmailDeliveries = async ({
  ctx,
  userOrganization,
  organization,
  email,
  errorMessage,
}: CancelEmailDeliveriesOptions) => {
  const { count } = await ctx.prisma.emailDelivery.updateMany({
    where: {
      user_id: userOrganization.user_id,
      email,
      email_template_id: organization.join_organization_email_template_id,
      organization_id: organization.id,
      sent: false,
      error: false,
    },
    data: {
      error: { set: true },
      error_message:
        errorMessage ?? `Email delivery canceled at ${new Date(Date.now())}`,
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

interface CreateUserOrganizationJoinConfirmationOptions {
  ctx: Context
  user: User
  organization: Organization
  userOrganization: UserOrganization
  email: string
  redirect?: string | null
  language?: string | null
}

export const createUserOrganizationJoinConfirmation = async ({
  ctx,
  user,
  organization,
  userOrganization,
  email,
  redirect,
  language,
}: CreateUserOrganizationJoinConfirmationOptions) => {
  const { required_organization_email, join_organization_email_template_id } =
    organization

  const isValid = checkEmailValidity(email, required_organization_email)

  if (isValid.isErr()) {
    return isValid
  }

  if (!join_organization_email_template_id) {
    return err(new Error("no email template associated with this organization"))
  }

  const now = Date.now()

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
        expires_at: new Date(now + 4 * 60 * 60 * 1000), // 4 hours for now
      },
    })

  return ok({
    ...userOrganization,
    user_organization_join_confirmations: [
      omit(userOrganizationJoinConfirmation, "email_delivery"),
    ],
  })
}
