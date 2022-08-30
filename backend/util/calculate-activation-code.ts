import { PrismaClient, UserOrganizationJoinConfirmation } from "@prisma/client"

import { OrphanedEntityError } from "../graphql/common"
import { err, ok, Result } from "../util"

const crypto = require("crypto")

interface CalculateActivationCodeOptions {
  prisma: PrismaClient
  userOrganizationJoinConfirmation: UserOrganizationJoinConfirmation
}

export const calculateActivationCode = async ({
  prisma,
  userOrganizationJoinConfirmation,
}: CalculateActivationCodeOptions): Promise<Result<string, Error>> => {
  const userOrganization = await prisma.userOrganization.findUnique({
    where: {
      id: userOrganizationJoinConfirmation.user_organization_id,
    },
    include: {
      user: true,
      organization: true,
    },
  })

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
