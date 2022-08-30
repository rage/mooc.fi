import { Organization, UserOrganizationJoinConfirmation } from "@prisma/client"

import { FRONTEND_URL } from "../../../../../config"
import { calculateActivationCode } from "../../../../../util/"
import { EmailTemplaterError } from "../../../../lib/errors"
import Template from "../types/Template"
import { TemplateParams } from "../types/TemplateParams"

abstract class OrganizationTemplate extends Template {
  organization: Organization

  constructor(params: TemplateParams) {
    super(params)

    if (!params.organization) {
      throw new EmailTemplaterError(
        "no organization - are you sure you're using the right template?",
      )
    }
    this.organization = params.organization
  }

  async getUserOrganizationJoinConfirmation() {
    // TODO: if we want to have the possibility for an user to have organization memberships
    // in multiple roles, then this will not do
    const userOrganization =
      await this.context.prisma.userOrganization.findFirst({
        where: {
          user: { id: this.user.id },
          organization: { id: this.organization.id },
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

  async getActivationCode(
    userOrganizationJoinConfirmation?: UserOrganizationJoinConfirmation,
  ) {
    const activationCodeResult = await calculateActivationCode({
      prisma: this.context.prisma,
      userOrganizationJoinConfirmation:
        userOrganizationJoinConfirmation ??
        (await this.getUserOrganizationJoinConfirmation()),
    })

    if (activationCodeResult.isErr()) {
      throw activationCodeResult.error
    }

    return activationCodeResult.value
  }
}
export class OrganizationActivationLink extends OrganizationTemplate {
  async resolve() {
    const userOrganizationJoinConfirmation =
      await this.getUserOrganizationJoinConfirmation()
    const activationCode = await this.getActivationCode(
      userOrganizationJoinConfirmation,
    )

    const { language, redirect } = userOrganizationJoinConfirmation
    const baseUrl = `${FRONTEND_URL}${
      language && language !== "fi" ? `/${language}` : ""
    }`

    // TODO: change url to whatever it will be
    return `${baseUrl}/register/${
      userOrganizationJoinConfirmation.id
    }/?code=${activationCode}${redirect ? `&redirect=${redirect}` : ""}`
  }
}

export class OrganizationActivationCode extends OrganizationTemplate {
  async resolve() {
    return this.getActivationCode()
  }
}

export class OrganizationName extends OrganizationTemplate {
  async resolve() {
    const organizationTranslation =
      await this.context.prisma.organizationTranslation.findFirst({
        where: {
          organization_id: this.organization.id,
        },
      })

    return organizationTranslation?.name ?? ""
  }
}
