import {
  Organization,
  User,
  UserOrganizationJoinConfirmation,
} from "@prisma/client"

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
