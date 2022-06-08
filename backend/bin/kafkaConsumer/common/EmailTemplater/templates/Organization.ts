import {
  Organization,
  User,
  UserOrganizationJoinConfirmation,
} from "@prisma/client"

import { FRONTEND_URL } from "../../../../../config"
import { calculateActivationCode } from "../../../../../util/calculate-activation-code"
import Template from "../types/Template"
import { TemplateContext } from "../types/TemplateContext"

interface TemplateData {
  user: User
  organization: Organization
}

const getUserOrganizationJoinConfirmation = async (
  { user, organization }: TemplateData,
  context: TemplateContext,
): Promise<UserOrganizationJoinConfirmation> => {
  // TODO: if we want to have the possibility for an user to have organization memberships
  // in multiple roles, then this will not do
  const userOrganization = await context.prisma.userOrganization.findFirst({
    where: {
      user: { id: user.id },
      organization: { id: organization.id },
    },
    include: {
      user_organization_join_confirmations: {
        where: {
          expired: false,
        },
        orderBy: { created_at: "desc" },
      },
    },
  })

  if (!userOrganization) {
    throw new Error("this user/organization relation does not exist")
  }

  const { user_organization_join_confirmations } = userOrganization

  if (!user_organization_join_confirmations?.length) {
    throw new Error("no user organization join confirmation found")
  }

  return user_organization_join_confirmations[0]
}

export class OrganizationActivationLink extends Template {
  async resolve() {
    if (!this.organization) {
      throw new Error(
        "no organization - are you sure you're using the right template?",
      )
    }

    const userOrganizationJoinConfirmation =
      await getUserOrganizationJoinConfirmation(
        {
          user: this.user,
          organization: this.organization,
        },
        this.context,
      )

    const activationCode = calculateActivationCode({
      user: this.user,
      organization: this.organization,
      userOrganizationJoinConfirmation,
    })

    const { language, redirect } = userOrganizationJoinConfirmation
    const baseUrl = `${FRONTEND_URL}/${
      language && language !== "fi" ? `${language}/` : ""
    }`

    return `${baseUrl}/register/${
      userOrganizationJoinConfirmation.id
    }/?code=${activationCode}${redirect ? `&redirect=${redirect}` : ""}`
  }
}

export class OrganizationName extends Template {
  async resolve() {
    if (!this.organization) {
      throw new Error(
        "no organization - are you sure you're using the right template?",
      )
    }

    const organizationTranslation =
      await this.context.prisma.organizationTranslation.findFirst({
        where: {
          organization_id: this.organization.id,
        },
      })

    return organizationTranslation?.name ?? ""
  }
}

export class OrganizationActivationCode extends Template {
  async resolve() {
    if (!this.organization) {
      throw new Error(
        "no organization - are you sure you're using the right template?",
      )
    }

    const userOrganizationJoinConfirmation =
      await getUserOrganizationJoinConfirmation(
        {
          user: this.user,
          organization: this.organization,
        },
        this.context,
      )

    const activationCode = calculateActivationCode({
      user: this.user,
      organization: this.organization,
      userOrganizationJoinConfirmation,
    })

    return activationCode
  }
}
