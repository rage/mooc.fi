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
}: CalculateActivationCodeOptions) => {
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
    .digest("hex")

  return activationCode
}
