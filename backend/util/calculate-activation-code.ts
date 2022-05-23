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
    .createHash(
      userOrganizationJoinConfirmation.id +
        organization.id +
        user.id +
        organization.secret_key,
    )
    .digest("hex")

  return activationCode
}
