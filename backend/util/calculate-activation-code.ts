import {
  Organization,
  User,
  UserOrganization,
  UserOrganizationJoinConfirmation,
} from "@prisma/client"

import { OrphanedEntityError } from "../graphql/common"
import { type ExtendedPrismaClient } from "../prisma"
import { err, ok, Result } from "../util"

const crypto = require("crypto")

interface CalculateActivationCodeArgs {
  prisma: ExtendedPrismaClient
  userOrganizationJoinConfirmation: UserOrganizationJoinConfirmation &
    {
      user_organization:
        | (UserOrganization & {
            user: User | null
            organization: Organization | null
          })
        | null
    }
}

export const calculateActivationCode = async ({
  prisma,
  userOrganizationJoinConfirmation,
}: CalculateActivationCodeArgs): Promise<Result<string, Error>> => {
  let userOrganization =
    "user_organization" in userOrganizationJoinConfirmation
      ? userOrganizationJoinConfirmation?.user_organization
      : undefined

  if (
    !userOrganization ||
    !userOrganization.user ||
    !userOrganization.organization
  ) {
    userOrganization = await prisma.userOrganization.findUnique({
      where: {
        id: userOrganizationJoinConfirmation.user_organization_id,
      },
      include: {
        user: true,
        organization: true,
      },
    })
  }

  if (
    !userOrganization ||
    !userOrganization.user ||
    !userOrganization.organization
  ) {
    return err(
      new OrphanedEntityError("invalid user/organization relation", {
        parent: "UserOrganizationJoinConfirmation",
        entity: "UserOrganization",
      }),
    )
  }

  const { user, organization } = userOrganization

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

  return ok(activationCode)
}
